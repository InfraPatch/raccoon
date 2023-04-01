import { IFilledContract } from './FilledContract';

export enum PartyType {
  BUYER,
  SELLER,
  WITNESS
};

export const getPartyType = (userId: number, contract: IFilledContract): PartyType => {
  if (contract.buyer?.id === userId) {
    return PartyType.BUYER;
  } else if (contract.user?.id === userId) {
    return PartyType.SELLER;
  } else {
    return PartyType.WITNESS;
  }
};
