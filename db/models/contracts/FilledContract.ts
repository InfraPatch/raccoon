import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, IUser } from '../auth/User';
import { Contract, IContract } from './Contract';
import {
  FilledContractOption,
  IFilledContractOption,
} from './FilledContractOption';
import { IWitnessSignature, WitnessSignature } from './WitnessSignature';
import {
  FilledContractAttachment,
  IFilledContractAttachment,
} from './FilledContractAttachment';
import { FilledItem, IFilledItem } from '../items/FilledItem';

import db from '../../../services/db';

import omit from 'lodash.omit';

export interface IFilledContract {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  friendlyName?: string;
  filename?: string;
  userId?: number;
  user?: IUser;
  buyerId?: number;
  buyer?: IUser;
  accepted?: boolean;
  contract?: IContract;
  filledItem?: IFilledItem;
  options?: IFilledContractOption[];
  witnessSignatures?: IWitnessSignature[];
  attachments?: IFilledContractAttachment[];
  sellerSignedAt?: Date | string;
  buyerSignedAt?: Date | string;
}

@Entity()
export class FilledContract implements IFilledContract {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column()
  friendlyName: string;

  @Column({ nullable: true })
  filename?: string;

  @ManyToOne(() => Contract, { createForeignKeyConstraints: false })
  contract: Partial<Contract>;

  @ManyToOne(() => FilledItem, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  filledItem: Partial<FilledItem>;

  @OneToMany(
    () => FilledContractOption,
    (filledContractOption) => filledContractOption.filledContract,
    { createForeignKeyConstraints: false },
  )
  options: Partial<FilledContractOption[]>;

  @OneToMany(
    () => WitnessSignature,
    (witnessSignature) => witnessSignature.filledContract,
    { createForeignKeyConstraints: false },
  )
  witnessSignatures: Partial<WitnessSignature[]>;

  @OneToMany(
    () => FilledContractAttachment,
    (attachment) => attachment.filledContract,
    { createForeignKeyConstraints: false },
  )
  attachments: Partial<FilledContractAttachment[]>;

  // thanks to next-auth's incompatibility with typeorm entities, I cannot
  // establish a many-to-one relationship here, so it's just the user ID.
  // please guys can you do anything right.
  @Column('integer')
  userId: number;

  @Column('integer')
  buyerId: number;

  @Column('boolean', { default: false })
  accepted: boolean;

  @Column('timestamp', { nullable: true })
  sellerSignedAt?: Date;

  @Column('timestamp', { nullable: true })
  buyerSignedAt?: Date;

  async getUser(id: number): Promise<IUser | null> {
    await db.prepare();
    const userRepository = db.getRepository(User);

    const user = await userRepository.findOne(id);
    if (!user) {
      return null;
    }

    return user;
  }

  toJSON(): IFilledContract {
    return {
      id: this.id,
      createdAt: this.createdAt && this.createdAt.toJSON(),
      updatedAt: this.updatedAt && this.updatedAt.toJSON(),
      friendlyName: this.friendlyName,
      filename: this.filename,
      contract: this.contract
        ? omit(this.contract.toJSON(), 'options')
        : undefined,
      filledItem: this.filledItem && this.filledItem.toJSON(),
      options:
        this.options &&
        this.options.map((option) => omit(option.toJSON(), 'filledContract')),
      witnessSignatures:
        this.witnessSignatures &&
        this.witnessSignatures.map((signature) =>
          omit(signature.toJSON(), 'filledContract'),
        ),
      attachments:
        this.attachments &&
        this.attachments.map((attachment) =>
          omit(attachment.toJSON(), 'filledContract'),
        ),
      userId: this.userId,
      buyerId: this.buyerId,
      accepted: this.accepted,
      sellerSignedAt: this.sellerSignedAt && this.sellerSignedAt.toJSON(),
      buyerSignedAt: this.buyerSignedAt && this.buyerSignedAt.toJSON(),
    };
  }
}
