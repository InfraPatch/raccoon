import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

import { DeleteContractAPIRequest } from '@/services/apis/contracts/ContractAPIService';

export const deleteContract = async ({ id }: DeleteContractAPIRequest) => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  await contractRepository.softDelete({ id });
};
