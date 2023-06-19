import db from '@/services/db';
import { ItemOption } from '@/db/models/items/ItemOption';

import { DeleteItemOptionAPIRequest } from '@/services/apis/items/ItemOptionAPIService';

export const deleteItemOption = async ({ id }: DeleteItemOptionAPIRequest) => {
  await db.prepare();
  const optionRepository = db.getRepository(ItemOption);

  await optionRepository.softDelete({ id });
};
