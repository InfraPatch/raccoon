import sessionConfig from '@/lib/sessionConfig';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';

export const withSession = (callback: NextApiHandler): NextApiHandler => {
  return withIronSessionApiRoute(callback, sessionConfig);
};
