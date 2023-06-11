import { redirectIfAuthenticated } from '@/lib/redirects';
import { redirectIfAnonymous } from '@/lib/redirects';
import { redirectIfNotAdmin } from '@/lib/redirects';

import { NextRequest } from 'next/server';

const AUTHENTICATED_PATH_NAMES = ['/dashboard'];

const ANONYMOUS_PATH_NAMES = ['/register', '/login'];

const ADMIN_ONLY_PATH_NAMES = ['/dashboard/admin', '/docs/admin'];

const startsWithAny = (pathNames: string[], pathname: string) => {
  return pathNames.some((pathName) => pathname.startsWith(pathName));
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (startsWithAny(AUTHENTICATED_PATH_NAMES, pathname)) {
    return redirectIfAnonymous(req);
  }

  if (startsWithAny(ANONYMOUS_PATH_NAMES, pathname)) {
    return redirectIfAuthenticated(req);
  }

  if (startsWithAny(ADMIN_ONLY_PATH_NAMES, pathname)) {
    return redirectIfNotAdmin(req);
  }
}
