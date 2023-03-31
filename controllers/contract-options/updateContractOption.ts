import db from '@/services/db';
import { UpdateResult } from 'typeorm';
import { ContractOption } from '@/db/models/contracts/ContractOption';
import { OptionType } from '@/db/common/OptionType';

export interface ContractOptionUpdateFields {
  id?: number;
  type?: OptionType;
  priority?: number;
  friendlyName?: string;
  longDescription?: string;
  hint?: string;
  replacementString?: string;
  minimumValue?: number;
  maximumValue?: number;
  isSeller?: boolean;
};

export class ContractOptionUpdateError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractOptionUpdateError';
    this.code = code;
  }
}

export const updateContractOption = async (payload: ContractOptionUpdateFields) => {
  await db.prepare();

  if (isNaN(payload.id)) {
    throw new ContractOptionUpdateError('CONTRACT_NOT_PROVIDED');
  }

  let updateDict : ContractOptionUpdateFields = {};

  if (!isNaN(payload.type)) {
    if (!Object.values(OptionType).includes(payload.type)) {
      throw new ContractOptionUpdateError('INVALID_CONTRACT_OPTION_TYPE');
    }

    updateDict.type = payload.type;
  }

  if (!isNaN(payload.priority)) {
    updateDict.priority = payload.priority;
  }

  if (payload.friendlyName !== undefined) {
    if (!payload.friendlyName || payload.friendlyName.trim().length < 2) {
      throw new ContractOptionUpdateError('NAME_TOO_SHORT');
    }

    updateDict.friendlyName = payload.friendlyName.trim();
  }

  if (payload.replacementString !== undefined) {
    if (!payload.replacementString || payload.replacementString.trim().length < 2) {
      throw new ContractOptionUpdateError('REPLACEMENT_STRING_TOO_SHORT');
    }

    updateDict.replacementString = payload.replacementString.trim();
  }

  if (payload.hint !== undefined) {
    updateDict.hint = payload.hint.trim();
  }

  if (payload.longDescription !== undefined) {
    updateDict.longDescription = payload.longDescription ? payload.longDescription.trim() : '';
  }

  if (!isNaN(payload.minimumValue)) {
    updateDict.minimumValue = (isNaN(payload.minimumValue) || payload.minimumValue === -1) ? null : payload.minimumValue;
  }

  if (!isNaN(payload.maximumValue)) {
    updateDict.maximumValue = (isNaN(payload.maximumValue) || payload.maximumValue === -1) ? null : payload.maximumValue;
  }

  if (!isNaN(payload.minimumValue) || !isNaN(payload.maximumValue)) {
    if (updateDict.minimumValue !== null && updateDict.maximumValue !== null && updateDict.minimumValue > updateDict.maximumValue) {
      throw new ContractOptionUpdateError('CONSTRAINTS_INVALID');
    }
  }

  updateDict.isSeller = payload.isSeller;
  const optionsRepository = db.getRepository(ContractOption);

  if (updateDict.replacementString && updateDict.replacementString !== payload.replacementString) {
    const optionCount = await optionsRepository.count({ where: { replacementString: updateDict.replacementString } });

    if (optionCount !== 0) {
      throw new ContractOptionUpdateError('CONTRACT_OPTION_ALREADY_EXISTS');
    }
  }

  const updateResult : UpdateResult = await optionsRepository.update({ id: payload.id }, updateDict);

  if (updateResult.raw.affectedRows <= 0) {
    throw new ContractOptionUpdateError('CONTRACT_NOT_FOUND');
  }
};
