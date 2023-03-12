import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contract, IContract } from './Contract';

import omit from 'lodash.omit';

export enum ContractOptionType {
  STRING,
  NUMBER,
  PERSONAL_IDENTIFIER,
  STATE,
  COUNTRY,
  PHONE_NUMBER,
  EMAIL,
  URL,
  DATE
};

export interface IContractOption {
  id: number;
  contract?: IContract;
  type: ContractOptionType;
  priority: number;
  friendlyName: string;
  longDescription?: string;
  hint?: string;
  replacementString: string;
  minimumValue?: number;
  maximumValue?: number;
}

@Entity()
export class ContractOption implements IContractOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, contract => contract.options)
  contract: Contract;

  @Column('enum', { enum: ContractOptionType, default: ContractOptionType.STRING })
  type: ContractOptionType;

  @Column('integer')
  priority: number;

  @Column()
  friendlyName: string;

  @Column({ nullable: true })
  longDescription?: string;

  @Column({ nullable: true })
  hint?: string;

  @Column()
  replacementString: string;

  @Column('integer', { nullable: true })
  minimumValue?: number;

  @Column('integer', { nullable: true })
  maximumValue?: number;

  toJSON(): IContractOption {
    return {
      id: this.id,
      contract: omit(this.contract.toJSON(), 'options'),
      type: this.type,
      priority: this.priority,
      friendlyName: this.friendlyName,
      longDescription: this.longDescription,
      hint: this.hint,
      replacementString: this.replacementString,
      minimumValue: this.minimumValue,
      maximumValue: this.maximumValue
    };
  }
}
