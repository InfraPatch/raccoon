import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

import { createUser } from '@/controllers/users/createUser';
import { getUserFromSession } from './getUser';
import { makeAdmin as _makeAdmin } from './makeAdmin';
import { makeLawyer as _makeLawyer } from './makeLawyer';
import { updateUser } from './updateUser';

export const firstOf = <T>(field: T | T[] | undefined): T | undefined => {
  if (typeof field === 'undefined') {
    return undefined;
  }

  if (Array.isArray(field)) {
    return field[0];
  }

  return field;
};

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, password2 } = req.body;

  try {
    const user = await createUser({ name, email, password, password2 });
    return res.json({
      ok: true,
      user: user.toJSON(),
    });
  } catch (err) {
    if (err.name === 'UserCreationError') {
      return res.status(400).json({
        ok: false,
        error: err.code,
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUserFromSession(req.session);
  return res.json({
    ok: true,
    user: user.toJSON(),
  });
};

export const makeAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  const success = await _makeAdmin(email);
  if (!success) {
    return res.status(404).json({
      ok: false,
      error: 'USER_NOT_FOUND',
    });
  }

  return res.json({
    ok: true,
  });
};

export const makeLawyer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  const success = await _makeLawyer(email);
  if (!success) {
    return res.status(404).json({
      ok: false,
      error: 'USER_NOT_FOUND',
    });
  }

  return res.json({
    ok: true,
  });
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable();

  return new Promise<void>((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR',
        });

        return resolve();
      }

      try {
        const user = await updateUser(req.session.user.email, {
          name: firstOf(fields.name),
          image: firstOf(files.image),
          password: firstOf(fields.password),
          password2: firstOf(fields.password2),
          oldPassword: firstOf(fields.oldPassword),
          motherName: firstOf(fields.motherName),
          motherBirthDate:
            fields.motherBirthDate && new Date(firstOf(fields.motherBirthDate)),
          nationality: firstOf(fields.nationality),
          personalIdentifierType:
            fields.personalIdentifierType &&
            parseInt(firstOf(fields.personalIdentifierType)),
          personalIdentifier: firstOf(fields.personalIdentifier),
          phoneNumber: firstOf(fields.phoneNumber),
          birthDate: fields.birthDate && new Date(firstOf(fields.birthDate)),
          birthPlace: firstOf(fields.birthPlace),
        });

        res.json({
          ok: true,
          user,
        });

        return resolve();
      } catch (err) {
        if (err.name === 'UserUpdateError') {
          res.status(400).json({
            ok: false,
            error: err.code,
            message: err.extraMessage,
          });
          return resolve();
        }

        console.error(err);

        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR',
        });

        return resolve();
      }
    });
  });
};
