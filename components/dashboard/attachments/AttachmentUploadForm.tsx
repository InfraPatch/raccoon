import { useState } from 'react';

import toaster from '@/lib/toaster';

import { useTranslation } from 'react-i18next';

import { IAttachment } from '@/db/common/Attachment';
import { maximumAttachmentCount, maximumAttachmentSize } from '@/controllers/attachments/attachmentConstants';

import styles from '@/styles/components/Attachments.module.scss';
import Loading from '@/components/common/Loading';

import Swal from 'sweetalert2';

export interface AttachmentUploadFormProps {
  attachments: IAttachment[];
  onChange: () => Promise<void>;
  uploadAttachment: (File, string) => any;
  canUpload: () => boolean;
  translationKey: string;
};

const AttachmentUploadForm = ({ attachments, onChange, uploadAttachment, canUpload, translationKey }: AttachmentUploadFormProps) => {
  if (attachments?.length >= maximumAttachmentCount || !canUpload()) {
    // We can't upload any more attachments, so no point in showing this interface.
    return <></>;
  }

  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ saving, setSaving ] = useState<boolean>(false);
  const [ dragging, setDragging ] = useState<boolean>(false);
  const [ draggable, setDraggable ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ file, setFile ] = useState<File | null>(null);

  const uploadFile = async (file: File, friendlyName: string) => {
    setSaving(true);

    try {
      await uploadAttachment(file, friendlyName);
      toaster.success(t(`dashboard:contracts.actions.${translationKey}.create-success`));
      await onChange();
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, err.response.data.details));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSaving(false);
      setDraggable(true);
      setFile(null);
    }
  };

  const chooseFile = async (file: File) => {
    setDragging(false);

    if (!file) {
      setError(null);
      return;
    }

    if (file.size > maximumAttachmentSize) {
      setError(t('errors:contracts.ATTACHMENT_TOO_LARGE'));
      return;
    }

    setError(null);
    setDraggable(false);

    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.attachments.upload-attachment-title'),
      text: t('dashboard:contracts.actions.attachments.upload-attachment-confirmation'),
      input: 'text',
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.attachments.upload-button'),
      cancelButtonText: t('dashboard:contracts.actions.cancel'),
      inputPlaceholder: t('dashboard:contracts.actions.attachments.attachment-friendly-name')
    });
    const friendlyName = result.value?.trim();

    if (!friendlyName) {
      setDraggable(true);
      return;
    }

    setFile(file);
    await uploadFile(file, friendlyName);
  };

  const restartUpload = (e) => {
    setDragging(false);
    setError(null);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggable) {
      setDragging(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggable) {
      setDragging(true);
    }
  };

  const handleDrop = async (e) => {
    if (saving || !draggable) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    await chooseFile(e.dataTransfer?.files[0]);
  };

  const handleFileChange = async (e) => {
    if (saving || !draggable) {
      return;
    }

    await chooseFile(e.currentTarget?.files[0]);
  };

  let attachmentBoxClasses = [ styles.box ];

  if (dragging) {
    attachmentBoxClasses.push(styles.dragging);
  }

  return (
    <div
      className={attachmentBoxClasses.join(' ')}
      onDrop={handleDrop}
      onDragOver={handleDragEnter}
      onDragEnter={handleDragEnter}
      onDragStart={handleDragStart}
      onDragLeave={handleDragOver}
      onDragEnd={handleDragOver}
    >
      { error ? (
        <div className={styles.text}>
          <span>{error} </span>
          <a href="#" className={styles.restart} onClick={restartUpload} role="button">{ t('dashboard:contracts.actions.attachments.try-again') }</a>
        </div>
      ) : (file ? (
        <div className={styles.text}>
          <Loading />
          <span>{ t('dashboard:contracts.actions.attachments.uploading-label') }</span>
        </div>
      ) : (<>
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
        <input type="file" name="file" id="file" className={styles.file} onChange={handleFileChange} />
        <label htmlFor="file">
          <strong>{ t('dashboard:contracts.actions.attachments.choose-file') }</strong>
          <span className={styles.drag_and_drop}> { t('dashboard:contracts.actions.attachments.drag-here') }.</span>
        </label>
      </>)) }
    </div>
  );
};

export default AttachmentUploadForm;
