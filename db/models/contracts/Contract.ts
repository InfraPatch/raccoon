import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ContractFile, IContractFile } from './ContractFile';
import { ContractOption, IContractOption } from './ContractOption';

import omit from 'lodash.omit';

export interface IContract {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  friendlyName?: string;
  description?: string;
  files?: IContractFile[];
  options?: IContractOption[];
};

@Entity()
export class Contract implements IContract {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  friendlyName: string;

  @Column()
  description: string;

  @OneToMany(() => ContractFile, contractFile => contractFile.contract)
  files: Partial<ContractFile[]>;

  @OneToMany(() => ContractOption, contractOption => contractOption.contract)
  options: Partial<ContractOption[]>;

  toJSON(): IContract {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      friendlyName: this.friendlyName,
      description: this.description,
      files: this.files ? this.files.map(file => omit(file.toJSON(), 'contract')) : [],
      options: this.options ? this.options.map(option => omit(option.toJSON(), 'contract')) : []
    };
  }
}
