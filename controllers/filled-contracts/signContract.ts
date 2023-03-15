import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { FilledContractOption } from '@/db/models/contracts/FilledContractOption';
import db from '@/services/db';

import PizZip from 'pizzip';
import DOCXTemplater from 'docxtemplater';

import { v4 as uuid } from 'uuid';

import { getStorageStrategy } from '@/lib/storageStrategies';
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
  filledContract.options.forEach(option => filledContractOptions[option.option.id] = option);

  for (const option of filledContract.contract.options) {
    const filledOption = filledContractOptions[option.id];

    if (typeof filledOption === 'undefined') {
      throw new SignContractError('FIELD_IS_REQUIRED', {
        friendlyName: option.friendlyName
      });
    }
  }
};

const savePDF = async (filledContract: FilledContract): Promise<string> => {
  const template: Buffer = await storage.get(filledContract.contract.filename.replace('/', ''));
  const zip = new PizZip(template);

  const templateDocument = new DOCXTemplater(zip);

  const data: { [key: string]: string } = {};
  filledContract.options.forEach(o => data[o.option.replacementString] = o.value);

  const sellerName = filledContract.options.find(o => o.option.replacementString === 'seller_name').value;
  const buyerName = filledContract.options.find(o => o.option.replacementString === 'buyer_name').value;

  data['signature_date'] = new Date().toISOString();
  data['seller_signature'] = sellerName.toUpperCase();
  data['buyer_signature'] = buyerName.toUpperCase();

  templateDocument.setData(data);
  templateDocument.render();

  // TODO: find a library that can convert docx to pdf

  const document: Buffer = templateDocument.getZip().generate({ type: 'nodebuffer' });

  let key: string | null = null;

  do {
    key = `${uuid()}.docx`;
  } while (await storage.exists(`documents/${key}`));

  await storage.create({ key: `documents/${key}`, contents: document });

  return key;
};

export const signContract = async (userEmail: string, contractId: number) => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new SignContractError('USER_NOT_FOUND');
  }

  const contract = await filledContractRepository.findOne(contractId, { relations: [ 'contract', 'options', 'contract.options', 'options.option' ] });
  if (!contract) {
    throw new SignContractError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (![ contract.userId, contract.buyerId ].includes(user.id)) {
    throw new SignContractError('ACCESS_TO_CONTRACT_DENIED');
  }

  if ((contract.userId === user.id && contract.sellerSignedAt) || (contract.buyerId === user.id && contract.buyerSignedAt)) {
    throw new SignContractError('CONTRACT_ALREADY_SIGNED');
  }

  verifyOptions(contract);

  let changed: boolean = false;

  if (contract.userId === user.id) {
    contract.sellerSignedAt = new Date();
    changed = true;
  } else if (contract.buyerId === user.id) {
    contract.buyerSignedAt = new Date();
    changed = true;
  }

  if (contract.sellerSignedAt && contract.buyerSignedAt) {
    const filename = await savePDF(contract);
    contract.filename = filename;
    changed = true;
  }

  if (changed) {
    filledContractRepository.save(contract);
  }
};
