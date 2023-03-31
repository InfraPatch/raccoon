import db from '@/services/db';
import { Item } from '@/db/models/items/Item';
import { NewItemAPIRequest } from '@/services/apis/items/ItemAPIService';

export class ItemCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ItemCreationError';
    this.code = code;
  }
}

export const createItem = async ({ friendlyName, description }: NewItemAPIRequest): Promise<Item> => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ItemCreationError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ItemCreationError('DESCRIPTION_TOO_SHORT');
  }

  const itemCount = await itemRepository.count({ where: { friendlyName } });

  if (itemCount !== 0) {
    throw new ItemCreationError('ITEM_ALREADY_EXISTS');
  }

  const item = itemRepository.create({ friendlyName, description });
  await itemRepository.insert(item);

  return item;
};
