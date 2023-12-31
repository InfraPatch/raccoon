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
import { ContractOption, IContractOption } from './ContractOption';

import omit from 'lodash.omit';
import { Item, IItem } from '../items/Item';

export interface IContract {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  friendlyName?: string;
  description?: string;
  driveId?: string;
  item?: IItem;
  options?: IContractOption[];
}

@Entity()
export class Contract implements IContract {
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

  @Column()
  description: string;

  @Column()
  driveId: string;

  @ManyToOne(() => Item, { nullable: true, createForeignKeyConstraints: false })
  item?: Partial<Item>;

  @OneToMany(
    () => ContractOption,
    (contractOption) => contractOption.contract,
    { createForeignKeyConstraints: false },
  )
  options: Partial<ContractOption[]>;

  toJSON(): IContract {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      friendlyName: this.friendlyName,
      description: this.description,
      item: this.item && this.item.toJSON(),
      options: this.options
        ? this.options.map((option) => omit(option.toJSON(), 'contract'))
        : [],
    };
  }
}
