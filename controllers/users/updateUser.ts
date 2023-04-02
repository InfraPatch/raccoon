import db from '@/services/db';
import { PersonalIdentifierType, User } from '@/db/models/auth/User';
import { UpdateUserAPIRequest } from '@/services/apis/users/UserAPIService';

import { v4 as uuid } from 'uuid';

import * as fs from 'fs';
import { File } from 'formidable';

import * as passwords from '@/lib/passwords';

import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

class UserUpdateError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'UserUpdateError';
    this.code = code;
  }
}

const uploadImage = async (image: File): Promise<string> => {
  const buffer = fs.readFileSync(image.path);
  const extension = image.name.substring(image.name.indexOf('.'));

  let key: string | null = null;

  do {
    key = `${uuid()}${extension}`;
  } while (await storage.exists(`avatars/${key}`));

  await storage.create({ key: `avatars/${key}`, contents: buffer });

  return `/avatars/${key}`;
};

export const updateUser = async (email: string, payload: Omit<UpdateUserAPIRequest, 'image'> & { image?: File }): Promise<User | null> => {
  await db.prepare();
  const userRepository = db.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  if (payload.name) {
    if (payload.name.trim().length < 2) {
      throw new UserUpdateError('NAME_TOO_SHORT');
    }

    user.name = payload.name.trim();
  }

  if (payload.password) {
    if (payload.password.trim().length < 8) {
      throw new UserUpdateError('PASSWORD_TOO_WEAK');
    }

    if (payload.password !== payload.password2) {
      throw new UserUpdateError('PASSWORDS_DONT_MATCH');
    }

    if (!payload.oldPassword || !(await passwords.verify(payload.oldPassword, user.password))) {
      throw new UserUpdateError('INVALID_CREDENTIALS');
    }

    user.password = await passwords.hash(payload.password);
  }

  if (payload.image) {
    const allowedMimetypes = [
      'image/png',
      'image/jpeg',
      'image/gif'
    ];

    if (!allowedMimetypes.includes(payload.image.type)) {
      throw new UserUpdateError('INVALID_MIMETYPE');
    }

    try {
      user.image = await uploadImage(payload.image);
    } catch (err) {
      console.error(err);
      throw new UserUpdateError('IMAGE_UPLOAD_FAILED');
    }
  }

  if (payload.motherName) {
    user.motherName = payload.motherName;
  }

  if (payload.motherBirthDate) {
    user.motherBirthDate = payload.motherBirthDate;
  }

  if (payload.nationality) {
    user.nationality = payload.nationality;
  }

  if (typeof payload.personalIdentifierType !== 'undefined') {
    if (!Object.values(PersonalIdentifierType).includes(payload.personalIdentifierType)) {
      throw new UserUpdateError('INVALID_PERSONAL_IDENTIFIER_TYPE');
    }

    if (!payload.personalIdentifier || payload.personalIdentifier.trim().length === 0) {
      throw new UserUpdateError('PERSONAL_IDENTIFIER_NOT_PROVIDED');
    }

    user.personalIdentifierType = payload.personalIdentifierType;
    user.personalIdentifier = payload.personalIdentifier;
  }

  if (payload.phoneNumber) {
    user.phoneNumber = payload.phoneNumber;
  }

  if (payload.birthDate) {
    user.birthDate = payload.birthDate;
  }

  if (payload.birthPlace) {
    user.birthPlace = payload.birthPlace;
  }

  return userRepository.save(user);
};
