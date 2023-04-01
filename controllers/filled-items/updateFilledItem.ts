import { User } from '@/db/models/auth/User';
import { ItemOption } from '@/db/models/items/ItemOption';
import { FilledItem } from '@/db/models/items/FilledItem';
import { FilledItemOption } from '@/db/models/items/FilledItemOption';
import { FilledOption } from '@/services/apis/items/FilledItemAPIService';
import { OptionType } from '@/db/common/OptionType';
import db from '@/services/db';

import * as EmailValidator from 'email-validator';
import isUrl from 'is-url';

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

const validateOption = (option: ItemOption, value: string) => {
  if (option.minimumValue !== undefined && option.minimumValue !== null) {
    if (option.type === OptionType.STRING && value.length < option.minimumValue) {
      throw new FilledItemUpdateError('FIELD_STRING_TOO_SHORT', {
        friendlyName: option.friendlyName,
        min: option.minimumValue
      });
    }

    if (option.type === OptionType.NUMBER && parseInt(value) < option.minimumValue) {
      throw new FilledItemUpdateError('FIELD_NUMBER_TOO_SMALL', {
        friendlyName: option.friendlyName,
        min: option.minimumValue
      });
    }
  }

  if (option.maximumValue !== undefined && option.maximumValue !== null) {
    if (option.type === OptionType.STRING && value.length > option.maximumValue) {
      throw new FilledItemUpdateError('FIELD_STRING_TOO_LONG', {
        friendlyName: option.friendlyName,
        max: option.maximumValue
      });
    }

    if (option.type === OptionType.NUMBER && parseInt(value) > option.maximumValue) {
      throw new FilledItemUpdateError('FIELD_NUMBER_TOO_LARGE', {
        friendlyName: option.friendlyName,
        max: option.maximumValue
      });
    }
  }

  if (option.type === OptionType.EMAIL) {
    if (!EmailValidator.validate(value)) {
      throw new FilledItemUpdateError('FIELD_INVALID_EMAIL', {
        friendlyName: option.friendlyName
      });
    }
  }

  if (option.type === OptionType.DATE) {
    const date = new Date(value);

    if (!(date instanceof Date) || !isFinite(date.getTime())) {
      throw new FilledItemUpdateError('FIELD_DATE_INVALID', {
        friendlyName: option.friendlyName
      });
    }
  }

  if (option.type === OptionType.URL) {
    if (!isUrl(value)) {
      throw new FilledItemUpdateError('FIELD_URL_INVALID', {
        friendlyName: option.friendlyName
      });
    }
  }
};

export const fillItemOptions = async (userEmail: string, itemId: number, options: FilledOption[]) => {
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
