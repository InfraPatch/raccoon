import db from '@/services/db';
import { ItemOption } from '@/db/models/items/ItemOption';

import { GetItemOptionsAPIRequest } from '@/services/apis/items/ItemOptionAPIService';

export class GetItemOptionsError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'GetItemOptionsError';
    this.code = code;
  }
}

export const getItemOptions = async ({
  id,
}: GetItemOptionsAPIRequest): Promise<ItemOption[]> => {
  await db.prepare();
  const optionRepository = db.getRepository(ItemOption);

  if (isNaN(id)) {
    throw new GetItemOptionsError('ITEM_ID_MISSING');
  }

  const items = await optionRepository
    .createQueryBuilder('option')
    .where('option.item = :itemId', { itemId: id })
    .getMany();

  return items;
};
