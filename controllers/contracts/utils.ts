import db from '@/services/db';

import { Contract } from '@/db/models/contracts/Contract';
import { ContractOption, IContractOption } from '@/db/models/contracts/ContractOption';
import { OptionType } from '@/db/common/OptionType';

const withPrefix = (name: string, prefix: string) => `${prefix.toLowerCase()}_${name}`;

export const createDefaultOptions = async (contract: Contract) => {
  const contractOptionRepository = db.getRepository(ContractOption);

  for (const prefix of [ 'Eladó', 'Vevő' ]) {
    let idx = 0;

    const option = (type: OptionType, friendlyName: string, replacementString: string, min?: number, max?: number): IContractOption => {
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
      option(OptionType.STRING, `${prefix} teljes neve`, 'name', 2),
      option(OptionType.EMAIL, `${prefix} e-mail címe`, 'email'),
      option(OptionType.STRING, `${prefix} édesanyjának neve`, 'mother_name', 2),
      option(OptionType.DATE, `${prefix} édesanyjának születési dátuma`, 'mother_birthdate'),
      option(OptionType.STRING, `${prefix} nemzetisége`, 'nationality', 2),
      option(OptionType.PERSONAL_IDENTIFIER, `${prefix} személyazonossági okiratának típusa`, 'id_number_type'),
      option(OptionType.STRING, `${prefix} személyazonossági okiratának száma`, 'id_number'),
      option(OptionType.STRING, `${prefix} telefonszáma`, 'phone_number', 10),
      option(OptionType.DATE, `${prefix} születési dátuma`, 'birth_date'),
      option(OptionType.STRING, `${prefix} születési helye`, 'birth_place')
    ]);
  }
};
