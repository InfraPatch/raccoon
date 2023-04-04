import { FilledContract } from '@/db/models/contracts/FilledContract';
import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';
import { FilledItem } from '@/db/models/items/FilledItem';
import db from '@/services/db';
import { savePDF } from '../filled-contracts/signContract';
import { allPartiesSigned } from '../filled-contracts/signUtils';
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

  const witnessSignatureRepository = db.getRepository(WitnessSignature);
  await witnessSignatureRepository.delete(signature.id);

  // Edge case: both buyer and seller have accepted the contract,
  // but a witness is removed from the contract.
  // We'll still need to generate the PDF!
  const filledContractRepository = db.getRepository(FilledContract);
  const fullContract = await filledContractRepository.findOne(signature.filledContractId, { relations: [ 'contract', 'options', 'contract.options', 'options.option', 'witnessSignatures' ] });

  const filledItemRepository = db.getRepository(FilledItem);

  if (!fullContract) {
    throw new DeleteWitnessSignatureError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (allPartiesSigned(fullContract)) {
    const filename = await savePDF(fullContract);
    fullContract.filename = filename;

    if (fullContract.filledItem) {
      fullContract.filledItem.userId = fullContract.buyerId;
      fullContract.filledItem.locked = false;
      await filledItemRepository.save(fullContract.filledItem);
    }

    await filledContractRepository.update(fullContract.id, { filename });
  }
};
