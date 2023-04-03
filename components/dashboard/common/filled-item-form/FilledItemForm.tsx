import { FormEvent, useEffect, useState } from 'react';

import Button, { ButtonSize } from '@/components/common/button/Button';
import { OptionType } from '@/db/common/OptionType';

import { transformDate } from '@/lib/transformDate';

import { useTranslation } from 'react-i18next';

import { IItem } from '@/db/models/items/Item';
import { IFilledItem } from '@/db/models/items/FilledItem';

import Box from '@/components/common/box/Box';
import { IItemOption } from '@/db/models/items/ItemOption';

export interface FilledItemField {
  id: number;
  name: string;
  type: OptionType;
  value: string;
  longDescription?: string;
  hint?: string;
};

export interface FilledItemFormFields {
  friendlyName: string;
  itemSlug: string;
  options: FilledItemField[];
};

export interface FilledItemFormProps {
  item: IItem;
  filledItem?: IFilledItem;
  onSubmit(e: FilledItemFormFields): void | Promise<void>;
  submitButtonText: string;
};

const FilledItemForm = ({ item, filledItem, onSubmit, submitButtonText }: FilledItemFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ friendlyName, setFriendlyName ] = useState('');
  const [ fields, setFields ] = useState<FilledItemField[]>([]);
  const [ saving, setSaving ] = useState(false);

  const getValue = (option: IItemOption): string => {
    if (typeof filledItem === 'undefined' || filledItem === null) {
      return '';
    }

    return filledItem.options.find(a => a.option.id === option.id).value;
  };

  useEffect(() => {
    const newFields = item.options
      .sort((a, b) => a.priority - b.priority)
      .map(option => {
        return {
          id: option.id,
          name: option.friendlyName,
          type: option.type,
          value: getValue(option),
          longDescription: option.longDescription,
          hint: option.hint
        };
      });

    setFields(newFields);
  }, []);

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
    await onSubmit({
      friendlyName,
      itemSlug: item.slug,
      options: fields
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleFormSubmit} className="my-0">
      <Box title={t('dashboard:new-item.overview')}>
        <div className="form-field">
          <label htmlFor="friendlyName">{t('dashboard:new-item.fields.friendlyName')}:</label>
          <input
            id="friendlyName"
            name="friendlyName"
            defaultValue={filledItem ? filledItem.friendlyName : ''}
            onChange={e => setFriendlyName(e.currentTarget.value)}
          />
        </div>
      </Box>

      {fields && fields.length > 0 && (
        <Box>
          {fields.map(field => (
            <div className="form-field mb-5" key={field.id}>
              <label htmlFor={`field_${field.id}`}>{field.name}</label>

              {field.longDescription && <p>{field.longDescription}</p>}

              {![
                OptionType.NUMBER,
                OptionType.PERSONAL_IDENTIFIER,
                OptionType.EMAIL,
                OptionType.URL,
                OptionType.DATE
              ].includes(field.type) && (
                <input
                  id={`field_${field.id}`}
                  onChange={e => updateFields(field.id, e.currentTarget.value)}
                  defaultValue={field.value}
                  placeholder={field.hint}
                />
              )}

              {field.type === OptionType.EMAIL && (
                <input
                  type="email"
                  id={`field_${field.id}`}
                  onChange={e => updateFields(field.id, e.currentTarget.value)}
                  defaultValue={field.value}
                  placeholder={field.hint}
                />
              )}

              {field.type === OptionType.URL && (
                <input
                  type="url"
                  id={`field_${field.id}`}
                  onChange={e => updateFields(field.id, e.currentTarget.value)}
                  defaultValue={field.value}
                  placeholder={field.hint}
                />
              )}

              {field.type === OptionType.DATE && (
                <input
                  type="date"
                  id={`field_${field.id}`}
                  onChange={e => updateFields(field.id, e.currentTarget.value)}
                  defaultValue={transformDate(field.value)}
                />
              )}

              {field.type === OptionType.NUMBER && (
                <input
                  type="number"
                  id={`field_${field.id}`}
                  onChange={e => updateFields(field.id, e.currentTarget.value)}
                  defaultValue={field.value}
                />
              )}

              {field.type === OptionType.PERSONAL_IDENTIFIER && (
                <select id={`field_${field.id}`} onChange={e => updateFields(field.id, e.currentTarget.value)} defaultValue={field.value}>
                  <option value="0">{t('dashboard:user-fields.id-card')}</option>
                  <option value="1">{t('dashboard:user-fields.passport')}</option>
                  <option value="2">{t('dashboard:user-fields.drivers-license')}</option>
                </select>
              )}
            </div>
          ))}
        </Box>
      )}

      <Box>
        <div className="form-field">
          <Button
            size={ButtonSize.MEDIUM}
            type="submit"
            disabled={saving}
          >{submitButtonText}</Button>
        </div>
      </Box>
    </form>
  );
};

export default FilledItemForm;
