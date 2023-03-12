import Adapters from 'next-auth/adapters';

export enum PersonalIdentifierType {
  IDENTITY_CARD,
  PASSPORT,
  DRIVERS_LICENSE
};

export interface IUserIdentificationDetails {
  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;
};

export interface IUser extends IUserIdentificationDetails {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  isAdmin?: boolean;
}

export class User implements IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  isAdmin?: boolean;

  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;

  constructor(
    name?: string,
    email?: string,
    image?: string,
    isEmailVerified?: boolean,
    password?: string,
    isAdmin?: boolean,
    identificationDetails?: IUserIdentificationDetails
  ) {
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

    if (isAdmin) {
      this.isAdmin = isAdmin;
    }

    if (identificationDetails) {
      const { motherName, motherBirthDate, nationality, personalIdentifierType, personalIdentifier, phoneNumber, birthDate } = identificationDetails;

      this.motherName = motherName;
      this.motherBirthDate = motherBirthDate;
      this.nationality = nationality;
      this.personalIdentifierType = personalIdentifierType;
      this.personalIdentifier = personalIdentifier;
      this.phoneNumber = phoneNumber;
      this.birthDate = birthDate;
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt?.toUTCString(),
      updatedAt: this.updatedAt?.toUTCString(),
      name: this.name,
      email: this.email,
      image: this.image,
      motherName: this.motherName,
      motherBirthDate: this.motherBirthDate ? this.motherBirthDate.toUTCString : null,
      nationality: this.nationality,
      personalIdentifierType: this.personalIdentifierType,
      personalIdentifier: this.personalIdentifier,
      phoneNumber: this.phoneNumber,
      birthDate: this.birthDate
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
    },

    isAdmin: {
      type: 'boolean',
      default: false
    },

    motherName: {
      type: 'varchar'
    },

    motherBirthDate: {
      type: 'timestamp'
    },

    nationality: {
      type: 'varchar'
    },

    personalIdentifierType: {
      type: 'enum',
      enum: PersonalIdentifierType,
      default: PersonalIdentifierType.IDENTITY_CARD
    },

    personalIdentifier: {
      type: 'varchar'
    },

    phoneNumber: {
      type: 'varchar'
    },

    birthDate: {
      type: 'timestamp'
    }
  }
};
