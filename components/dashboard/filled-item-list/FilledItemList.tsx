import Column from '@/components/common/columns/Column';
import Columns from '@/components/common/columns/Columns';
import { IFilledItem } from '@/db/models/items/FilledItem';
import { useEffect, useState } from 'react';

import FilledItemBox from './FilledItem';

export interface FilledItemListProps {
  filledItems: IFilledItem[];
  slug: string;
};

const FilledItemList = ({ filledItems, slug }: FilledItemListProps) => {
  const [ itemPairs, setItemPairs ] = useState<IFilledItem[][]>([]);

  useEffect(() => {
    const sortedItems = filledItems
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const n = sortedItems.length;
    const newItemPairs: IFilledItem[][] = [];

    for (let i = 0; i < n; i += 2) {
      if (i === n - 1) {
        newItemPairs.push([ sortedItems[i] ]);
      } else {
        newItemPairs.push([ sortedItems[i], sortedItems[i + 1] ]);
      }
    }

    setItemPairs(newItemPairs);
  }, [ filledItems ]);

  return (
    <div>
      {itemPairs && itemPairs.map((pair, idx) => (
        <Columns key={idx}>
          {pair.map(item => (
            <Column key={item.id}>
              <FilledItemBox filledItem={item} slug={slug} />
            </Column>
          ))}

          {pair.length === 1 && <Column />}
        </Columns>
      ))}
    </div>
  );
};

export default FilledItemList;
