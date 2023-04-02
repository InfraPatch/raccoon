import { useState } from 'react';

import toaster from '@/lib/toaster';

import { BookOpen } from 'react-feather';
import { useTranslation } from 'react-i18next';

import Swal from 'sweetalert2';
import { User } from '@/db/models/auth/User';
import { IAttachment } from '@/db/common/Attachment';

export interface AttachmentsProps {
  attachments: IAttachment[],
  onChange: () => Promise<void>;
  deleteAttachment: (IAttachment) => any;
  canDelete: (IAttachment) => boolean;
  translationKey: string;
  user: User;
};

const Attachments = ({ attachments, onChange, deleteAttachment, canDelete, translationKey, user }: AttachmentsProps) => {
  const { t } = useTranslation('dashboard');

  const [ saving, setSaving ] = useState(false);

  attachments.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

  const dataContainerClassNames = 'mb-6 bg-field shadow rounded-md';
  const dataRowClassNames = 'flex items-center gap-2 my-1';
  const dataContainerTitleClassNames = 'text-xl px-4 py-3 bg-accent text-secondary rounded-md rounded-b-none';

  const removeAttachment = async (attachment: IAttachment) => {
    setSaving(true);

    try {
      await deleteAttachment(attachment);
      toaster.success(t(`dashboard:contracts.actions.${translationKey}.delete-success`));
      await onChange();
      setSaving(false);
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, err.response.data.details));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const handleRemoveAttachmentClick = async (attachment: IAttachment) => {
    if (saving) {
      return;
    }

    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.confirm-action'),
      text: t(`dashboard:contracts.actions.${translationKey}.delete-confirmation`),
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.yes'),
      cancelButtonText: t('dashboard:contracts.actions.no')
    });

    if (result.isConfirmed) {
      await removeAttachment(attachment);
    }
  };

  const createAttachments = ((attachments : IAttachment[], title: string) => {
    if (attachments.length === 0) {
      // There are no attachments to display.
      return <></>;
    }

    return (
      <div className={dataContainerClassNames}>
        <h2 className={dataContainerTitleClassNames}>{ t(title) }</h2>

        <div className="px-4 py-3 text-sm">
          {attachments.map((attachment : IAttachment, idx : number) => {
            return (
              <div className={dataRowClassNames} key={idx}>
                <BookOpen />
                <strong><span className="text-info">{ t('dashboard:pages.attachment') }</span></strong>

                {canDelete(attachment) && <strong>
                  <a
                    className="text-danger"
                    href="#"
                    onClick={() => handleRemoveAttachmentClick(attachment)}
                  >({ t('dashboard:contracts.actions.attachments.remove-attachment') })</a>
                </strong>}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <article className="my-4">
      <div className={dataContainerClassNames}>
        { createAttachments(attachments, 'contracts.data.attachments') }
      </div>
    </article>
  );
};

export default Attachments;
