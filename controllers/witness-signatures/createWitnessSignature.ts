import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { NewWitnessSignatureAPIParams } from '@/services/apis/contracts/WitnessSignatureAPIService';
import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';

class CreateWitnessSignatureError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateWitnessSignatureError';
    this.code = code;
  }
}

export const createWitnessSignature = async (email: string, { witnessEmail, filledContractId }: NewWitnessSignatureAPIParams): Promise<WitnessSignature> => {
  email = email.trim();
  witnessEmail = witnessEmail.trim();

  if (email === witnessEmail) {
    throw new CreateWitnessSignatureError('PART_OF_CONTRACT');
  }

  await db.prepare();

  const userRepository = db.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new CreateWitnessSignatureError('USER_NOT_FOUND');
  }

  const filledContractRepository = db.getRepository(FilledContract);
  const filledContract = await filledContractRepository.findOne(filledContractId);
  const contractUsers = [ filledContract.buyerId, filledContract.userId ];

  if (!contractUsers.includes(user.id)) {
    throw new CreateWitnessSignatureError('ACCESS_TO_CONTRACT_DENIED');
  }

  const witness = await userRepository.findOne({ where: { email: witnessEmail } });

  if (!witness) {
    throw new CreateWitnessSignatureError('USER_NOT_FOUND');
  }

  if (contractUsers.includes(witness.id)) {
    throw new CreateWitnessSignatureError('PART_OF_CONTRACT');
  }

  if (!witness.name || !witness.birthPlace || !witness.birthDate || !witness.motherName) {
    throw new CreateWitnessSignatureError('WITNESS_NOT_READY');
  }

  const witnessSignatureRepository = db.getRepository(WitnessSignature);
  const existingSignature = await witnessSignatureRepository.findOne({ witnessId: witness.id, filledContract });

  if (existingSignature) {
    throw new CreateWitnessSignatureError('SIGNATURE_ALREADY_EXISTS');
  }

  const witnessSignature = witnessSignatureRepository.create();
  witnessSignature.filledContract = filledContract;
  witnessSignature.witnessId = witness.id;
  witnessSignature.witnessName = witness.name;
  witnessSignature.witnessBirthPlace = witness.birthPlace;
  witnessSignature.witnessBirthDate = witness.birthDate;
  witnessSignature.witnessMotherName = witness.motherName;
  witnessSignature.isLawyer = witness.isLawyer;
  witnessSignature.isSeller = user.id === filledContract.userId;

  await witnessSignatureRepository.insert(witnessSignature);
  return witnessSignature;
};
