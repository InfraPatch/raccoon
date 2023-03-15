import db from '@/services/db';

import { Contract } from '@/db/models/contracts/Contract';
import { ContractOption, ContractOptionType, IContractOption } from '@/db/models/contracts/ContractOption';

const withPrefix = (name: string, prefix: string) => `${prefix.toLowerCase()}_${name}`;

export const createDefaultOptions = async (contract: Contract) => {
  const contractOptionRepository = db.getRepository(ContractOption);

  for (const prefix of [ 'Seller', 'Buyer' ]) {
    let idx = 0;

    const option = (type: ContractOptionType, friendlyName: string, replacementString: string, min?: number, max?: number): IContractOption => {
      return {
        contract,
        type,
        friendlyName,
        priority: idx++,
        replacementString: withPrefix(replacementString, prefix),
        minimumValue: min,
        maximumValue: max,
        isSeller: prefix === 'Seller'
      };
    };

    await contractOptionRepository.insert([
      option(ContractOptionType.STRING, `${prefix} full name`, 'name', 2),
      option(ContractOptionType.EMAIL, `${prefix} email`, 'email'),
      option(ContractOptionType.STRING, `${prefix} mother's name`, 'mother_name', 2),
      option(ContractOptionType.DATE, `${prefix} mother's birth date`, 'mother_birthdate'),
      option(ContractOptionType.STRING, `${prefix} nationality`, 'nationality', 2),
      option(ContractOptionType.PERSONAL_IDENTIFIER, `${prefix} personal identifier type`, 'id_number_type'),
      option(ContractOptionType.STRING, `${prefix} personal identifier number`, 'id_number'),
      option(ContractOptionType.STRING, `${prefix} phone number`, 'phone_number', 10),
      option(ContractOptionType.DATE, `${prefix} birth date`, 'birth_date'),
      option(ContractOptionType.STRING, `${prefix} birth place`, 'birth_place')
    ]);
  }
};
