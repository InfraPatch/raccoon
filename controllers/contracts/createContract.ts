import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

export interface ContractCreatorFields {
  friendlyName?: string;
  description?: string;
};

export class ContractCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractCreationError';
    this.code = code;
  }
}

export const createContract = async ({ friendlyName, description }: ContractCreatorFields): Promise<Contract> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ContractCreationError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ContractCreationError('DESCRIPTION_TOO_SHORT');
  }

  const contractCount = await contractRepository.count({ where: { friendlyName } });

  if (contractCount !== 0) {
    throw new ContractCreationError('CONTRACT_ALREADY_EXISTS');
  }

  const contract = contractRepository.create({ friendlyName, description });
  await contractRepository.insert(contract);
  return contract;
};
