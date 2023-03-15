import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User, IUser } from '../auth/User';
import { Contract, IContract } from './Contract';
import { FilledContractOption, IFilledContractOption } from './FilledContractOption';

import db from '../../../services/db';

import omit from 'lodash.omit';

export interface IFilledContract {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  friendlyName?: string;
  userId?: number;
  user?: IUser;
  buyerId?: number;
  buyer?: IUser;
  accepted?: boolean;
  contract?: IContract;
  options?: IFilledContractOption[];
  sellerSignedAt?: Date | string;
  buyerSignedAt?: Date | string;
};

@Entity()
export class FilledContract implements IFilledContract {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  friendlyName: string;

  @Column({ nullable: true })
  filename?: string;

  @ManyToOne(() => Contract)
  contract: Partial<Contract>;

  @OneToMany(() => FilledContractOption, filledContractOption => filledContractOption.filledContract)
  options: Partial<FilledContractOption[]>;

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
      contract: this.contract,
      options: this.options && this.options.map(option => omit(option.toJSON(), 'filledContract')),
      userId: this.userId,
      sellerSignedAt: this.sellerSignedAt && this.sellerSignedAt.toJSON(),
      buyerSignedAt: this.buyerSignedAt && this.buyerSignedAt.toJSON()
    };
  }
}
