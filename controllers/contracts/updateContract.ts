import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

import { File } from 'formidable';
import { UpdateResult } from 'typeorm';

import { uploadFile } from './createContract';

export interface ContractUpdaterFields {
  id: number;
  friendlyName?: string;
  description?: string;
  file?: File;
};

export interface ContractUpdateFields {
  friendlyName?: string;
  description?: string;
  filename?: string;
}

export class ContractUpdateError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractUpdateError';
    this.code = code;
  }
}

export const updateContract = async ({ id, friendlyName, description, file }: ContractUpdaterFields) => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ContractUpdateError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ContractUpdateError('DESCRIPTION_TOO_SHORT');
  }

  let filename: string | null = null;

  if (file) {
    try {
      filename = await uploadFile(file);
    } catch (err) {
      throw new ContractUpdateError('FILE_UPLOAD_FAILED');
    }
  }

  let updateDict : ContractUpdateFields = {};

  if (friendlyName) {
    updateDict.friendlyName = friendlyName;
  }

  if (description) {
    updateDict.description = description;
  }

  if (filename) {
    updateDict.filename = filename;
  }

  const updateResult: UpdateResult = await contractRepository.update({ id }, updateDict);

  if (updateResult.raw.affectedRows <= 0) {
    throw new ContractUpdateError('CONTRACT_NOT_FOUND');
  }
};
