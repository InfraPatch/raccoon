import db from '@/services/db';
import { Item } from '@/db/models/items/Item';

import { UpdateItemAPIRequest } from '@/services/apis/items/ItemAPIService';

export class ItemUpdateError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ItemUpdateError';
    this.code = code;
  }
}

export const updateItem = async (id: number, { friendlyName, description }: UpdateItemAPIRequest): Promise<Item> => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ItemUpdateError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ItemUpdateError('DESCRIPTION_TOO_SHORT');
  }

  const item = await itemRepository.findOne(id);
  if (!item) {
    throw new ItemUpdateError('CONTRACT_NOT_FOUND');
  }

  item.friendlyName = friendlyName;
  item.description = description;

  itemRepository.save(item);

  return item;
};
