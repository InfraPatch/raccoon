import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { Item } from '@/db/models/items/Item';
import { FilledItem } from '@/db/models/items/FilledItem';
import { NewFilledItemAPIParams } from '@/services/apis/items/FilledItemAPIService';

class CreateFilledItemsError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledItemsError';
    this.code = code;
  }
}

export const createFilledItem = async (ownerEmail: string, { friendlyName, itemId }: NewFilledItemAPIParams): Promise<FilledItem> => {
  if (friendlyName.length < 2) {
    throw new CreateFilledItemsError('NAME_TOO_SHORT');
  }

  await db.prepare();

  const itemRepository = db.getRepository(Item);
  const filledItemsRepository = db.getRepository(FilledItem);
  const userRepository = db.getRepository(User);

  const item = await itemRepository.findOne(itemId, { relations: [ 'options' ] });
  if (!item) {
    throw new CreateFilledItemsError('UNKNOWN_ITEM');
  }

  const owner = await userRepository.findOne({ where: { email: ownerEmail } });

  const filledItem = filledItemsRepository.create();
  filledItem.friendlyName = friendlyName;
  filledItem.item = item;
  filledItem.userId = owner.id;

  await filledItemsRepository.insert(filledItem);
  return filledItem;
};
