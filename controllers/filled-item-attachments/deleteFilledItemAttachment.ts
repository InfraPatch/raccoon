import { FilledItemAttachment } from '@/db/models/items/FilledItemAttachment';
import db from '@/services/db';

import { getFilledItemAttachment, FilledItemAttachmentResponse } from './getFilledItemAttachment';
import { deleteAttachment } from '../attachments/deleteAttachment';

class DeleteFilledItemAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteFilledItemAttachmentError';
    this.code = code;
  }
}

export const deleteFilledItemAttachment = async (email: string, attachmentId: number): Promise<void> => {
  const { attachment, user } : FilledItemAttachmentResponse = await getFilledItemAttachment(email, attachmentId);

  if (!user.isAdmin && user.id !== attachment.filledItem.userId) {
    throw new DeleteFilledItemAttachmentError('ACCESS_TO_ATTACHMENT_DENIED');
  }

  const attachmentRepository = db.getRepository(FilledItemAttachment);
  await attachmentRepository.delete(attachment.id);

  try {
    await deleteAttachment('item', attachment.filledItemId, attachment.filename);
  } catch (err) {
    console.error(err);
    throw new DeleteFilledItemAttachmentError('ATTACHMENT_CLEANUP_FAILED');
  }
};
