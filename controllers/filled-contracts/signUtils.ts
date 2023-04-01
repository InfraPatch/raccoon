import { IFilledContract } from '@/db/models/contracts/FilledContract';

export const isWitnessOf = (userId: number, contract: IFilledContract) : boolean => {
  for (const signature of contract.witnessSignatures) {
    if (signature.witnessId === userId) {
      return true;
    }
  }

  return false;
};

export const hasWitnessSigned = (userId: number, contract: IFilledContract) : boolean => {
  for (const signature of contract.witnessSignatures) {
    if (signature.witnessId === userId) {
      return !!signature.signedAt;
    }
  }

  return false;
};

export const allWitnessesSigned = (contract: IFilledContract) : boolean => {
  for (const signature of contract.witnessSignatures) {
    if (!signature.signedAt) {
      return false;
    }
  }

  return true;
};

export const allPartiesSigned = (contract: IFilledContract) : boolean => {
  return contract.sellerSignedAt && contract.buyerSignedAt && allWitnessesSigned(contract);
};
