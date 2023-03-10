import Adapters, { TypeORMUserModel } from 'next-auth/adapters';

export class User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
  password?: string;

  constructor(name?: string, email?: string, image?: string, isEmailVerified?: boolean, password?: string) {
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

    if (password) {
      this.password = password;
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt?.toUTCString(),
      updatedAt: this.updatedAt?.toUTCString(),
      name: this.name,
      email: this.email,
      image: this.image
    };
  }
}

export const UserSchema = {
  ...Adapters.TypeORM.Models.User.schema,
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    password: {
      type: 'varchar'
    }
  }
};
