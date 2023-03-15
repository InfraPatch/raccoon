import db from '@/services/db';

import { FilledContract } from '@/db/models/contracts/FilledContract';
import { User } from '@/db/models/auth/User';

import { ListFillContractsAPIResponse } from '@/services/apis/contracts/FilledContractAPIService';

class ListFilledContractsError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'ListFilledContractsError';
    this.code = code;
  }
}

export const listFilledContracts = async (email: string): Promise<Omit<ListFillContractsAPIResponse, 'ok'>> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new ListFilledContractsError('USER_NOT_FOUND');
  }

  const filledContracts = await filledContractRepository.find({ where: [
    { userId: user.id },
    { buyerId: user.id }
  ], relations: [ 'contract' ] });

  return {
    own: filledContracts.filter(c => c.userId === user.id).map(fc => fc.toJSON()),
    foreign: filledContracts.filter(c => c.buyerId === user.id).map(fc => fc.toJSON())
  };
};
