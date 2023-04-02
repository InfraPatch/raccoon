import db from '@/services/db';
import { Item } from '@/db/models/items/Item';

import { DeleteItemAPIRequest } from '@/services/apis/items/ItemAPIService';

export const deleteItem = async ({ slug }: DeleteItemAPIRequest) => {
  await db.prepare();
  const itemRepository = db.getRepository(Item);

  await itemRepository.delete({ slug });
};
