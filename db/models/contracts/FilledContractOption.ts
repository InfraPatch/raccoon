import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContractOption, IContractOption } from './ContractOption';
import { FilledContract, IFilledContract } from './FilledContract';

import omit from 'lodash.omit';

export interface IFilledContractOption {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filledContract?: IFilledContract;
  option?: IContractOption;
  value: string;
}

@Entity()
export class FilledContractOption implements IFilledContractOption {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => FilledContract, (filledContract) => filledContract.options, {
    createForeignKeyConstraints: false,
  })
  filledContract: Partial<FilledContract>;

  @ManyToOne(() => ContractOption, {
    createForeignKeyConstraints: false,
  })
  option: Partial<ContractOption>;

  @Column({ nullable: true })
  value: string;

  toJSON(): IFilledContractOption {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      filledContract: this.filledContract
        ? omit(this.filledContract.toJSON(), 'options')
        : undefined,
      option: this.option ? omit(this.option.toJSON(), 'contract') : undefined,
      value: this.value,
    };
  }
}
