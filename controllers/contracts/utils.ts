import db from '@/services/db';

import { Contract } from '@/db/models/contracts/Contract';
import { ContractOption, ContractOptionType, IContractOption } from '@/db/models/contracts/ContractOption';

const withPrefix = (name: string, prefix: string) => `${prefix.toLowerCase()}_${name}`;

export const createDefaultOptions = async (contract: Contract) => {
  const contractOptionRepository = db.getRepository(ContractOption);

  for (const prefix of [ 'Eladó', 'Vevő' ]) {
    let idx = 0;

    const option = (type: ContractOptionType, friendlyName: string, replacementString: string, min?: number, max?: number): IContractOption => {
      return {
        contract,
        type,
        friendlyName,
        priority: idx++,
        replacementString: withPrefix(replacementString, prefix === 'Eladó' ? 'seller' : 'buyer'),
        minimumValue: min,
        maximumValue: max,
        isSeller: prefix === 'Eladó'
      };
    };

    await contractOptionRepository.insert([
      option(ContractOptionType.STRING, `${prefix} teljes neve`, 'name', 2),
      option(ContractOptionType.EMAIL, `${prefix} e-mail címe`, 'email'),
      option(ContractOptionType.STRING, `${prefix} édesanyjának neve`, 'mother_name', 2),
      option(ContractOptionType.DATE, `${prefix} édesanyjának születési dátuma`, 'mother_birthdate'),
      option(ContractOptionType.STRING, `${prefix} nemzetisége`, 'nationality', 2),
      option(ContractOptionType.PERSONAL_IDENTIFIER, `${prefix} személyazonossági okiratának típusa`, 'id_number_type'),
      option(ContractOptionType.STRING, `${prefix} személyazonossági okiratának száma`, 'id_number'),
      option(ContractOptionType.STRING, `${prefix} telefonszáma`, 'phone_number', 10),
      option(ContractOptionType.DATE, `${prefix} születési dátuma`, 'birth_date'),
      option(ContractOptionType.STRING, `${prefix} születési helye`, 'birth_place')
    ]);
  }
};
