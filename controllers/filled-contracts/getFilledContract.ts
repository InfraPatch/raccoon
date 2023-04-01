import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContract, IFilledContract } from '@/db/models/contracts/FilledContract';

import { getStorageStrategy } from '@/lib/storageStrategies';
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

  const filledContract = await filledContractRepository.findOne(contractId, { relations: [ 'contract', 'options', 'contract.options', 'options.option', 'witnessSignatures' ] });
  if (!filledContract) {
    throw new GetFilledContractError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (![ filledContract.userId, filledContract.buyerId ].includes(user.id)) {
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

export const downloadContract = async (email: string, contractId: number): Promise<IDownloadPDFResponse> => {
  const contract = await getFilledContract(email, contractId, true) as FilledContract;

  if (!contract.filename) {
    return null;
  }

  if (!(await storage.exists(`documents/${contract.filename}`))) {
    return null;
  }

  const extension = contract.filename.split('.').pop()?.toLowerCase();
  const contentType = extension === 'pdf'
    ? 'application/pdf'
    : extension === 'docx'
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/octet-stream';

  const stream = await storage.getStream(`documents/${contract.filename}`);

  return {
    stream,
    extension,
    contentType
  };
};
