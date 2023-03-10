import { NextApiRequest, NextApiResponse } from 'next';

import { createUser } from '@/controllers/users/createUser';

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
