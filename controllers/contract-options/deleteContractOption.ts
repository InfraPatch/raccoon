import db from '@/services/db';
import { ContractOption } from '@/db/models/contracts/ContractOption';

import { DeleteContractOptionAPIRequest } from '@/services/apis/contracts/ContractOptionAPIService';

export const deleteContractOption = async ({
  id,
}: DeleteContractOptionAPIRequest) => {
  await db.prepare();
  const optionRepository = db.getRepository(ContractOption);

  await optionRepository.softDelete({ id });
};
