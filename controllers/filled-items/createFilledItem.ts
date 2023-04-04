import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { Item } from '@/db/models/items/Item';
import { FilledItem } from '@/db/models/items/FilledItem';
import { NewFilledItemAPIParams } from '@/services/apis/items/FilledItemAPIService';
import { ItemOption } from '@/db/models/items/ItemOption';
import { validateOption } from '@/lib/validateOption';
import { FilledItemOption } from '@/db/models/items/FilledItemOption';

class CreateFilledItemsError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledItemsError';
    this.code = code;
  }
}

export const createFilledItem = async (ownerEmail: string, { friendlyName, itemSlug, options }: NewFilledItemAPIParams): Promise<FilledItem> => {
  if (friendlyName.length < 2) {
    throw new CreateFilledItemsError('NAME_TOO_SHORT');
  }

  await db.prepare();

  const itemRepository = db.getRepository(Item);
  const filledItemsRepository = db.getRepository(FilledItem);
  const filledItemOptionsRepository = db.getRepository(FilledItemOption);
  const userRepository = db.getRepository(User);

  const item = await itemRepository.findOne({
    where: { slug: itemSlug },
    relations: [ 'options' ]
  });

  if (!item) {
    throw new CreateFilledItemsError('UNKNOWN_ITEM');
  }

  const itemOptions: { [id: number]: ItemOption } = {};
  item.options.forEach(option => itemOptions[option.id] = option);

  for (const option of options) {
    const itemOption = itemOptions[option.id];

    if (typeof itemOption === 'undefined') {
      continue;
    }

    const error = validateOption(itemOption, option.value);

    if (error) {
      throw error;
    }
  }

  const owner = await userRepository.findOne({ where: { email: ownerEmail } });

  const filledItem = filledItemsRepository.create();
  filledItem.friendlyName = friendlyName;
  filledItem.item = item;
  filledItem.userId = owner.id;

  await filledItemsRepository.insert(filledItem);

  for await (const option of options) {
    const itemOption = itemOptions[option.id];

    if (typeof itemOption === 'undefined') {
      continue;
    }

    const newFilledItemOption = filledItemOptionsRepository.create();
    newFilledItemOption.filledItem = filledItem;
    newFilledItemOption.option = itemOption;
    newFilledItemOption.value = option.value;

    await filledItemOptionsRepository.insert(newFilledItemOption);
  }

  return filledItem;
};
