import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import FilledContractListItem from './FilledContract';

export interface FilledContractListProps {
  contracts: IFilledContract[];
  onChange: () => Promise<void>;
  partyType?: PartyType;
};

const FilledContractList = ({ contracts, onChange, partyType }: FilledContractListProps) => {
  const sortedContracts = contracts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="py-3">
      {sortedContracts.map(contract => (
        <FilledContractListItem
          key={contract.id}
          contract={contract}
          partyType={partyType}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default FilledContractList;
