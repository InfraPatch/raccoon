import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PersonalIdentifierType {
  IDENTITY_CARD,
  PASSPORT,
  DRIVERS_LICENSE,
}

export interface IUserIdentificationDetails {
  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;
  birthPlace?: string;
}

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

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'datetime', nullable: true })
  emailVerified?: Date;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isAdmin?: boolean;

  @Column({ type: 'boolean', default: false })
  isLawyer?: boolean;

  @Column({ nullable: true })
  motherName?: string;

  @Column({ nullable: true })
  motherBirthDate?: Date;

  @Column({ nullable: true })
  nationality?: string;

  @Column({
    type: 'enum',
    enum: PersonalIdentifierType,
    default: PersonalIdentifierType.IDENTITY_CARD,
  })
  personalIdentifierType?: PersonalIdentifierType;

  @Column({ nullable: true })
  personalIdentifier?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'datetime', nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  birthPlace?: string;

  constructor(
    name?: string,
    email?: string,
    image?: string,
    isEmailVerified?: boolean,
    password?: string,
    isAdmin?: boolean,
    isLawyer?: boolean,
    identificationDetails?: IUserIdentificationDetails,
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
      const {
        motherName,
        motherBirthDate,
        nationality,
        personalIdentifierType,
        personalIdentifier,
        phoneNumber,
        birthDate,
        birthPlace,
      } = identificationDetails;

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
      motherBirthDate: this.motherBirthDate
        ? this.motherBirthDate.toUTCString()
        : null,
      nationality: this.nationality,
      personalIdentifierType: this.personalIdentifierType,
      personalIdentifier: this.personalIdentifier,
      phoneNumber: this.phoneNumber,
      birthDate: this.birthDate,
      birthPlace: this.birthPlace,
      isAdmin: this.isAdmin,
      isLawyer: this.isLawyer,
    };
  }
}
