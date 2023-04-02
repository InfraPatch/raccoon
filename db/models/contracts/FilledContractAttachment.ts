import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { FilledContract, IFilledContract } from './FilledContract';
import { Attachment, IAttachment } from '../../common/Attachment';

import omit from 'lodash.omit';

export interface IFilledContractAttachment extends IAttachment {
  filledContract?: IFilledContract;
  filledContractId?: number;
  isSeller: boolean;
};

@Entity()
export class FilledContractAttachment extends Attachment implements IFilledContractAttachment {
  @ManyToOne(() => FilledContract, filledContract => filledContract.options, {
    onDelete: 'CASCADE'
  })
  filledContract: Partial<FilledContract>;

  @RelationId((attachment: FilledContractAttachment) => attachment.filledContract)
  filledContractId: number;

  @Column('boolean')
  isSeller: boolean;

  toJSON(): IFilledContractAttachment {
    return {
      ...super.toJSON(),
      filledContract: this.filledContract ? omit(this.filledContract.toJSON(), 'options') : undefined,
      isSeller: this.isSeller
    };
  }
}
