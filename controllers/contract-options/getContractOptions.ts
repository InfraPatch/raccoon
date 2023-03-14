import db from '@/services/db';
import { ContractOption } from '@/db/models/contracts/ContractOption';
import { GetContractOptionsAPIRequest } from '@/services/apis/contracts/ContractOptionAPIService';

export class GetContractOptionsError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'GetContractOptionsError';
    this.code = code;
  }
}

export const getContractOptions = async ({ id } : GetContractOptionsAPIRequest): Promise<ContractOption[]> => {
  await db.prepare();
  const optionRepository = db.getRepository(ContractOption);

  if (isNaN(id)) {
    throw new GetContractOptionsError('CONTRACT_ID_MISSING');
  }

  const contracts = await optionRepository.createQueryBuilder('option')
    .where('option.contract = :contractId', { contractId: id })
    .getMany();

  return contracts;
};
