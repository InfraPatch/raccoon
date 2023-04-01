import { FilledContract, IFilledContract, allPartiesSigned } from '@/db/models/contracts/FilledContract';
import db from '@/services/db';
import { getFilledContract } from './getFilledContract';

class DeleteContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteContractError';
    this.code = code;
  }
}

export const deleteFilledContract = async (email: string, contractId: number): Promise<void> => {
  const filledContract = await getFilledContract(email, contractId) as IFilledContract;

  if (allPartiesSigned(filledContract)) {
    throw new DeleteContractError('CANNOT_DELETE_SIGNED_CONTRACT');
  }

  if (filledContract.user?.email !== email) {
    throw new DeleteContractError('ONLY_SELLER_CAN_DELETE');
  }

  const filledContractRepository = db.getRepository(FilledContract);
  await filledContractRepository.delete(filledContract.id);
};
