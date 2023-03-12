import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Contract, IContract } from './Contract';

import omit from 'lodash.omit';

export interface IContractFile {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  contract?: IContract;
  friendlyName: string;
  filename: string;
}

@Entity()
export class ContractFile {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contract, contract => contract.files)
  contract: Contract;

  @Column()
  friendlyName: string;

  @Column()
  filename: string;

  toJSON(): IContractFile {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      contract: omit(this.contract.toJSON(), 'files'),
      friendlyName: this.friendlyName,
      filename: this.filename
    };
  }
}
