import { NextRequest, NextResponse } from 'next/server';

import { getIronSession } from 'iron-session/edge';
import sessionConfig from './sessionConfig';

export const redirectIfAnonymous = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  const res = NextResponse.next();

  const session = await getIronSession(req, res, sessionConfig);

  if (!session.user) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url, 302);
  }

  return res;
};

export const redirectIfAuthenticated = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  const res = NextResponse.next();

  const session = await getIronSession(req, res, sessionConfig);

  if (session.user) {
    const url = new URL('/dashboard', req.url);
    return NextResponse.redirect(url, 302);
  }

  return res;
};

export const redirectIfNotAdmin = async (
  req: NextRequest,
): Promise<Response | undefined> => {
  const res = NextResponse.next();

  const session = await getIronSession(req, res, sessionConfig);

  if (!session.user || !session.user.isAdmin) {
    const url = new URL('/dashboard', req.url);
    return NextResponse.redirect(url, 302);
  }

  return res;
};
