import { IFilledContract } from '@/db/models/contracts/FilledContract';

import Link from 'next/link';
import FilledContractListItem from './FilledContract';

export interface FilledContractListProps {
  contracts: IFilledContract[];
  onChange: () => Promise<void>;
  isBuyer?: boolean;
};

const FilledContractList = ({ contracts, onChange, isBuyer }: FilledContractListProps) => {
  const sortedContracts = contracts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="py-3">
      {sortedContracts.map(contract => (
        <FilledContractListItem
          key={contract.id}
          contract={contract}
          isBuyer={isBuyer}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default FilledContractList;
