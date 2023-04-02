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

export const downloadContractAttachment = async (filename: string): Promise<IDownloadAttachmentResponse> => {
  if (!filename) {
    return null;
  }

  if (!(await storage.exists(filename))) {
    return null;
  }

  const contentType = mime.contentType(filename) || 'application/octet-stream';
  const baseName = path.basename(filename);
  const stream = await storage.getStream(filename);

  return {
    stream,
    filename: baseName,
    contentType
  };
};

export const downloadFilledContractAttachment = async (email: string, attachmentId: number): Promise<IDownloadAttachmentResponse> => {
  const { attachment } = await getFilledContractAttachment(email, attachmentId);

  return await downloadContractAttachment(attachment.filename);
};
