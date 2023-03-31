import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      isAdmin: boolean;
      isLawyer: boolean;
    };
  }
}
