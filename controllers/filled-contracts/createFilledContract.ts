import { User } from '@/db/models/auth/User';
import { Contract } from '@/db/models/contracts/Contract';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { NewFilledContractAPIParams } from '@/services/apis/contracts/FilledContractAPIService';

import db from '@/services/db';

class CreateFilledContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledContractError';
    this.code = code;
  }
}

export const createFilledContract = async (sellerEmail: string, { friendlyName, buyerEmail, contractId }: NewFilledContractAPIParams): Promise<FilledContract> => {
  if (friendlyName.length < 2) {
    throw new CreateFilledContractError('NAME_TOO_SHORT');
  }

  await db.prepare();
  const filledContractRepository = db.getRepository(FilledContract);
  const contractRepository = db.getRepository(Contract);
  const userRepository = db.getRepository(User);

  const contract = await contractRepository.findOne(contractId);
  if (!contract) {
    throw new CreateFilledContractError('UNKNOWN_CONTRACT');
  }

  const buyer = await userRepository.findOne({ where: { email: buyerEmail } });
  if (!buyer) {
    throw new CreateFilledContractError('USER_NOT_FOUND');
  }

  const seller = await userRepository.findOne({ where: { email: sellerEmail } });

  const filledContract = filledContractRepository.create();
  filledContract.friendlyName = friendlyName;
  filledContract.contract = contract;
  filledContract.buyerId = buyer.id;
  filledContract.userId = seller.id;

  await filledContractRepository.insert(filledContract);

  // TODO: send email to the buyer

  return filledContract;
};
