import db from '@/services/db';
import { User } from '@/db/models/auth/User';

export const makeAdmin = async (email: string): Promise<boolean | null> => {
  await db.prepare();
  const userRepository = db.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return false;
  }

  user.isAdmin = true;
  await userRepository.save(user);

  return true;
};
