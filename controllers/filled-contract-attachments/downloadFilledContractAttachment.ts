import { getFilledContractAttachment } from './getFilledContractAttachment';
import mime from 'mime-types';

import path from 'path';

import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

export interface IDownloadAttachmentResponse {
  stream: any;
  filename: string;
  contentType: string;
};

export const downloadContractAttachment = async (filename: string, filledContractId: number): Promise<IDownloadAttachmentResponse> => {
  if (!filename) {
    return null;
  }

  const key = `attachments/contract/${filledContractId}/${filename}`;

  if (!(await storage.exists(key))) {
    return null;
  }

  const contentType = mime.contentType(filename) || 'application/octet-stream';
  const baseName = path.basename(filename);
  const stream = await storage.getStream(key);

  return {
    stream,
    filename: baseName,
    contentType
  };
};

export const downloadFilledContractAttachment = async (email: string, attachmentId: number): Promise<IDownloadAttachmentResponse> => {
  const { attachment } = await getFilledContractAttachment(email, attachmentId);

  return await downloadContractAttachment(attachment.filename, attachment.filledContractId);
};
