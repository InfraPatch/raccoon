import { Session } from 'next-auth';

export const redirectIfAuthenticated = async (res, session: Session): Promise<boolean> => {
  if (session) {
    res.writeHead(301, {
      location: '/dashboard'
    });
    res.end();

    return true;
  }

  return false;
};

export const redirectIfAnonymous = async (res, session: Session): Promise<boolean> => {
  if (!session || !session.user) {
    res.writeHead(301, {
      location: '/login'
    });
    res.end();

    return true;
  }

  return false;
};

export const redirectIfNotAdmin = async (res, session: Session): Promise<boolean> => {
  if (!session || !session.user) {
    res.writeHead(301, {
      location: '/login'
    });
    res.end();

    return true;
  }

  if (!session.user.isAdmin) {
    res.writeHead(301, {
      location: '/dashboard'
    });
    res.end();

    return true;
  }

  return false;
};
