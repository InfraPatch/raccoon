import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';

class GetWitnessSignatureError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetWitnessSignatureError';
    this.code = code;
  }
}

export interface WitnessSignatureResponse {
  user: User;
  signature: WitnessSignature;
}

export const getWitnessSignature = async (email: string, signatureId: number): Promise<WitnessSignatureResponse> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const witnessSignatureRepository = db.getRepository(WitnessSignature);

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new GetWitnessSignatureError('USER_NOT_FOUND');
  }

  const signature = await witnessSignatureRepository.findOne(signatureId, { relations: [ 'filledContract' ] });

  if (!signature) {
    throw new GetWitnessSignatureError('WITNESS_SIGNATURE_NOT_FOUND');
  }

  const filledContract = signature.filledContract;

  if (!user.isAdmin && ![ signature.witnessId, filledContract.userId, filledContract.buyerId ].includes(user.id)) {
    throw new GetWitnessSignatureError('ACCESS_TO_WITNESS_SIGNATURE_DENIED');
  }

  return { user, signature };
};
