import db from '@/services/db';

import { User } from '@/db/models/auth/User';
import { FilledItemAttachment } from '@/db/models/items/FilledItemAttachment';

class GetFilledItemAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetFilledItemAttachmentError';
    this.code = code;
  }
}

export interface FilledItemAttachmentResponse {
  user: User;
  attachment: FilledItemAttachment;
}

export const getFilledItemAttachment = async (email: string, attachmentId: number): Promise<FilledItemAttachmentResponse> => {
  await db.prepare();

  const userRepository = db.getRepository(User);
  const attachmentRepository = db.getRepository(FilledItemAttachment);

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new GetFilledItemAttachmentError('USER_NOT_FOUND');
  }

  const attachment = await attachmentRepository.findOne(attachmentId, { relations: [ 'filledItem' ] });

  if (!attachment) {
    throw new GetFilledItemAttachmentError('ATTACHMENT_NOT_FOUND');
  }

  if (!user.isAdmin && user.id !== attachment.filledItem.userId) {
    throw new GetFilledItemAttachmentError('ACCESS_TO_ATTACHMENT_DENIED');
  }

  return { user, attachment };
};
