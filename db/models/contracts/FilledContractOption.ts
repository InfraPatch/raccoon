import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
};

@Entity()
export class FilledContractOption implements IFilledContractOption {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => FilledContract, filledContract => filledContract.options, {
    onDelete: 'CASCADE'
  })
  filledContract: Partial<FilledContract>;

  @ManyToOne(() => ContractOption, {
    onDelete: 'CASCADE'
  })
  option: Partial<ContractOption>;

  @Column()
  value: string;

  toJSON(): IFilledContractOption {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      filledContract: omit(this.filledContract.toJSON(), 'options'),
      option: omit(this.option.toJSON(), 'contract'),
      value: this.value
    };
  }
}
