import { TFunction } from 'next-i18next';

export const getPersonalIdentifierTypeString = (
  id: number,
  t?: TFunction,
): string => {
  switch (id) {
    case 0:
      return t ? t('dashboard:user-fields.id-card') : 'Személyi igazolvány';
    case 1:
      return t ? t('dashboard:user-fields.passport') : 'Útlevél';
    case 2:
      return t
        ? t('dashboard:user-fields.drivers-license')
        : 'Vezetői engedély';
    default:
      return id.toString();
  }
};
