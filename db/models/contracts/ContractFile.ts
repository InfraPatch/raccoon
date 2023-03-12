import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contract, IContract } from './Contract';

import omit from 'lodash.omit';

export interface IContractFile {
  id: number;
  contract?: IContract;
  friendlyName: string;
  filename: string;
}

@Entity()
export class ContractFile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, contract => contract.files)
  contract: Contract;

  @Column()
  friendlyName: string;

  @Column()
  filename: string;

  toJSON(): IContractFile {
    return {
      id: this.id,
      contract: omit(this.contract.toJSON(), 'files'),
      friendlyName: this.friendlyName,
      filename: this.filename
    };
  }
}
