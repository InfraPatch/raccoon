import { FilledItem, IFilledItem } from '@/db/models/items/FilledItem';
import db from '@/services/db';
import { getFilledItem } from './getFilledItem';

class DeleteItemError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteItemError';
    this.code = code;
  }
}

export const deleteFilledItem = async (email: string, contractId: number): Promise<void> => {
  const filledItem = await getFilledItem(email, contractId) as IFilledItem;

  const filledItemRepository = db.getRepository(FilledItem);
  await filledItemRepository.delete(filledItem.id);
};
