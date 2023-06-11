import { User } from '@/db/models/auth/User';

declare module 'iron-session' {
  interface IronSessionData {
    user?: Omit<User, 'password'>;
  }
}
