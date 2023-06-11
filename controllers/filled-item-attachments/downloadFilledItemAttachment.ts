import { getFilledItemAttachment } from './getFilledItemAttachment';
import {
  downloadAttachment,
  IDownloadAttachmentResponse,
} from '../attachments/downloadAttachment';

export const downloadFilledItemAttachment = async (
  email: string,
  attachmentId: number,
): Promise<IDownloadAttachmentResponse> => {
  const { attachment } = await getFilledItemAttachment(email, attachmentId);

  return await downloadAttachment(
    'item',
    attachment.filename,
    attachment.filledItemId,
  );
};
