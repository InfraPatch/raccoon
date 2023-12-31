import { Column, Entity, ManyToOne } from 'typeorm';
import { Option, IOption } from '../../common/Option';
import { Contract, IContract } from './Contract';

import omit from 'lodash.omit';

export interface IContractOption extends IOption {
  contract?: IContract;
  isSeller?: boolean;
}

@Entity()
export class ContractOption extends Option implements IContractOption {
  @ManyToOne(() => Contract, (contract) => contract.options, {
    createForeignKeyConstraints: false,
  })
  contract: Partial<Contract>;

  @Column('boolean', { default: false })
  isSeller?: boolean;

  toJSON(): IContractOption {
    return {
      ...super.toJSON(),
      contract: this.contract
        ? omit(this.contract.toJSON(), 'options')
        : undefined,
      isSeller: this.isSeller,
    };
  }
}
