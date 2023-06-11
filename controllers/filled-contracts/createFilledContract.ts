import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { Contract } from '@/db/models/contracts/Contract';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { FilledItem } from '@/db/models/items/FilledItem';

import { NewFilledContractAPIParams } from '@/services/apis/contracts/FilledContractAPIService';

import * as utils from './utils';

class CreateFilledContractError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledContractError';
    this.code = code;
  }
}

export const createFilledContract = async (
  sellerEmail: string,
  {
    friendlyName,
    buyerEmail,
    contractId,
    filledItemId,
  }: NewFilledContractAPIParams,
): Promise<FilledContract> => {
  if (friendlyName.length < 2) {
    throw new CreateFilledContractError('NAME_TOO_SHORT');
  }

  if (buyerEmail.trim() === sellerEmail) {
    throw new CreateFilledContractError('CANT_BE_BOTH_SELLER_AND_BUYER');
  }

  await db.prepare();

  const contractRepository = db.getRepository(Contract);
  const filledContractRepository = db.getRepository(FilledContract);
  const userRepository = db.getRepository(User);
  const filledItemRepository = db.getRepository(FilledItem);

  const contract = await contractRepository.findOne(contractId, {
    relations: ['options', 'item'],
  });
  if (!contract) {
    throw new CreateFilledContractError('UNKNOWN_CONTRACT');
  }

  const buyer = await userRepository.findOne({ where: { email: buyerEmail } });
  if (!buyer) {
    throw new CreateFilledContractError('USER_NOT_FOUND');
  }

  const seller = await userRepository.findOne({
    where: { email: sellerEmail },
  });

  const filledContract = filledContractRepository.create();
  filledContract.friendlyName = friendlyName;
  filledContract.contract = contract;
  filledContract.buyerId = buyer.id;
  filledContract.userId = seller.id;

  if (contract.item) {
    if (!filledItemId) {
      throw new CreateFilledContractError('FILLED_ITEM_NOT_PROVIDED');
    }

    const filledItem = await filledItemRepository.findOne(filledItemId, {
      relations: ['item'],
    });
    if (!filledItem || filledItem.userId !== seller.id) {
      throw new CreateFilledContractError('FILLED_ITEM_NOT_FOUND');
    }

    if (filledItem.item.slug !== contract.item.slug) {
      throw new CreateFilledContractError('FILLED_ITEM_WRONG_CATEGORY');
    }

    filledItem.locked = true;
    await filledItemRepository.save(filledItem);

    filledContract.filledItem = filledItem;
  }

  await filledContractRepository.insert(filledContract);
  await utils.fillDefaultOptions(seller, filledContract, true);

  // TODO: send email to the buyer

  return filledContract;
};
