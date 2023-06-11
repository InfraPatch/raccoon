import { OptionType } from '@/db/common/OptionType';
import { ItemOption } from '@/db/models/items/ItemOption';
import { ContractOption } from '@/db/models/contracts/ContractOption';

import * as EmailValidator from 'email-validator';
import isUrl from 'is-url';

class OptionValidationError extends Error {
  code: string;
  details: any;

  constructor(code: string, details?: any) {
    super();
    this.name = 'OptionValidationError';
    this.code = code;

    if (details) {
      this.details = details;
    }
  }
}

export const validateOption = <T extends ItemOption | ContractOption>(
  option: T,
  value: string,
): OptionValidationError | null => {
  if (option.minimumValue !== undefined && option.minimumValue !== null) {
    if (
      option.type === OptionType.STRING &&
      value.length < option.minimumValue
    ) {
      return new OptionValidationError('FIELD_STRING_TOO_SHORT', {
        friendlyName: option.friendlyName,
        min: option.minimumValue,
      });
    }

    if (
      option.type === OptionType.NUMBER &&
      parseInt(value) < option.minimumValue
    ) {
      return new OptionValidationError('FIELD_NUMBER_TOO_SMALL', {
        friendlyName: option.friendlyName,
        min: option.minimumValue,
      });
    }
  }

  if (option.maximumValue !== undefined && option.maximumValue !== null) {
    if (
      option.type === OptionType.STRING &&
      value.length > option.maximumValue
    ) {
      return new OptionValidationError('FIELD_STRING_TOO_LONG', {
        friendlyName: option.friendlyName,
        max: option.maximumValue,
      });
    }

    if (
      option.type === OptionType.NUMBER &&
      parseInt(value) > option.maximumValue
    ) {
      return new OptionValidationError('FIELD_NUMBER_TOO_LARGE', {
        friendlyName: option.friendlyName,
        max: option.maximumValue,
      });
    }
  }

  if (option.type === OptionType.EMAIL) {
    if (!EmailValidator.validate(value)) {
      return new OptionValidationError('FIELD_INVALID_EMAIL', {
        friendlyName: option.friendlyName,
      });
    }
  }

  if (option.type === OptionType.DATE) {
    const date = new Date(value);

    if (!(date instanceof Date) || !isFinite(date.getTime())) {
      return new OptionValidationError('FIELD_DATE_INVALID', {
        friendlyName: option.friendlyName,
      });
    }
  }

  if (option.type === OptionType.URL) {
    if (!isUrl(value)) {
      return new OptionValidationError('FIELD_URL_INVALID', {
        friendlyName: option.friendlyName,
      });
    }
  }
};
