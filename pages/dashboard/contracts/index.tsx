import DashboardLayout from '@/layouts/DashboardLayout';

import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import apiService from '@/services/apis';
import FilledContractList from '@/components/dashboard/filled-contract-list/FilledContractList';
import ZeroDataState from '@/components/common/zero-data-state/ZeroDataState';
import Meta from '@/components/common/Meta';

export interface DashboardContractListProps {
  contracts: IFilledContract[];
  type: string;
  partyType: PartyType;
}

export interface DashboardContractTypeProps {
  id: number;
  friendlyName: string;
}

const DashboardContractListPage = () => {
  const { t } = useTranslation(['dashboard', 'errors']);
  const unsortedContractType = {
    id: -1,
    friendlyName: t('dashboard:contracts.list.all-contracts'),
  };

  const [ownContracts, setOwnContracts] = useState<IFilledContract[] | null>(
    null,
  );
  const [foreignContracts, setForeignContracts] = useState<
    IFilledContract[] | null
  >(null);
  const [witnessContracts, setWitnessContracts] = useState<
    IFilledContract[] | null
  >(null);
  const [contractTypes, setContractTypes] = useState<
    DashboardContractTypeProps[]
  >([unsortedContractType]);

  // Search arguments
  const [filteredName, setFilteredName] = useState<string | null>(null);
  const [filteredType, setFilteredType] = useState<number | null>(null);

  const [error, setError] = useState('');

  const loadContracts = async () => {
    const collectContractTypes = (
      contracts: IFilledContract[],
      contractTypes: DashboardContractTypeProps[],
    ) => {
      if (!contracts) {
        return;
      }

      for (const filledContract of contracts) {
        const contract = filledContract.contract;

        // Add this contract type if we haven't encountered it previously
        if (!contractTypes.some((t) => t.id === contract.id)) {
          contractTypes.push({
            id: contract.id,
            friendlyName: contract.friendlyName,
          });
        }
      }
    };

    setOwnContracts(null);
    setForeignContracts(null);
    setWitnessContracts(null);
    setFilteredName(null);
    setFilteredType(null);
    setContractTypes([unsortedContractType]);

    setError('');

    try {
      const res = await apiService.filledContracts.listFilledContracts();

      setOwnContracts(res.own);
      setForeignContracts(res.foreign);
      setWitnessContracts(res.witness);

      const types: DashboardContractTypeProps[] = [];
      collectContractTypes(res.own, types);
      collectContractTypes(res.foreign, types);
      collectContractTypes(res.witness, types);

      // Sort types by name
      types.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

      // Add default, unsorted type
      types.unshift(unsortedContractType);

      setContractTypes(types);
    } catch (err) {
      console.error(err);
      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const getContractListBox = ({
    contracts,
    type,
    partyType,
  }: DashboardContractListProps) => {
    return (
      <Box
        key={`${type}-contracts`}
        title={t(`dashboard:contracts.list.${type}`)}
      >
        {contracts === null && (
          <div className="text-center">
            <Loading />
          </div>
        )}

        {contracts && contracts.length === 0 && (
          <div className="text-center">
            <ZeroDataState />
          </div>
        )}

        {contracts && contracts.length > 0 && (
          <FilledContractList
            contracts={contracts}
            onChange={loadContracts}
            partyType={partyType}
          />
        )}
      </Box>
    );
  };

  const filterContracts = (contracts: IFilledContract[]) => {
    if (contracts === null) {
      return null;
    }

    return contracts.filter((c) => {
      if (
        filteredName &&
        !c.friendlyName.trim().toLowerCase().includes(filteredName) &&
        !c.contract.friendlyName.trim().toLowerCase().includes(filteredName) &&
        !c.buyer?.name?.trim().toLowerCase().includes(filteredName) &&
        !c.user?.name?.trim().toLowerCase().includes(filteredName)
      ) {
        return false;
      }

      if (filteredType && c.contract.id !== filteredType) {
        return false;
      }

      return true;
    });
  };

  const searchForName = (e) => {
    const name = e.target.value.trim().toLowerCase();
    setFilteredName(name.length !== 0 ? name : null);
  };

  const searchForType = (e) => {
    const type = Number(e.target.value);
    setFilteredType(type !== -1 ? type : null);
  };

  const columns: DashboardContractListProps[] = [
    {
      contracts: filterContracts(ownContracts),
      type: 'own',
      partyType: PartyType.SELLER,
    },
    {
      contracts: filterContracts(foreignContracts),
      type: 'buyer',
      partyType: PartyType.BUYER,
    },
    {
      contracts: filterContracts(witnessContracts),
      type: 'witness',
      partyType: PartyType.WITNESS,
    },
  ];

  // Sort the columns based on whether they are empty or not
  columns.sort(
    (a, b) => Number(b.contracts?.length > 0) - Number(a.contracts?.length > 0),
  );

  const contractLists = columns.map(getContractListBox);

  return (
    <DashboardLayout>
      <Meta
        title={t('dashboard:pages.my-contracts')}
        url="/dashboard/contracts"
      />
      {!error && (
        <Columns>
          <Column>
            <Box>
              <div className="text-center">
                <div className="form-field">
                  <label htmlFor="searchName">
                    {t('dashboard:contracts.list.search-by-name')}
                  </label>
                  <input
                    id="searchName"
                    name="searchName"
                    type="text"
                    onChange={searchForName}
                    placeholder={t('dashboard:contracts.list.contract-name')}
                  />
                </div>
              </div>
            </Box>
            {contractLists[0]}
            {contractLists[2]}
          </Column>

          <Column>
            <Box>
              <div className="text-center">
                <div className="form-field">
                  <label htmlFor="searchType">
                    {t('dashboard:contracts.list.search-by-type')}
                  </label>
                  <select
                    id="searchType"
                    name="searchType"
                    onChange={searchForType}
                  >
                    {contractTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.friendlyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Box>
            {contractLists[1]}
          </Column>
        </Columns>
      )}

      {error && error.length > 0 && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'errors',
      ])),
    },
  };
};

export default DashboardContractListPage;
