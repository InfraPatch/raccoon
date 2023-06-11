import db from '@/services/db';
import { User } from '@/db/models/auth/User';
import { IronSession } from 'iron-session';

export const getUser = async (email: string): Promise<User | null> => {
  await db.prepare();
  const userRepository = db.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  return user;
};

export const getUserFromSession = async (
  session: IronSession,
): Promise<User | null> => {
  if (!session.user?.email) {
    return null;
  }

  return getUser(session.user.email);
};
