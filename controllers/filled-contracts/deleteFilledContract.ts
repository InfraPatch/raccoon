import {
  FilledContract,
  IFilledContract,
} from '@/db/models/contracts/FilledContract';
import { FilledItem } from '@/db/models/items/FilledItem';
import db from '@/services/db';
import { getFilledContract } from './getFilledContract';
import { allPartiesSigned } from './signUtils';

class DeleteContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteContractError';
    this.code = code;
  }
}

export const deleteFilledContract = async (
  email: string,
  contractId: number,
): Promise<void> => {
  const filledContract = (await getFilledContract(
    email,
    contractId,
  )) as IFilledContract;

  if (allPartiesSigned(filledContract)) {
    throw new DeleteContractError('CANNOT_DELETE_SIGNED_CONTRACT');
  }

  if (filledContract.user?.email !== email) {
    throw new DeleteContractError('ONLY_SELLER_CAN_DELETE');
  }

  const filledContractRepository = db.getRepository(FilledContract);
  const filledItemRepository = db.getRepository(FilledItem);

  if (filledContract.filledItem) {
    filledContract.filledItem.locked = false;
    await filledItemRepository.save(filledContract.filledItem);
  }

  await filledContractRepository.delete(filledContract.id);
};
