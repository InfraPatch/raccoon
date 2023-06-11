import { getFilledContractAttachment } from './getFilledContractAttachment';
import {
  downloadAttachment,
  IDownloadAttachmentResponse,
} from '../attachments/downloadAttachment';

export const downloadFilledContractAttachment = async (
  email: string,
  attachmentId: number,
): Promise<IDownloadAttachmentResponse> => {
  const { attachment } = await getFilledContractAttachment(email, attachmentId);

  return await downloadAttachment(
    'contract',
    attachment.filename,
    attachment.filledContractId,
  );
};
