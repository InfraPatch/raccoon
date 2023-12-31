import db from '@/services/db';
import { ContractOption } from '@/db/models/contracts/ContractOption';
import { OptionType } from '@/db/common/OptionType';
import { Contract } from '@/db/models/contracts/Contract';

export interface ContractOptionCreatorFields {
  contractId?: number;
  type?: OptionType;
  priority?: number;
  friendlyName?: string;
  longDescription?: string;
  hint?: string;
  replacementString?: string;
  minimumValue?: number;
  maximumValue?: number;
  isSeller?: boolean;
}

export class ContractOptionCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractOptionCreationError';
    this.code = code;
  }
}

export const createContractOption = async (
  payload: ContractOptionCreatorFields,
): Promise<ContractOption> => {
  await db.prepare();

  if (isNaN(payload.contractId)) {
    throw new ContractOptionCreationError('CONTRACT_NOT_PROVIDED');
  }

  if (isNaN(payload.type)) {
    throw new ContractOptionCreationError('CONTRACT_OPTION_TYPE_NOT_PROVIDED');
  }

  if (!Object.values(OptionType).includes(payload.type)) {
    throw new ContractOptionCreationError('INVALID_CONTRACT_OPTION_TYPE');
  }

  if (!payload.friendlyName || payload.friendlyName.trim().length < 2) {
    throw new ContractOptionCreationError('NAME_TOO_SHORT');
  }

  if (
    !payload.replacementString ||
    payload.replacementString.trim().length < 2
  ) {
    throw new ContractOptionCreationError('REPLACEMENT_STRING_TOO_SHORT');
  }

  payload.friendlyName = payload.friendlyName.trim();
  payload.replacementString = payload.replacementString.trim();
  payload.hint = payload.hint ? payload.hint.trim() : '';
  payload.longDescription = payload.longDescription
    ? payload.longDescription.trim()
    : '';
  payload.minimumValue =
    isNaN(payload.minimumValue) || payload.minimumValue === -1
      ? null
      : payload.minimumValue;
  payload.maximumValue =
    isNaN(payload.maximumValue) || payload.maximumValue === -1
      ? null
      : payload.maximumValue;

  if (
    payload.minimumValue !== null &&
    payload.maximumValue !== null &&
    payload.minimumValue > payload.maximumValue
  ) {
    throw new ContractOptionCreationError('CONSTRAINTS_INVALID');
  }

  const contractRepository = db.getRepository(Contract);
  const contract = await contractRepository.findOne({
    where: { id: payload.contractId },
  });

  if (!contract) {
    throw new ContractOptionCreationError('CONTRACT_DOES_NOT_EXIST');
  }

  const optionsRepository = db.getRepository(ContractOption);
  const optionCount = await optionsRepository
    .createQueryBuilder('contractOption')
    .where('contractOption.replacementString = :replacementString', {
      replacementString: payload.replacementString,
    })
    .andWhere('contractOption.contractId = :contractId', {
      contractId: contract.id,
    })
    .getCount();

  if (optionCount !== 0) {
    throw new ContractOptionCreationError('CONTRACT_OPTION_ALREADY_EXISTS');
  }

  const contractOption = optionsRepository.create({
    contract,
    type: payload.type,
    priority: payload.priority || 0,
    friendlyName: payload.friendlyName,
    longDescription: payload.longDescription,
    hint: payload.hint,
    replacementString: payload.replacementString,
    minimumValue: payload.minimumValue,
    maximumValue: payload.maximumValue,
    isSeller: payload.isSeller,
  });
  await optionsRepository.insert(contractOption);
  return contractOption;
};
