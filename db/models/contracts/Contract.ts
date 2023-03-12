import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractFile, IContractFile } from './ContractFile';
import { ContractOption, IContractOption } from './ContractOption';

import omit from 'lodash.omit';

export interface IContract {
  id: number;
  friendlyName: string;
  description: string;
  files?: IContractFile[];
  options?: IContractOption[];
};

@Entity()
export class Contract implements IContract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  friendlyName: string;

  @Column()
  description: string;

  @OneToMany(() => ContractFile, contractFile => contractFile.contract)
  files: ContractFile[];

  @OneToMany(() => ContractOption, contractOption => contractOption.contract)
  options: ContractOption[];

  toJSON(): IContract {
    return {
      id: this.id,
      friendlyName: this.friendlyName,
      description: this.description,
      files: this.files.map(file => omit(file.toJSON(), 'contract')),
      options: this.options.map(option => omit(option.toJSON(), 'contract'))
    };
  }
}
