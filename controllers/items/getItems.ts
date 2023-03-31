import db from '@/services/db';
import { Item } from '@/db/models/items/Item';

export const getItems = async (): Promise<Item[]> => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  const items = await itemRepository.createQueryBuilder('item')
    .select([ 'item.id', 'item.friendlyName', 'item.description', 'item.updatedAt' ])
    .orderBy('item.updatedAt', 'DESC')
    .getMany();

  return items;
};
