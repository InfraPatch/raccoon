import { Entity, ManyToOne } from 'typeorm';
import { Option, IOption } from '../../common/Option';
import { Item, IItem } from './Item';

import omit from 'lodash.omit';

export interface IItemOption extends IOption {
  item?: IItem;
}

@Entity()
export class ItemOption extends Option implements IItemOption {
  @ManyToOne(() => Item, (item) => item.options, {
    createForeignKeyConstraints: false,
  })
  item: Partial<Item>;

  toJSON(): IItemOption {
    return {
      ...super.toJSON(),
      item: this.item ? omit(this.item.toJSON(), 'options') : undefined,
    };
  }
}
