import db from '@/services/db';
import { Contract } from '@/db/models/contracts/Contract';

import { v4 as uuid } from 'uuid';

import * as fs from 'fs';
import { File } from 'formidable';

import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

export interface ContractCreatorFields {
  friendlyName?: string;
  description?: string;
  file?: File;
};

export class ContractCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'ContractCreationError';
    this.code = code;
  }
}

const uploadFile = async (file: File): Promise<string> => {
  console.log("file path is " + file.path);
  const buffer = fs.readFileSync(file.path);
  const extension = file.name.split('.').pop();

  let key: string | null = null;

  do {
    key = `${uuid()}.${extension}`;
  } while (await storage.exists(`templates/${key}`));

  await storage.create({ key: `templates/${key}`, contents: buffer });

  return `/templates/${key}`;
};

export const createContract = async ({ friendlyName, description, file }: ContractCreatorFields): Promise<Contract> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ContractCreationError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ContractCreationError('DESCRIPTION_TOO_SHORT');
  }

  const contractCount = await contractRepository.count({ where: { friendlyName } });

  if (contractCount !== 0) {
    throw new ContractCreationError('CONTRACT_ALREADY_EXISTS');
  }

  let filename;

  if (!file) {
    throw new ContractCreationError('FILE_MISSING');
  }

  try {
    filename = await uploadFile(file);
  } catch (err) {
    throw new ContractCreationError('FILE_UPLOAD_FAILED');
  }

  console.log("filename is " + filename);
  const contract = contractRepository.create({ friendlyName, description, filename });
  await contractRepository.insert(contract);
  return contract;
};
