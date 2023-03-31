import db from '@/services/db';
import { ItemOption } from '@/db/models/items/ItemOption';

import { GetItemOptionAPIRequest } from '@/services/apis/items/ItemOptionAPIService';

class GetItemOptionError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetItemOptionError';
    this.code = code;
  }
}

export const getItemOption = async ({ id }: GetItemOptionAPIRequest): Promise<ItemOption> => {
  await db.prepare();
  const optionRepository = db.getRepository(ItemOption);

  const option = await optionRepository.findOne({ where: { id } });

  if (!option) {
    throw new GetItemOptionError('OPTION_NOT_FOUND');
  }

  return option;
};
