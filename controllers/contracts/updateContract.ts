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
}

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

export const updateContract = async ({
  id,
  friendlyName,
  description,
  file,
}: ContractUpdaterFields): Promise<Contract> => {
  await db.prepare();
  const contractRepository = db.getRepository(Contract);

  if (!friendlyName || friendlyName.trim().length < 2) {
    throw new ContractUpdateError('NAME_TOO_SHORT');
  }

  friendlyName = friendlyName.trim();

  if (!description || description.trim().length < 2) {
    throw new ContractUpdateError('DESCRIPTION_TOO_SHORT');
  }

  let driveId: string | null = null;

  if (file) {
    const allowedMimetypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimetypes.includes(file.mimetype)) {
      throw new ContractUpdateError('INVALID_MIMETYPE');
    }

    try {
      driveId = await uploadFile(file, friendlyName);
    } catch (err) {
      throw new ContractUpdateError('FILE_UPLOAD_FAILED');
    }
  }

  const updateDict: ContractUpdateFields = {
    ...(friendlyName && { friendlyName }),
    ...(description && { description }),
    ...(driveId && { driveId }),
  };

  const updateResult: UpdateResult = await contractRepository.update(
    { id },
    updateDict,
  );

  if (updateResult.raw.affectedRows <= 0) {
    throw new ContractUpdateError('CONTRACT_NOT_FOUND');
  }

  const contract: Contract = await contractRepository.findOne({ id });

  if (!contract) {
    throw new ContractUpdateError('CONTRACT_NOT_FOUND');
  }

  return contract;
};
