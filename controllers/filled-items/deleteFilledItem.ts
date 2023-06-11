import { FilledItem, IFilledItem } from '@/db/models/items/FilledItem';
import db from '@/services/db';
import { getFilledItem } from './getFilledItem';

export const deleteFilledItem = async (
  email: string,
  contractId: number,
): Promise<void> => {
  const filledItem = (await getFilledItem(email, contractId)) as IFilledItem;

  const filledItemRepository = db.getRepository(FilledItem);
  await filledItemRepository.delete(filledItem.id);
};
