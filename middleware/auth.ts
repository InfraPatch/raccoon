import { getUserFromSession } from '@/controllers/users/getUser';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession } from './session';

export const ensureAuthenticated = (
  callback: NextApiHandler,
): NextApiHandler => {
  const handler = async (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ ok: false, error: 'NOT_AUTHENTICATED' });
    }

    return callback(req, res);
  };

  return withSession(handler);
};

export const ensureAnonymous = (callback: NextApiHandler): NextApiHandler => {
  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.session?.user) {
      return res.status(401).json({ ok: false, error: 'NOT_ANONYMOUS' });
    }

    return callback(req, res);
  };

  return withSession(handler);
};

export const ensureAdministrator = (
  callback: NextApiHandler,
): NextApiHandler => {
  const handler = async (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ ok: false, error: 'NOT_AUTHENTICATED' });
    }

    const user = await getUserFromSession(req.session);

    if (!user.isAdmin) {
      return res.status(401).json({ ok: false, error: 'NO_ADMIN_PRIVILEGES' });
    }

    return callback(req, res);
  };

  return withSession(handler);
};
