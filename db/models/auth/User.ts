import Adapters, { TypeORMUserModel } from 'next-auth/adapters';

export class User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;

  constructor(name?: string, email?: string, image?: string, isEmailVerified?: boolean) {
    if (name) {
      this.name = name;
    }

    if (email) {
      this.email = email;
    }

    if (image) {
      this.image = image;
    }

    if (isEmailVerified) {
      this.emailVerified = new Date();
    }
  }
}

export const UserSchema = {
  ...Adapters.TypeORM.Models.User.schema,
  target: User
};
