import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FilledItem, IFilledItem } from './FilledItem';
import { IItemOption, ItemOption } from './ItemOption';

import omit from 'lodash.omit';

export interface IFilledItemOption {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filledItem?: IFilledItem;
  option?: IItemOption;
  value: string;
}

@Entity()
export class FilledItemOption implements IFilledItemOption {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => FilledItem, (filledItem) => filledItem.options, {
    onDelete: 'CASCADE',
  })
  filledItem: Partial<FilledItem>;

  @ManyToOne(() => ItemOption, {
    onDelete: 'CASCADE',
  })
  option: Partial<ItemOption>;

  @Column({ nullable: true })
  value: string;

  toJSON(): IFilledItemOption {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      filledItem: this.filledItem
        ? omit(this.filledItem.toJSON(), 'options')
        : undefined,
      option: this.option ? omit(this.option.toJSON(), 'item') : undefined,
      value: this.value,
    };
  }
}
