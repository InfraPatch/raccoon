import { FormEvent, useState } from 'react';

import Button, { ButtonSize } from '@/components/common/button/Button';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { ContractOptionType } from '@/db/models/contracts/ContractOption';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { transformDate } from '@/lib/transformDate';

import { useTranslation } from 'react-i18next';

export interface FilledContractFieldsFormProps {
  filledContract: IFilledContract;
  onChange: () => Promise<void>;
  isBuyer?: boolean;
};

const FilledContractFieldsForm = ({ filledContract, onChange, isBuyer }: FilledContractFieldsFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ fields, setFields ] = useState(
    filledContract.contract.options
      .filter(option => option.isSeller === !isBuyer)
      .sort((a, b) => a.priority - b.priority)
      .map(option => {
        return {
          id: option.id,
          name: option.friendlyName,
          type: option.type,
          value: filledContract.options.find(a => a.option.id === option.id)?.value || '',
          longDescription: option.longDescription,
          hint: option.hint
        };
      })
  );

  const [ saving, setSaving ] = useState(false);

  const updateFields = (id: number, value: string) => {
    setFields(current => {
      const newFields = current.slice(0);

      newFields.forEach(field => {
        if (field.id === id) {
          field.value = value;
        }
      });

      return newFields;
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await apiService.filledContracts.fillFilledContract(filledContract.id, { options: fields });
      toaster.success(t('dashboard:contracts.data.fill-success'));
      await onChange();
    } catch (err) {
      if (err.response?.data?.error) {
        toaster.danger(t(`errors:contracts.${err.response.data.error}`, err.response.data.details));
        return;
      }

      console.error(err);
      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {fields.map(field => (
        <div className="form-field mb-5" key={field.id}>
          <label htmlFor={`field_${field.id}`}>{field.name}</label>

          {field.longDescription && <p>{field.longDescription}</p>}

          {field.type === ContractOptionType.STRING && (
            <input
              id={`field_${field.id}`}
              onChange={e => updateFields(field.id, e.currentTarget.value)}
              defaultValue={field.value}
              placeholder={field.hint}
            />
          )}

          {field.type === ContractOptionType.EMAIL && (
            <input
              type="email"
              id={`field_${field.id}`}
              onChange={e => updateFields(field.id, e.currentTarget.value)}
              defaultValue={field.value}
              placeholder={field.hint}
            />
          )}

          {field.type === ContractOptionType.URL && (
            <input
              type="url"
              id={`field_${field.id}`}
              onChange={e => updateFields(field.id, e.currentTarget.value)}
              defaultValue={field.value}
              placeholder={field.hint}
            />
          )}

          {field.type === ContractOptionType.DATE && (
            <input
              type="date"
              id={`field_${field.id}`}
              onChange={e => updateFields(field.id, e.currentTarget.value)}
              defaultValue={transformDate(field.value)}
            />
          )}

          {field.type === ContractOptionType.PERSONAL_IDENTIFIER && (
            <select id={`field_${field.id}`} onChange={e => updateFields(field.id, e.currentTarget.value)} defaultValue={field.value}>
              <option value="0">{ t('dashboard:user-fields.id-card') }</option>
              <option value="1">{ t('dashboard:user-fields.passport') }</option>
              <option value="2">{ t('dashboard:user-fields.drivers-license') }</option>
            </select>
          )}
        </div>
      ))}

      <div className="form-field">
        <Button
          size={ButtonSize.MEDIUM}
          type="submit"
          disabled={saving}
        >{ t('dashboard:contracts.data.fill-submit') }</Button>
      </div>
    </form>
  );
};

export default FilledContractFieldsForm;
