import { User } from '@/db/models/auth/User';
import { ItemOption } from '@/db/models/items/ItemOption';
import { FilledItem } from '@/db/models/items/FilledItem';
import { FilledItemOption } from '@/db/models/items/FilledItemOption';
import { FilledOption } from '@/services/apis/items/FilledItemAPIService';
import db from '@/services/db';

import { validateOption } from '@/lib/validateOption';

class FilledItemUpdateError extends Error {
  code: string;
  details: any;

  constructor(code: string, details?: any) {
    super();
    this.name = 'FilledItemUpdateError';
    this.code = code;

    if (details) {
      this.details = details;
    }
  }
}

export const fillItemOptions = async (userEmail: string, itemId: number, friendlyName: string | undefined, options: FilledOption[]) => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledItemRepository = db.getRepository(FilledItem);
  const filledItemOptionsRepository = db.getRepository(FilledItemOption);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new FilledItemUpdateError('USER_NOT_FOUND');
  }

  const filledItem = await filledItemRepository.findOne(itemId, { relations: [ 'item', 'options', 'item.options', 'options.option' ] });
  if (!filledItem || filledItem.userId !== user.id) {
    throw new FilledItemUpdateError('FILLED_ITEM_NOT_FOUND');
  }

  if (typeof friendlyName !== 'undefined') {
    if (friendlyName.length < 2) {
      throw new FilledItemUpdateError('NAME_TOO_SHORT');
    }

    await filledItemRepository.save(filledItem);
  }

  const itemOptions: { [id: number]: ItemOption } = {};
  filledItem.item.options.forEach(option => itemOptions[option.id] = option);

  const currentFilledOptions: { [id: number]: FilledItemOption } = {};
  filledItem.options.forEach(option => currentFilledOptions[option.option.id] = option);

  for await (const option of options) {
    const itemOption = itemOptions[option.id];
    const filledItemOption = currentFilledOptions[option.id];

    if (typeof itemOption === 'undefined') {
      continue;
    }

    validateOption(itemOption, option.value);

    if (typeof filledItemOption !== 'undefined') {
      await filledItemOptionsRepository.update(filledItemOption.id, {
        value: option.value
      });
    } else {
      const newFilledItemOption = filledItemOptionsRepository.create();
      newFilledItemOption.filledItem = filledItem;
      newFilledItemOption.option = itemOption;
      newFilledItemOption.value = option.value;

      await filledItemOptionsRepository.insert(newFilledItemOption);
    }
  }
};
