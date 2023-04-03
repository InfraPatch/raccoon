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
  birthPlace?: string;
};

export interface IUser extends IUserIdentificationDetails {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  isAdmin?: boolean;
  isLawyer?: boolean;
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
  isLawyer?: boolean;

  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;
  birthPlace?: string;

  constructor(
    name?: string,
    email?: string,
    image?: string,
    isEmailVerified?: boolean,
    password?: string,
    isAdmin?: boolean,
    isLawyer?: boolean,
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

    if (isLawyer) {
      this.isLawyer = isLawyer;
    }

    if (identificationDetails) {
      const { motherName, motherBirthDate, nationality, personalIdentifierType, personalIdentifier, phoneNumber, birthDate, birthPlace } = identificationDetails;

      this.motherName = motherName;
      this.motherBirthDate = motherBirthDate;
      this.nationality = nationality;
      this.personalIdentifierType = personalIdentifierType;
      this.personalIdentifier = personalIdentifier;
      this.phoneNumber = phoneNumber;
      this.birthDate = birthDate;
      this.birthPlace = birthPlace;
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
      motherBirthDate: this.motherBirthDate ? this.motherBirthDate.toUTCString() : null,
      nationality: this.nationality,
      personalIdentifierType: this.personalIdentifierType,
      personalIdentifier: this.personalIdentifier,
      phoneNumber: this.phoneNumber,
      birthDate: this.birthDate,
      birthPlace: this.birthPlace,
      isAdmin: this.isAdmin,
      isLawyer: this.isLawyer
    };
  }
}

export const UserSchema = {
  ...Adapters.TypeORM.Models.User.schema,
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,

    password: {
      type: 'varchar',
      nullable: true
    },

    isAdmin: {
      type: 'boolean',
      default: false
    },

    isLawyer: {
      type: 'boolean',
      default: false
    },

    motherName: {
      type: 'varchar',
      nullable: true
    },

    motherBirthDate: {
      type: 'datetime',
      nullable: true
    },

    nationality: {
      type: 'varchar',
      nullable: true
    },

    personalIdentifierType: {
      type: 'enum',
      enum: PersonalIdentifierType,
      default: PersonalIdentifierType.IDENTITY_CARD
    },

    personalIdentifier: {
      type: 'varchar',
      nullable: true
    },

    phoneNumber: {
      type: 'varchar',
      nullable: true
    },

    birthDate: {
      type: 'datetime',
      nullable: true
    },

    birthPlace: {
      type: 'varchar',
      nullable: true
    }
  }
};
