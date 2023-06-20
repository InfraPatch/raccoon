import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

import * as fs from 'fs';
import { File } from 'formidable';

import * as utils from './utils';

import { Item } from '@/db/models/items/Item';
import { driveFolder, driveService } from '@/services/google';

export interface ContractCreatorFields {
  friendlyName?: string;
  description?: string;
  itemSlug?: string;
  file?: File;
}

export class ContractCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractCreationError';
    this.code = code;
  }
}

export const uploadFile = async (
  file: File | null,
  name: string,
): Promise<string> => {
  const stream = file && fs.createReadStream(file.filepath);
  const extension = file
    ? file.originalFilename.substring(file.originalFilename.indexOf('.'))
    : '.docx';
  const key = `${name}${extension}`;

  const driveFileUpload = await driveService.files.create({
    requestBody: {
      name: key,
      parents: [driveFolder],
      mimeType: 'application/vnd.google-apps.document',
    },
    media: {
      body: stream,
    },
  });
  const fileId = driveFileUpload.data.id;

  await driveService.permissions.create({
    requestBody: {
      type: 'anyone',
      role: 'writer',
    },
    fileId,
  });

  return fileId;
};

export const createContract = async ({
  friendlyName,
  description,
  itemSlug,
  file,
}: ContractCreatorFields): Promise<Contract> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);
  const itemRepository = db.getRepository(Item);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ContractCreationError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ContractCreationError('DESCRIPTION_TOO_SHORT');
  }

  const contractCount = await contractRepository.count({
    where: { friendlyName },
  });

  if (contractCount !== 0) {
    throw new ContractCreationError('CONTRACT_ALREADY_EXISTS');
  }

  let item: Item | null = null;

  if (itemSlug && itemSlug.length > 0) {
    const targetItem = await itemRepository.findOne({
      where: { slug: itemSlug },
    });
    if (!targetItem) {
      throw new ContractCreationError('ITEM_NOT_FOUND');
    }

    item = targetItem;
  }

  let driveId: string | null = null;

  const allowedMimetypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file && !allowedMimetypes.includes(file.mimetype)) {
    throw new ContractCreationError('INVALID_MIMETYPE');
  }

  try {
    driveId = await uploadFile(file, friendlyName);
  } catch (err) {
    console.log(err);
    throw new ContractCreationError('FILE_UPLOAD_FAILED');
  }

  const contract = contractRepository.create({
    friendlyName,
    description,
    item,
    driveId,
  });
  await contractRepository.insert(contract);

  await utils.createDefaultOptions(contract);

  return contract;
};
