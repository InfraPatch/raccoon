import { NextApiRequest, NextApiResponse } from 'next';

import { createUser } from '@/controllers/users/createUser';
import { getSession } from 'next-auth/client';
import { getUser } from './getUser';
import { makeAdmin as _makeAdmin } from './makeAdmin';

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, password2 } = req.body;

  try {
    const user = await createUser({ name, email, password, password2 });
    return res.json({
      ok: true,
      user: user.toJSON()
    });
  } catch (err) {
    if (err.name === 'UserCreationError') {
      return res.status(400).json({
        ok: false,
        error: err.code
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const user = await getUser(session.user.email);
  return res.json({
    ok: true,
    user: user.toJSON()
  });
};

export const makeAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  const success = await _makeAdmin(email);
  if (!success) {
    return res.status(404).json({
      ok: false,
      error: 'USER_NOT_FOUND'
    });
  }

  return res.json({
    ok: true
  });
};
