import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export const ensureAuthenticated = (callback: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({
        ok: false,
        error: 'NOT_AUTHENTICATED'
      });
    }

    return callback(req, res);
  };
};

export const ensureAnonymous = (callback: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (session) {
      return res.status(400).json({
        ok: false,
        error: 'NOT_ANONYMOUS'
      });
    }

    return callback(req, res);
  };
};

export const ensureAdministrator = (callback: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(400).json({
        ok: false,
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!session.user.isAdmin) {
      return res.status(400).json({
        ok: false,
        error: 'NO_ADMIN_PRIVILEGES'
      });
    }

    return callback(req, res);
  };
};
