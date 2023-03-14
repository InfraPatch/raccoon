import db from '@/services/db';
import { ContractOption } from '@/db/models/contracts/ContractOption';

import { GetContractOptionAPIRequest } from '@/services/apis/contracts/ContractOptionAPIService';

class GetContractOptionError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetContractOptionError';
    this.code = code;
  }
}

export const getContractOption = async ({ id } : GetContractOptionAPIRequest): Promise<ContractOption> => {
  await db.prepare();
  const optionRepository = db.getRepository(ContractOption);

  const option = await optionRepository.findOne({ where: { id } });

  if (!option) {
    throw new GetContractOptionError('OPTION_NOT_FOUND');
  }

  return option;
};
