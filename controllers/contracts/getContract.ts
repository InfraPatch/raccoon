import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

import { GetContractAPIRequest } from '@/services/apis/contracts/ContractAPIService';

class GetContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetContractError';
    this.code = code;
  }
}

export const getContract = async ({
  id,
}: GetContractAPIRequest): Promise<Contract> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  const contract = await contractRepository.findOne(
    { id },
    { relations: ['options', 'item'] },
  );

  if (!contract) {
    throw new GetContractError('CONTRACT_NOT_FOUND');
  }

  return contract;
};
