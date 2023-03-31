import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';
import db from '@/services/db';
import { getWitnessSignature, WitnessSignatureResponse } from './getWitnessSignature';

class DeleteWitnessSignatureError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteWitnessSignatureError';
    this.code = code;
  }
}

export const deleteWitnessSignature = async (email: string, signatureId: number): Promise<void> => {
  const { signature, user } : WitnessSignatureResponse = await getWitnessSignature(email, signatureId);
  const filledContract = signature.filledContract;

  if (!user.isAdmin && signature.witnessId !== user.id && ((signature.isSeller && filledContract.userId !== user.id) || (!signature.isSeller && filledContract.buyerId !== user.id))) {
    throw new DeleteWitnessSignatureError('ACCESS_TO_WITNESS_SIGNATURE_DENIED');
  }

  if (signature.signedAt) {
    throw new DeleteWitnessSignatureError('WITNESS_ALREADY_SIGNED');
  }

  if (filledContract.sellerSignedAt && filledContract.buyerSignedAt) {
    throw new DeleteWitnessSignatureError('CONTRACT_ALREADY_SIGNED');
  }

  const witnessSignatureRepository = db.getRepository(WitnessSignature);
  await witnessSignatureRepository.delete(signature.id);
};
