import db from '@/services/db';
import { Item } from '@/db/models/items/Item';

import { DeleteItemAPIRequest } from '@/services/apis/items/ItemAPIService';

export const deleteItem = async ({ id }: DeleteItemAPIRequest) => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  await itemRepository.delete({ id });
};
