import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemOption, IItemOption } from './ItemOption';

import omit from 'lodash.omit';

export interface IItem {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  friendlyName?: string;
  slug?: string;
  description?: string;
  options?: IItemOption[];
}

@Entity()
export class Item implements IItem {
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

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @OneToMany(() => ItemOption, (itemOption) => itemOption.item, {
    createForeignKeyConstraints: false,
  })
  options: Partial<ItemOption[]>;

  toJSON(): IItem {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      friendlyName: this.friendlyName,
      slug: this.slug,
      description: this.description,
      options: this.options
        ? this.options.map((option) => omit(option.toJSON(), 'item'))
        : [],
    };
  }
}
