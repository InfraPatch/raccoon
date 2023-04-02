import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { NewFilledContractAttachmentAPIParams } from '@/services/apis/contracts/FilledContractAttachmentAPIService';
import { FilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';
import { File } from 'formidable';

import sanitize from 'sanitize-filename';

import * as fs from 'fs';

import { getStorageStrategy } from '@/lib/storageStrategies';
import { createAttachments } from '../filled-contracts/signContract';
import { maximumAttachmentCount, maximumAttachmentSize } from './filledContractAttachmentController';
const storage = getStorageStrategy();

class CreateFilledContractAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledContractAttachmentError';
    this.code = code;
  }
}

const uploadAttachment = async (filledContractId: number, file: File) => {
  const buffer = fs.readFileSync(file.path);
  const filename = sanitize(file.name);

  if (filename?.length === 0) {
    throw new CreateFilledContractAttachmentError('INVALID_ATTACHMENT');
  }

  const dot = filename.indexOf('.');
  const basename = filename.substring(0, dot);
  const extension = filename.substring(dot);
  let index = 1;

  let key: string = `contract-attachments/${filledContractId}/${basename}${extension}`;

  do {
    key = `contract-attachments/${filledContractId}/${basename}_${index++}${extension}`;
  } while (await storage.exists(key));

  await storage.create({ key, contents: buffer });

  return key;
};

export const createFilledContractAttachment = async (email: string, payload: Omit<NewFilledContractAttachmentAPIParams, 'file'> & { file?: File }): Promise<FilledContractAttachment> => {
  if (!payload.friendlyName || payload.friendlyName.trim().length < 2) {
    throw new CreateFilledContractAttachmentError('NAME_TOO_SHORT');
  }

  if (!payload.file || payload.file.name.startsWith('avdh-')) {
    throw new CreateFilledContractAttachmentError('INVALID_ATTACHMENT');
  }

  if (payload.file.size > maximumAttachmentSize) {
    throw new CreateFilledContractAttachmentError('ATTACHMENT_TOO_LARGE');
  }

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
    filledContractAttachment.filename = await uploadAttachment(filledContract.id, payload.file);
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
