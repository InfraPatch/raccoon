import db from '@/services/db';

import { FilledContract } from '@/db/models/contracts/FilledContract';
import { User } from '@/db/models/auth/User';

import { ListFillContractsAPIResponse } from '@/services/apis/contracts/FilledContractAPIService';
import { WitnessSignature } from '@/db/models/contracts/WitnessSignature';

class ListFilledContractsError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'ListFilledContractsError';
    this.code = code;
  }
}

export const listFilledContracts = async (email: string): Promise<Omit<ListFillContractsAPIResponse, 'ok'>> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);
  const witnessSignatureRepository = db.getRepository(WitnessSignature);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new ListFilledContractsError('USER_NOT_FOUND');
  }

  const filledContracts = await filledContractRepository.find({ where: [
    { userId: user.id },
    { buyerId: user.id },
  ], relations: [ 'contract', 'filledItem' ] });

  const witnessSignatures = await witnessSignatureRepository.find({ where: [
    { witnessId: user.id }
  ], relations: [ 'filledContract', 'filledContract.contract' ] });

  // Here's a little lesson in trickery
  const witnessContracts = witnessSignatures.map(s => s.filledContract) as FilledContract[];
  const allContracts = filledContracts.concat(witnessContracts);

  const detailedFilledContracts = await Promise.all(allContracts.map(async contract => {
    const filledContract = contract.toJSON();

    if (contract.userId !== user.id) {
      const seller = await contract.getUser(contract.userId);
      filledContract.user = {
        name: seller.name,
        email: seller.email
      };
    }

    if (contract.buyerId !== user.id) {
      const buyer = await contract.getUser(contract.buyerId);
      filledContract.buyer = {
        name: buyer.name,
        email: buyer.email
      };
    }

    return filledContract;
  }));

  return {
    own: detailedFilledContracts.filter(c => c.userId === user.id),
    foreign: detailedFilledContracts.filter(c => c.buyerId === user.id),
    witness: detailedFilledContracts.filter(c => c.userId !== user.id && c.buyerId !== user.id)
  };
};
