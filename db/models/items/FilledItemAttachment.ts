import { Entity, ManyToOne, RelationId } from 'typeorm';
import { FilledItem, IFilledItem } from './FilledItem';
import { Attachment, IAttachment } from '../../common/Attachment';

import omit from 'lodash.omit';

export interface IFilledItemAttachment extends IAttachment {
  filledItem?: IFilledItem;
  filledItemId?: number;
}

@Entity()
export class FilledItemAttachment
  extends Attachment
  implements IFilledItemAttachment
{
  @ManyToOne(() => FilledItem, {
    onDelete: 'CASCADE',
  })
  filledItem: Partial<FilledItem>;

  @RelationId((attachment: FilledItemAttachment) => attachment.filledItem)
  filledItemId: number;

  toJSON(): IFilledItemAttachment {
    return {
      ...super.toJSON(),
      filledItem: this.filledItem
        ? omit(this.filledItem.toJSON(), 'item', 'options')
        : undefined,
    };
  }
}
