import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

export const getContracts = async (): Promise<Contract[]> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  const contracts = await contractRepository.createQueryBuilder('contract')
  .select(['contract.id', 'contract.friendlyName', 'contract.description', 'contract.filename', 'contract.updatedAt'])
  .getMany();

  return contracts;
};
