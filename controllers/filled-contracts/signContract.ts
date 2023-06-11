import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { FilledContractOption } from '@/db/models/contracts/FilledContractOption';

import db from '@/services/db';
import { IPDFAttachment, pdfService } from '@/services/pdf';
import { IAVDHAttestation } from '@/services/avdh';

import PizZip from 'pizzip';
import DOCXTemplater from 'docxtemplater';

import { v4 as uuid } from 'uuid';

import { formatDate } from '@/lib/formatDate';
import { OptionType } from '@/db/common/OptionType';
import { getPersonalIdentifierTypeString } from '@/lib/getPersonalIdentifierTypeString';
import { allPartiesSigned, hasWitnessSigned, isWitnessOf } from './signUtils';
import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';
import { IAttachment } from '@/db/common/Attachment';

import path from 'path';

import { getStorageStrategy } from '@/lib/storageStrategies';
import { maximumSignatureSize } from '../attachments/attachmentConstants';
import { downloadSignatureBuffer } from './getFilledContract';
import { IFilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';
import { IFilledItemAttachment } from '@/db/models/items/FilledItemAttachment';
import { FilledItemOption } from '@/db/models/items/FilledItemOption';
import { FilledItem } from '@/db/models/items/FilledItem';

const storage = getStorageStrategy();

class SignContractError extends Error {
  code: string;
  details: any;

  constructor(code: string, details?: any) {
    super();
    this.name = 'SignContractError';
    this.code = code;

    if (details) {
      this.details = details;
    }
  }
}

const verifyOptions = (filledContract: FilledContract) => {
  const filledContractOptions: { [id: number]: FilledContractOption } = {};
  filledContract.options.forEach(
    (option) => (filledContractOptions[option.option.id] = option),
  );

  for (const option of filledContract.contract.options) {
    const filledOption = filledContractOptions[option.id];

    if (
      typeof filledOption === 'undefined' ||
      typeof filledOption.value === 'undefined' ||
      filledOption.value === ''
    ) {
      throw new SignContractError('FIELD_IS_REQUIRED', {
        friendlyName: option.friendlyName,
      });
    }
  }
};

export const createAttachments = async (
  attachments: IAttachment[],
): Promise<IPDFAttachment[]> => {
  const pdfAttachments: IPDFAttachment[] = [];

  if (!attachments) {
    // No attachments are to be added to this file.
    return pdfAttachments;
  }

  for (const attachment of attachments) {
    try {
      let attachmentBytes: Buffer;

      if ('filledContractId' in attachment) {
        const contractAttachment = attachment as IFilledContractAttachment;
        attachmentBytes = await storage.get(
          `attachments/contract/${contractAttachment.filledContractId}/${contractAttachment.filename}`,
        );
      } else if ('filledItemId' in attachment) {
        const itemAttachment = attachment as IFilledItemAttachment;
        attachmentBytes = await storage.get(
          `attachments/item/${itemAttachment.filledItemId}/${itemAttachment.filename}`,
        );
      }

      pdfAttachments.push({
        file: attachmentBytes,
        filename: path.basename(attachment.filename),
        description: attachment.friendlyName,
        creationDate: attachment.createdAt,
      });
    } catch {
      // For now, let's ignore this error.
    }
  }

  return pdfAttachments;
};

export const savePDF = async (
  filledContract: FilledContract,
): Promise<string> => {
  const template: Buffer = await storage.get(
    filledContract.contract.filename.replace('/', ''),
  );
  const zip = new PizZip(template);

  const templateDocument = new DOCXTemplater(zip);

  const data: { [key: string]: string } = {};

  const handleOption = (o: FilledContractOption | FilledItemOption) => {
    if (o.option.type === OptionType.DATE) {
      data[o.option.replacementString] = formatDate(o.value);
      return;
    }

    if (o.option.type === OptionType.PERSONAL_IDENTIFIER) {
      data[o.option.replacementString] = getPersonalIdentifierTypeString(
        parseInt(o.value),
      );
      return;
    }

    data[o.option.replacementString] = o.value;
  };

  filledContract.options.forEach(handleOption);

  if (filledContract.filledItem && filledContract.filledItem.options) {
    filledContract.filledItem.options.forEach(handleOption);
  }

  const sellerName = filledContract.options.find(
    (o) => o.option.replacementString === 'seller_name',
  ).value;
  const buyerName = filledContract.options.find(
    (o) => o.option.replacementString === 'buyer_name',
  ).value;

  // Add attestations for seller and buyer
  const attestations: IAVDHAttestation[] = [
    {
      date: filledContract.sellerSignedAt,
      fullName: sellerName,
      birthName: sellerName,
      birthPlace: filledContract.options.find(
        (o) => o.option.replacementString === 'seller_birth_place',
      ).value,
      birthDate: filledContract.options.find(
        (o) => o.option.replacementString === 'seller_birth_date',
      ).value,
      motherName: filledContract.options.find(
        (o) => o.option.replacementString === 'seller_mother_name',
      ).value,
      email: filledContract.options.find(
        (o) => o.option.replacementString === 'seller_email',
      ).value,
      signature: await downloadSignatureBuffer(
        filledContract.id,
        filledContract.userId,
      ),
    },
    {
      date: filledContract.buyerSignedAt,
      fullName: buyerName,
      birthName: buyerName,
      birthPlace: filledContract.options.find(
        (o) => o.option.replacementString === 'buyer_birth_place',
      ).value,
      birthDate: filledContract.options.find(
        (o) => o.option.replacementString === 'buyer_birth_date',
      ).value,
      motherName: filledContract.options.find(
        (o) => o.option.replacementString === 'buyer_mother_name',
      ).value,
      email: filledContract.options.find(
        (o) => o.option.replacementString === 'buyer_email',
      ).value,
      signature: await downloadSignatureBuffer(
        filledContract.id,
        filledContract.buyerId,
      ),
    },
  ];

  // Add attestations for witnesses as well
  for (const signature of filledContract.witnessSignatures) {
    attestations.push({
      date: signature.signedAt,
      fullName: signature.witnessName,
      birthName: signature.witnessName,
      birthPlace: signature.witnessBirthPlace,
      birthDate: formatDate(signature.witnessBirthDate, false),
      motherName: signature.witnessMotherName,
      signature: await downloadSignatureBuffer(
        filledContract.id,
        signature.witnessId,
      ),
    });
  }

  data['signature_date'] = formatDate(new Date(), false);
  data['seller_signature'] = sellerName.toUpperCase();
  data['buyer_signature'] = buyerName.toUpperCase();

  templateDocument.setData(data);
  templateDocument.render();

  const document: Buffer = templateDocument
    .getZip()
    .generate({ type: 'nodebuffer' });
  const attachments: IPDFAttachment[] = await createAttachments(
    filledContract.attachments,
  );

  if (filledContract.filledItem && filledContract.filledItem.attachments) {
    attachments.push(
      ...(await createAttachments(filledContract.filledItem.attachments)),
    );
  }

  const pdf = await pdfService.create(document, attachments, attestations);

  let key: string | null = null;

  do {
    key = `${uuid()}.pdf`;
  } while (await storage.exists(`documents/${key}`));

  await storage.create({ key: `documents/${key}`, contents: pdf });

  return key;
};

export const decodeBase64Image = (data: string | null): Buffer => {
  if (!data) {
    throw new Error('No string specified');
  }

  if (data.length > maximumSignatureSize) {
    throw new Error('String is too large');
  }

  const matches = data.match(/^data:image\/png;base64,(.+)$/);

  if (matches.length !== 2) {
    throw new Error('Invalid input string');
  }

  return Buffer.from(matches[1], 'base64');
};

export const uploadSignatureContents = async (
  contractId: number,
  userId: number,
  contents: Buffer,
): Promise<string> => {
  const key = `signatures/${contractId}/${userId}.png`;

  await storage.create({ key, contents });
  return key;
};

export const uploadSignature = async (
  contractId: number,
  userId: number,
  data: string | null,
): Promise<string> => {
  let signatureContents;

  try {
    signatureContents = decodeBase64Image(data);
    return await uploadSignatureContents(contractId, userId, signatureContents);
  } catch {
    return null;
  }
};

export const signContract = async (
  userEmail: string,
  contractId: number,
  signatureData: string | null,
) => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);
  const filledItemRepository = db.getRepository(FilledItem);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new SignContractError('USER_NOT_FOUND');
  }

  const contract = await filledContractRepository.findOne(contractId, {
    relations: [
      'contract',
      'options',
      'contract.options',
      'options.option',
      'witnessSignatures',
      'attachments',
      'filledItem',
      'filledItem.item',
      'filledItem.attachments',
      'filledItem.options',
      'filledItem.options.option',
    ],
  });
  if (!contract) {
    throw new SignContractError('FILLED_CONTRACT_NOT_FOUND');
  }

  const isWitness = isWitnessOf(user.id, contract);

  if (!isWitness && ![contract.userId, contract.buyerId].includes(user.id)) {
    throw new SignContractError('ACCESS_TO_CONTRACT_DENIED');
  }

  if (
    (contract.userId === user.id && contract.sellerSignedAt) ||
    (contract.buyerId === user.id && contract.buyerSignedAt) ||
    (isWitness && hasWitnessSigned(user.id, contract))
  ) {
    throw new SignContractError('CONTRACT_ALREADY_SIGNED');
  }

  verifyOptions(contract);

  // Upload signature if available
  await uploadSignature(contract.id, user.id, signatureData);

  let changed = false;

  if (isWitness) {
    const witnessSignatureRepository = db.getRepository(WitnessSignature);

    for (const signature of contract.witnessSignatures) {
      if (signature.witnessId === user.id) {
        signature.signedAt = new Date();
        await witnessSignatureRepository.update(
          { id: signature.id },
          { signedAt: signature.signedAt },
        );
        break;
      }
    }

    changed = true;
  } else if (contract.userId === user.id) {
    contract.sellerSignedAt = new Date();
    changed = true;
  } else if (contract.buyerId === user.id) {
    contract.buyerSignedAt = new Date();
    changed = true;
  }

  if (allPartiesSigned(contract)) {
    const filename = await savePDF(contract);
    contract.filename = filename;
    changed = true;

    if (contract.filledItem) {
      contract.filledItem.userId = contract.buyerId;
      contract.filledItem.locked = false;
      await filledItemRepository.save(contract.filledItem);
    }
  }

  if (changed) {
    filledContractRepository.save(contract);
  }
};
