import db from '@/services/db';
import { Item } from '@/db/models/items/Item';
import { NewItemAPIRequest } from '@/services/apis/items/ItemAPIService';

import slugify from '@sindresorhus/slugify';

export class ItemCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ItemCreationError';
    this.code = code;
  }
}

export const createItem = async ({ friendlyName, slug, description }: NewItemAPIRequest): Promise<Item> => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ItemCreationError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ItemCreationError('DESCRIPTION_TOO_SHORT');
  }

  if (!slug || slug.trim().length < 2) {
    slug = slugify(friendlyName);
  } else {
    slug = slugify(slug);
  }

  const itemCount = await itemRepository.count({ where: { slug } });

  if (itemCount !== 0) {
    throw new ItemCreationError('ITEM_ALREADY_EXISTS');
  }

  const item = itemRepository.create({ friendlyName, slug, description });
  await itemRepository.insert(item);

  return item;
};
