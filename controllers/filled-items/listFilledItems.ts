import db from '@/services/db';

import { FilledItem } from '@/db/models/items/FilledItem';
import { User } from '@/db/models/auth/User';

import { ListFilledItemsAPIResponse } from '@/services/apis/items/FilledItemAPIService';

class ListFilledItemsError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'ListFilledItemsError';
    this.code = code;
  }
}

export const listFilledItems = async (email: string, slug: string): Promise<Omit<ListFilledItemsAPIResponse, 'ok'>> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledItemRepository = db.getRepository(FilledItem);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new ListFilledItemsError('USER_NOT_FOUND');
  }

  const filledItems = await filledItemRepository.createQueryBuilder('filledItem')
    .innerJoinAndSelect('filledItem.item', 'item')
    .where('userId = :id', { id: user.id })
    .where('item.slug = :slug', { slug })
    .getMany();

  return {
    filledItems: filledItems.map(item => item.toJSON())
  };
};
