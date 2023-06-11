import db from '@/services/db';
import { Item } from '@/db/models/items/Item';

import { GetItemAPIRequest } from '@/services/apis/items/ItemAPIService';

class GetItemError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetItemError';
    this.code = code;
  }
}

export const getItem = async ({ slug }: GetItemAPIRequest): Promise<Item> => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  const item = await itemRepository.findOne({
    where: { slug },
    relations: ['options'],
  });

  if (!item) {
    throw new GetItemError('ITEM_NOT_FOUND');
  }

  return item;
};
