import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledItem, IFilledItem } from '@/db/models/items/FilledItem';

class GetFilledItemError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetFilledItemError';
    this.code = code;
  }
}

export const getFilledItem = async (email: string, itemId: number, internal: boolean = false): Promise<FilledItem | IFilledItem> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledItemRepository = db.getRepository(FilledItem);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new GetFilledItemError('USER_NOT_FOUND');
  }

  const filledItem = await filledItemRepository.findOne(itemId, { relations: [ 'item', 'options', 'item.options', 'options.option', 'attachments' ] });
  if (!filledItem) {
    throw new GetFilledItemError('FILLED_ITEM_NOT_FOUND');
  }

  if (filledItem.userId !== user.id) {
    throw new GetFilledItemError('ACCESS_TO_ITEM_DENIED');
  }

  if (internal) {
    return filledItem;
  }

  const item: IFilledItem = filledItem.toJSON();

  item.user = filledItem.userId === user.id
    ? user
    : await filledItem.getUser(filledItem.userId);

  return item;
};
