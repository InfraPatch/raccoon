import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import db from '@/services/db';

class FilledContractUpdateError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'FilledContractUpdateError';
    this.code = code;
  }
}

export const acceptOrDeclineFilledContract = async (userEmail: string, contractId: number, action: 'accept' | 'decline'): Promise<void> => {
  await db.prepare();
  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new FilledContractUpdateError('USER_NOT_FOUND');
  }

  const contract = await filledContractRepository.findOne(contractId);
  if (!contract || contract?.buyerId !== user.id) {
    throw new FilledContractUpdateError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (contract.accepted) {
    throw new FilledContractUpdateError('FILLED_CONTRACT_ALREADY_ACCEPTED');
  }

  if (action === 'decline') {
    await filledContractRepository.delete(contract.id);
    return;
  }

  contract.accepted = true;
  await filledContractRepository.save(contract);
};
