import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContract, IFilledContract } from '@/db/models/contracts/FilledContract';

import { getStorageStrategy } from '@/lib/storageStrategies';
import { isWitnessOf } from './signUtils';
import { validate } from 'uuid';

const storage = getStorageStrategy();

export interface IDownloadPDFResponse {
  stream: any;
  extension: string;
  contentType: string;
};

class GetFilledContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetFilledContractError';
    this.code = code;
  }
}

export const getFilledContract = async (email: string, contractId: number, internal: boolean = false): Promise<FilledContract | IFilledContract> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new GetFilledContractError('USER_NOT_FOUND');
  }

  const filledContract = await filledContractRepository.findOne(contractId, { relations: [ 'contract', 'options', 'contract.options', 'options.option', 'witnessSignatures', 'attachments' ] });
  if (!filledContract) {
    throw new GetFilledContractError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (![ filledContract.userId, filledContract.buyerId ].includes(user.id) && !isWitnessOf(user.id, filledContract)) {
    throw new GetFilledContractError('ACCESS_TO_CONTRACT_DENIED');
  }

  if (internal) {
    return filledContract;
  }

  const buyer = filledContract.buyerId === user.id
    ? user
    : await filledContract.getUser(filledContract.buyerId);

  const contract: IFilledContract = {
    ...filledContract.toJSON(),
    buyer: {
      id: buyer.id,
      createdAt: buyer.createdAt,
      updatedAt: buyer.updatedAt,
      email: buyer.email,
      name: buyer.name
    }
  };

  contract.user = filledContract.userId === user.id
    ? user
    : await filledContract.getUser(filledContract.userId);

  if (filledContract.accepted) {
    contract.buyer = buyer;
  }

  return contract;
};

export const downloadContractDocument = async (filename: string): Promise<IDownloadPDFResponse> => {
  if (!filename) {
    return null;
  }

  const dot = filename.indexOf('.');
  const uuid = filename.substring(0, dot);
  const extension = filename.substring(dot);

  if (!validate(uuid)) {
    // Don't even attempt to load invalid UUIDs for security reasons
    return null;
  }

  if (!(await storage.exists(`documents/${filename}`))) {
    return null;
  }

  const contentType = extension === '.pdf'
    ? 'application/pdf'
    : extension === '.docx'
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/octet-stream';

  const stream = await storage.getStream(`documents/${filename}`);

  return {
    stream,
    extension,
    contentType
  };
};

export const downloadContract = async (email: string, contractId: number): Promise<IDownloadPDFResponse> => {
  const contract = await getFilledContract(email, contractId, true) as FilledContract;

  return await downloadContractDocument(contract.filename);
};

export const downloadContractBy = async (email: string, id: string): Promise<IDownloadPDFResponse> => {
  const documentId = Number(id);

  if (isNaN(documentId)) {
    // Download this contract document by its full filename
    return await downloadContractDocument(id);
  } else {
    // Download this contract document by the contract it's attached to
    return await downloadContract(email, documentId);
  }
};

export const downloadSignature = async (contractId: number, userId: number): Promise<any> => {
  const key = `signatures/${contractId}/${userId}.png`;

  if (!(await storage.exists(key))) {
    return null;
  }

  const stream = await storage.getStream(key);
  return stream;
};

export const downloadSignatureBuffer = async (contractId: number, userId: number): Promise<Buffer> => {
  try {
    return await storage.get(`signatures/${contractId}/${userId}.png`);
  } catch {
    return null;
  }
};

export const downloadSignatureBy = async (email: string, contractId: number, userId: number): Promise<any> => {
  // Check if we can access this contract.
  await getFilledContract(email, contractId, true) as FilledContract;

  // Download this signature using the contract it's attached to
  return await downloadSignature(contractId, userId);
};
