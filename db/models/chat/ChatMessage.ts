import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IUser, User } from '../auth/User';
import { FilledContract, IFilledContract } from '../contracts/FilledContract';

import pick from 'lodash.pick';

export interface IChatMessage {
  uuid?: string;
  createdAt?: Date | string;
  user?: IUser;
  filledContract?: IFilledContract;
  message?: string;
}

@Entity()
export class ChatMessage implements IChatMessage {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  user: Partial<User>;

  @ManyToOne(() => FilledContract)
  filledContract: Partial<FilledContract>;

  @Column()
  message: string;

  toJSON() {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt && this.createdAt.toJSON(),
      user: this.user && pick(this.user, ['id', 'image', 'name', 'isLawyer']),
      filledContract: this.filledContract && this.filledContract.toJSON(),
      message: this.message,
    };
  }
}
