import { useState } from 'react';

import toaster from '@/lib/toaster';

import { BookOpen } from 'react-feather';
import { useTranslation } from 'next-i18next';

import { IAttachment } from '@/db/common/Attachment';

import AttachmentUploadForm from './AttachmentUploadForm';

import Swal from 'sweetalert2';

export interface AttachmentsProps {
  attachments: IAttachment[];
  onChange: () => Promise<void>;
  deleteAttachment: (IAttachment) => any;
  uploadAttachment: (File, string) => any;
  canUpload: () => boolean;
  canDelete: (IAttachment) => boolean;
  modelName: string;
  translationKey: string;
}

const Attachments = ({
  attachments,
  onChange,
  deleteAttachment,
  uploadAttachment,
  canUpload,
  canDelete,
  modelName,
  translationKey,
}: AttachmentsProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const [saving, setSaving] = useState<boolean>(false);

  attachments.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

  const dataContainerClassNames = 'mb-6 bg-field shadow rounded-md';
  const dataRowClassNames = 'flex items-center gap-2 my-1';
  const dataContainerTitleClassNames =
    'text-xl px-4 py-3 bg-accent text-secondary rounded-md rounded-b-none';

  const removeAttachment = async (attachment: IAttachment) => {
    setSaving(true);

    try {
      await deleteAttachment(attachment);
      toaster.success(
        t(`dashboard:attachments.actions.${translationKey}.delete-success`),
      );
      await onChange();
      setSaving(false);
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(
            t(`errors:${modelName}.${message}`, err.response.data.details),
          );
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
      title: t('dashboard:attachments.actions.confirm-action'),
      text: t(
        `dashboard:attachments.actions.${translationKey}.delete-confirmation`,
      ),
      showCancelButton: true,
      confirmButtonText: t('dashboard:attachments.actions.yes'),
      cancelButtonText: t('dashboard:attachments.actions.no'),
    });

    if (result.isConfirmed) {
      await removeAttachment(attachment);
    }
  };

  const createAttachments = (attachments: IAttachment[], title: string) => {
    if (attachments.length === 0) {
      // There are no attachments to display.
      return <></>;
    }

    return (
      <div className={dataContainerClassNames}>
        <h2 className={dataContainerTitleClassNames}>{t(title)}</h2>

        <div className="px-4 py-3 text-sm">
          {attachments.map((attachment: IAttachment, idx: number) => {
            return (
              <div className={dataRowClassNames} key={idx}>
                <BookOpen />
                <strong>
                  <a
                    className="text-info"
                    target="_blank"
                    title={attachment.filename}
                    href={`/${translationKey}/${attachment.id}`}
                  >
                    {attachment.friendlyName}
                  </a>
                </strong>

                {canDelete(attachment) && (
                  <strong>
                    <a
                      className="text-danger"
                      href="#"
                      onClick={() => handleRemoveAttachmentClick(attachment)}
                    >
                      ({t('dashboard:attachments.actions.remove-attachment')})
                    </a>
                  </strong>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <article className="my-4">
      <div className={dataContainerClassNames}>
        {createAttachments(
          attachments,
          `dashboard:attachments.actions.${translationKey}.attachment-title`,
        )}

        <AttachmentUploadForm
          attachments={attachments}
          onChange={onChange}
          uploadAttachment={uploadAttachment}
          canUpload={canUpload}
          modelName={modelName}
          translationKey={translationKey}
        />
      </div>
    </article>
  );
};

export default Attachments;
