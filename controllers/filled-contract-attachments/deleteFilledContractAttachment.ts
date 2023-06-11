import { FilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';
import db from '@/services/db';

import {
  getFilledContractAttachment,
  FilledContractAttachmentResponse,
} from './getFilledContractAttachment';
import { deleteAttachment } from '../attachments/deleteAttachment';

class DeleteFilledContractAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'DeleteFilledContractAttachmentError';
    this.code = code;
  }
}

export const deleteFilledContractAttachment = async (
  email: string,
  attachmentId: number,
): Promise<void> => {
  const { attachment, user }: FilledContractAttachmentResponse =
    await getFilledContractAttachment(email, attachmentId);
  const filledContract = attachment.filledContract;

  if (
    (!user.isAdmin &&
      attachment.isSeller &&
      filledContract.userId !== user.id) ||
    (!attachment.isSeller && filledContract.buyerId !== user.id)
  ) {
    throw new DeleteFilledContractAttachmentError(
      'ACCESS_TO_ATTACHMENT_DENIED',
    );
  }

  if (
    (attachment.isSeller && filledContract.sellerSignedAt) ||
    (!attachment.isSeller && filledContract.buyerSignedAt)
  ) {
    throw new DeleteFilledContractAttachmentError('CONTRACT_ALREADY_SIGNED');
  }

  const attachmentRepository = db.getRepository(FilledContractAttachment);
  await attachmentRepository.delete(attachment.id);

  try {
    await deleteAttachment(
      'contract',
      attachment.filledContractId,
      attachment.filename,
    );
  } catch (err) {
    console.error(err);
    throw new DeleteFilledContractAttachmentError('ATTACHMENT_CLEANUP_FAILED');
  }
};
