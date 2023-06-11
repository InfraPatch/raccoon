import db from '@/services/db';

import { File } from 'formidable';

import { User } from '@/db/models/auth/User';
import { FilledItem } from '@/db/models/items/FilledItem';
import { FilledItemAttachment } from '@/db/models/items/FilledItemAttachment';

import { NewFilledItemAttachmentAPIParams } from '@/services/apis/items/FilledItemAttachmentAPIService';

import { maximumAttachmentCount } from '../attachments/attachmentConstants';
import {
  uploadAttachment,
  verifyAttachment,
} from '../attachments/createAttachment';

class CreateFilledItemAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateFilledItemAttachmentError';
    this.code = code;
  }
}

export const createFilledItemAttachment = async (
  email: string,
  payload: Omit<NewFilledItemAttachmentAPIParams, 'file'> & { file?: File },
): Promise<FilledItemAttachment> => {
  verifyAttachment(payload.friendlyName, payload.file);

  await db.prepare();

  const userRepository = db.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new CreateFilledItemAttachmentError('USER_NOT_FOUND');
  }

  const filledItemRepository = db.getRepository(FilledItem);
  const filledItem = await filledItemRepository.findOne(payload.filledItemId, {
    relations: ['attachments'],
  });

  if (!user.isAdmin && user.id !== filledItem.userId) {
    throw new CreateFilledItemAttachmentError('ACCESS_TO_ITEM_DENIED');
  }

  if (filledItem.attachments.length >= maximumAttachmentCount) {
    throw new CreateFilledItemAttachmentError('MAX_ATTACHMENTS_REACHED');
  }

  const attachmentRepository = db.getRepository(FilledItemAttachment);
  const attachment = attachmentRepository.create();

  try {
    attachment.filename = await uploadAttachment(
      'item',
      filledItem.id,
      payload.file,
    );
  } catch (err) {
    console.error(err);
    throw new CreateFilledItemAttachmentError('ATTACHMENT_UPLOAD_FAILED');
  }

  attachment.filledItem = filledItem;
  attachment.friendlyName = payload.friendlyName;

  await attachmentRepository.insert(attachment);
  return attachment;
};
