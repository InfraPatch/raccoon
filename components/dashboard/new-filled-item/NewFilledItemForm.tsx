import { FormEvent, useEffect, useState } from 'react';

import Button, { ButtonSize } from '@/components/common/button/Button';
import { OptionType } from '@/db/common/OptionType';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { transformDate } from '@/lib/transformDate';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { IItem } from '@/db/models/items/Item';
import Box from '@/components/common/box/Box';

export interface NewFilledItemFormProps {
  item: IItem;
};

export interface FilledItemField {
  id: number;
  name: string;
  type: OptionType;
  value: string;
  longDescription?: string;
  hint?: string;
};

const NewFilledItemForm = ({ item }: NewFilledItemFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const [ friendlyName, setFriendlyName ] = useState('');
  const [ fields, setFields ] = useState<FilledItemField[]>([]);
  const [ saving, setSaving ] = useState(false);

  useEffect(() => {
    const newFields = item.options
      .sort((a, b) => a.priority - b.priority)
      .map(option => {
        return {
          id: option.id,
          name: option.friendlyName,
          type: option.type,
          value: '',
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

    try {
      const res = await apiService.filledItems.createFilledItem({
        friendlyName,
        itemSlug: item.slug,
        options: fields
      });

      toaster.success(t('dashboard:new-item.success'));
      router.push(`/dashboard/inventory/${item.slug}/${res.filledItem.id}`);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:items.${message}`, { min: 2 }));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box title={t('dashboard:new-item.overview')}>
        <div className="form-field">
          <label htmlFor="friendlyName">{t('dashboard:new-item.fields.friendlyName')}:</label>
          <input
            id="friendlyName"
            name="friendlyName"
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
          >{t('dashboard:new-item.submit')}</Button>
        </div>
      </Box>
    </form>
  );
};

export default NewFilledItemForm;
