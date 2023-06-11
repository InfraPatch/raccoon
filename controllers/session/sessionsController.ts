import { NextApiHandler } from 'next';

import { User } from '@/db/models/auth/User';
import db from '@/services/db';

import bcrypt from 'bcryptjs';

export const create: NextApiHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing email or password' });
  }

  await db.prepare();

  const userRepository = db.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ ok: false, error: 'INVALID_CREDENTIALS' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ ok: false, error: 'INVALID_CREDENTIALS' });
  }

  delete (user as any).password;

  req.session.user = user;
  await req.session.save();

  return res.status(200).json({
    ok: true,
    user,
  });
};

export const destroy: NextApiHandler = async (req, res) => {
  req.session.destroy();
  return res.status(200).json({ ok: true });
};
