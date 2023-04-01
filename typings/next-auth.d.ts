import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: number;
      isAdmin: boolean;
      isLawyer: boolean;
    };
  }
}
