import { User } from '@/db/models/auth/User';
import { ContractOption, ContractOptionType } from '@/db/models/contracts/ContractOption';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { FilledContractOption } from '@/db/models/contracts/FilledContractOption';
import { FilledOption } from '@/services/apis/contracts/FilledContractAPIService';
import db from '@/services/db';

import * as EmailValidator from 'email-validator';
import isUrl from 'is-url';
import * as utils from './utils';

class FilledContractUpdateError extends Error {
  code: string;
  details: any;

  constructor(code: string, details?: any) {
    super();
    this.name = 'FilledContractUpdateError';
    this.code = code;

    if (details) {
      this.details = details;
    }
  }
}

const validateOption = (option: ContractOption, value: string) => {
  if (option.minimumValue !== undefined && option.minimumValue !== null) {
    if (option.type === ContractOptionType.STRING && value.length < option.minimumValue) {
      throw new FilledContractUpdateError('FIELD_STRING_TOO_SHORT', {
        friendlyName: option.friendlyName,
        min: option.minimumValue
      });
    }

    if (option.type === ContractOptionType.NUMBER && parseInt(value) < option.minimumValue) {
      throw new FilledContractUpdateError('FIELD_NUMBER_TOO_SMALL', {
        friendlyName: option.friendlyName,
        min: option.minimumValue
      });
    }
  }

  if (option.maximumValue !== undefined && option.maximumValue !== null) {
    if (option.type === ContractOptionType.STRING && value.length > option.maximumValue) {
      throw new FilledContractUpdateError('FIELD_STRING_TOO_LONG', {
        friendlyName: option.friendlyName,
        max: option.maximumValue
      });
    }

    if (option.type === ContractOptionType.NUMBER && parseInt(value) > option.maximumValue) {
      throw new FilledContractUpdateError('FIELD_NUMBER_TOO_LARGE', {
        friendlyName: option.friendlyName,
        max: option.maximumValue
      });
    }
  }

  if (option.type === ContractOptionType.EMAIL) {
    if (!EmailValidator.validate(value)) {
      throw new FilledContractUpdateError('FIELD_INVALID_EMAIL', {
        friendlyName: option.friendlyName
      });
    }
  }

  if (option.type === ContractOptionType.DATE) {
    const date = new Date(value);

    if (!(date instanceof Date) || !isFinite(date.getTime())) {
      throw new FilledContractUpdateError('FIELD_DATE_INVALID', {
        friendlyName: option.friendlyName
      });
    }
  }

  if (option.type === ContractOptionType.URL) {
    if (!isUrl(value)) {
      throw new FilledContractUpdateError('FIELD_URL_INVALID', {
        friendlyName: option.friendlyName
      });
    }
  }
};

export const acceptOrDeclineFilledContract = async (userEmail: string, contractId: number, action: 'accept' | 'decline'): Promise<void> => {
  await db.prepare();
  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new FilledContractUpdateError('USER_NOT_FOUND');
  }

  const contract = await filledContractRepository.findOne(contractId, { relations: [ 'contract', 'options', 'contract.options' ] });
  if (!contract || contract?.buyerId !== user.id) {
    throw new FilledContractUpdateError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (contract.accepted) {
    throw new FilledContractUpdateError('FILLED_CONTRACT_ALREADY_ACCEPTED');
  }

  if (action === 'decline') {
    await filledContractRepository.delete(contract.id);
    return;
  }

  contract.accepted = true;
  (contract as any).buyer = user;
  await filledContractRepository.save(contract);
  await utils.fillDefaultOptions(user, contract, false);
};

export const fillContractOptions = async (userEmail: string, contractId: number, options: FilledOption[]) => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const filledContractRepository = db.getRepository(FilledContract);
  const filledContractOptionsRepository = db.getRepository(FilledContractOption);

  const user = await userRepository.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new FilledContractUpdateError('USER_NOT_FOUND');
  }

  const filledContract = await filledContractRepository.findOne(contractId, { relations: [ 'contract', 'options', 'contract.options', 'options.option' ] });
  if (!filledContract || (filledContract.userId !== user.id && filledContract.buyerId !== user.id)) {
    throw new FilledContractUpdateError('FILLED_CONTRACT_NOT_FOUND');
  }

  if (filledContract.buyerSignedAt && filledContract.sellerSignedAt) {
    throw new FilledContractUpdateError('CONTRACT_ALREADY_SIGNED');
  }

  const isSeller = filledContract.userId === user.id;

  const contractOptions: { [id: number]: ContractOption } = {};
  filledContract.contract.options.forEach(option => contractOptions[option.id] = option);

  const currentFilledOptions: { [id: number]: FilledContractOption } = {};
  filledContract.options.forEach(option => currentFilledOptions[option.option.id] = option);

  for await (const option of options) {
    const contractOption = contractOptions[option.id];
    const filledContractOption = currentFilledOptions[option.id];

    if (typeof contractOption === 'undefined') {
      continue;
    }

    if (contractOption.isSeller !== isSeller) {
      continue;
    }

    validateOption(contractOption, option.value);

    if (typeof filledContractOption !== 'undefined') {
      await filledContractOptionsRepository.update(filledContractOption.id, {
        value: option.value
      });
    } else {
      const newFilledContractOption = filledContractOptionsRepository.create();
      newFilledContractOption.filledContract = filledContract;
      newFilledContractOption.option = contractOption;
      newFilledContractOption.value = option.value;

      await filledContractOptionsRepository.insert(newFilledContractOption);
    }
  }
};
