import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { FilledContractOption } from '@/db/models/contracts/FilledContractOption';

const withPrefix = (name: string, prefix: string) => `${prefix}_${name}`;

export const fillDefaultOptions = async (
  user: User,
  filledContract: FilledContract,
  isSeller: boolean,
) => {
  const filledContractOptionRepository = db.getRepository(FilledContractOption);
  const prefix = isSeller ? 'seller' : 'buyer';

  const options = filledContract.contract.options;

  for await (const option of options) {
    if (!option.replacementString.startsWith(prefix)) {
      continue;
    }

    const filledOption = filledContractOptionRepository.create();

    filledOption.option = option;
    filledOption.filledContract = filledContract;

    switch (option.replacementString) {
      case withPrefix('name', prefix):
        filledOption.value = user.name;
        break;

      case withPrefix('email', prefix):
        filledOption.value = user.email;
        break;

      case withPrefix('mother_name', prefix):
        filledOption.value = user.motherName || null;
        break;

      case withPrefix('mother_birthdate', prefix):
        filledOption.value = user.motherBirthDate?.toISOString() || null;
        break;

      case withPrefix('nationality', prefix):
        filledOption.value = user.nationality || null;
        break;

      case withPrefix('id_number_type', prefix):
        filledOption.value = user.personalIdentifierType.toString() || null;
        break;

      case withPrefix('id_number', prefix):
        filledOption.value = user.personalIdentifier || null;
        break;

      case withPrefix('phone_number', prefix):
        filledOption.value = user.phoneNumber || null;
        break;

      case withPrefix('birth_date', prefix):
        filledOption.value = user.birthDate?.toUTCString() || null;
        break;

      case withPrefix('birth_place', prefix):
        filledOption.value = user.birthPlace || null;
        break;
    }

    filledContractOptionRepository.insert(filledOption);
  }
};
