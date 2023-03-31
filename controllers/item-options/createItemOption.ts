import db from '@/services/db';
import { ItemOption } from '@/db/models/items/ItemOption';
import { OptionType } from '@/db/common/OptionType';
import { Item } from '@/db/models/items/Item';

export interface ItemOptionCreatorFields {
  itemId?: number;
  type?: OptionType;
  priority?: number;
  friendlyName?: string;
  longDescription?: string;
  hint?: string;
  replacementString?: string;
  minimumValue?: number;
  maximumValue?: number;
};

export class ItemOptionCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ItemOptionCreationError';
    this.code = code;
  }
}

export const createItemOption = async (payload: ItemOptionCreatorFields): Promise<ItemOption> => {
  await db.prepare();

  if (isNaN(payload.itemId)) {
    throw new ItemOptionCreationError('ITEM_NOT_PROVIDED');
  }

  if (isNaN(payload.type)) {
    throw new ItemOptionCreationError('ITEM_OPTION_TYPE_NOT_PROVIDED');
  }

  if (!Object.values(OptionType).includes(payload.type)) {
    throw new ItemOptionCreationError('INVALID_ITEM_OPTION_TYPE');
  }

  if (!payload.friendlyName || payload.friendlyName.trim().length < 2) {
    throw new ItemOptionCreationError('NAME_TOO_SHORT');
  }

  if (!payload.replacementString || payload.replacementString.trim().length < 2) {
    throw new ItemOptionCreationError('REPLACEMENT_STRING_TOO_SHORT');
  }

  payload.friendlyName = payload.friendlyName.trim();
  payload.replacementString = payload.replacementString.trim();
  payload.hint = payload.hint ? payload.hint.trim() : '';
  payload.longDescription = payload.longDescription ? payload.longDescription.trim() : '';
  payload.minimumValue = (isNaN(payload.minimumValue) || payload.minimumValue === -1) ? null : payload.minimumValue;
  payload.maximumValue = (isNaN(payload.maximumValue) || payload.maximumValue === -1) ? null : payload.maximumValue;

  if (payload.minimumValue !== null && payload.maximumValue !== null && payload.minimumValue > payload.maximumValue) {
    throw new ItemOptionCreationError('CONSTRAINTS_INVALID');
  }

  const optionsRepository = db.getRepository(ItemOption);
  const optionCount = await optionsRepository.count({ where: { replacementString: payload.replacementString } });

  if (optionCount !== 0) {
    throw new ItemOptionCreationError('ITEM_OPTION_ALREADY_EXISTS');
  }

  const itemRepository = db.getRepository(Item);
  const item = await itemRepository.findOne({ where: { id: payload.itemId } });

  if (!item) {
    throw new ItemOptionCreationError('ITEM_DOES_NOT_EXIST');
  }

  const itemOption = optionsRepository.create({
    item,
    type: payload.type,
    priority: payload.priority || 0,
    friendlyName: payload.friendlyName,
    longDescription: payload.longDescription,
    hint: payload.hint,
    replacementString: payload.replacementString,
    minimumValue: payload.minimumValue,
    maximumValue: payload.maximumValue
  });
  await optionsRepository.insert(itemOption);
  return itemOption;
};
