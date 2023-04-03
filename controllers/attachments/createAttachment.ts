import { File } from 'formidable';
import sanitize from 'sanitize-filename';

import * as fs from 'fs';

import { maximumAttachmentSize } from './attachmentConstants';

const storage = getStorageStrategy();
import { getStorageStrategy } from '@/lib/storageStrategies';

class CreateAttachmentError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'CreateAttachmentError';
    this.code = code;
  }
}

export const verifyAttachment = (friendlyName: string, file: File) : void => {
  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new CreateAttachmentError('NAME_TOO_SHORT');
  }

  if (!file || file.name.startsWith('avdh-')) {
    throw new CreateAttachmentError('INVALID_ATTACHMENT');
  }

  if (file.size > maximumAttachmentSize) {
    throw new CreateAttachmentError('ATTACHMENT_TOO_LARGE');
  }
};

export const uploadAttachment = async (attachmentType: string, parentId: number, file: File) => {
  const buffer = fs.readFileSync(file.path);
  const filename = sanitize(file.name);

  if (filename?.length === 0) {
    throw new CreateAttachmentError('INVALID_ATTACHMENT');
  }

  const dot = filename.indexOf('.');
  const basename = filename.substring(0, dot);
  const extension = filename.substring(dot);
  let index = 1;

  let key: string = `${basename}${extension}`;

  while (await storage.exists(`attachments/${attachmentType}/${parentId}/${key}`)) {
    key = `${basename}_${index++}${extension}`;
  }

  await storage.create({ key: `attachments/${attachmentType}/${parentId}/${key}`, contents: buffer });

  return key;
};
