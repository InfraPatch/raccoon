import db from '@/services/db';

import { File } from 'formidable';

import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { NewFilledContractAttachmentAPIParams } from '@/services/apis/contracts/FilledContractAttachmentAPIService';
import { FilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';
import { maximumAttachmentCount, maximumAttachmentSize } from '../attachments/attachmentConstants';
import { uploadAttachment, verifyAttachment } from '../attachments/createAttachment';
import { Attachment } from '@/db/common/Attachment';

class CreateFilledContractAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledContractAttachmentError';
    this.code = code;
  }
}

export const createFilledContractAttachment = async (email: string, payload: Omit<NewFilledContractAttachmentAPIParams, 'file'> & { file?: File }): Promise<FilledContractAttachment> => {
  verifyAttachment(payload.friendlyName, payload.file);

  await db.prepare();

  const userRepository = db.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new CreateFilledContractAttachmentError('USER_NOT_FOUND');
  }

  const filledContractRepository = db.getRepository(FilledContract);
  const filledContract = await filledContractRepository.findOne(payload.filledContractId, { relations: [ 'attachments' ] });
  const contractUsers = [ filledContract.buyerId, filledContract.userId ];

  if (!contractUsers.includes(user.id)) {
    throw new CreateFilledContractAttachmentError('ACCESS_TO_CONTRACT_DENIED');
  }

  const isBuyer = (user.id === filledContract.buyerId);

  if (isBuyer && !filledContract.accepted) {
    throw new CreateFilledContractAttachmentError('ACCESS_TO_CONTRACT_DENIED');
  }

  if ((isBuyer && filledContract.buyerSignedAt) || (!isBuyer && filledContract.sellerSignedAt)) {
    throw new CreateFilledContractAttachmentError('CONTRACT_ALREADY_SIGNED');
  }

  if (filledContract.attachments.length >= maximumAttachmentCount) {
    throw new CreateFilledContractAttachmentError('MAX_ATTACHMENTS_REACHED');
  }

  const filledContractAttachmentRepository = db.getRepository(FilledContractAttachment);
  const filledContractAttachment = filledContractAttachmentRepository.create();

  try {
    filledContractAttachment.filename = await uploadAttachment('contract', filledContract.id, payload.file);
  } catch (err) {
    console.error(err);
    throw new CreateFilledContractAttachmentError('ATTACHMENT_UPLOAD_FAILED');
  }

  filledContractAttachment.filledContract = filledContract;
  filledContractAttachment.friendlyName = payload.friendlyName;
  filledContractAttachment.isSeller = !isBuyer;

  await filledContractAttachmentRepository.insert(filledContractAttachment);
  return filledContractAttachment;
};
