import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IUser, User } from '../auth/User';
import { FilledItemOption, IFilledItemOption } from './FilledItemOption';
import { IItem, Item } from './Item';

import db from '../../../services/db';
import omit from 'lodash.omit';

export interface IFilledItem {
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  friendlyName?: string;
  userId?: number;
  user?: IUser;
  item?: IItem;
  options?: IFilledItemOption[];
};

@Entity()
export class FilledItem implements IFilledItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  friendlyName: string;

  @ManyToOne(() => Item)
  item: Partial<Item>;

  @OneToMany(() => FilledItemOption, filledItemOption => filledItemOption.filledItem)
  options: Partial<FilledItemOption[]>;

  @Column('integer')
  userId: number;

  async getUser(id: number): Promise<IUser | null> {
    await db.prepare();
    const userRepository = db.getRepository(User);

    const user = await userRepository.findOne(id);
    if (!user) {
      return null;
    }

    return user;
  }

  toJSON(): IFilledItem {
    return {
      id: this.id,
      createdAt: this.createdAt && this.createdAt.toJSON(),
      updatedAt: this.updatedAt && this.updatedAt.toJSON(),
      friendlyName: this.friendlyName,
      item: this.item,
      options: this.options && this.options.map(option => omit(option.toJSON(), 'filledItem')),
      userId: this.userId
    };
  }
}