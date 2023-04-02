import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import apiService from '@/services/apis';
import FilledContractList from '@/components/dashboard/filled-contract-list/FilledContractList';
import ZeroDataState from '@/components/common/zero-data-state/ZeroDataState';
import Meta from '@/components/common/Meta';

export interface DashboardContractListPageProps {
  user: User;
};

export interface DashboardContractListProps {
  contracts: IFilledContract[];
  type: string;
  partyType: PartyType;
};

const DashboardContractListPage = ({ user }: DashboardContractListPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ ownContracts, setOwnContracts ] = useState<IFilledContract[] | null>(null);
  const [ foreignContracts, setForeignContracts ] = useState<IFilledContract[] | null>(null);
  const [ witnessContracts, setWitnessContracts ] = useState<IFilledContract[] | null>(null);

  const [ error, setError ] = useState('');

  const loadContracts = async () => {
    setOwnContracts(null);
    setForeignContracts(null);
    setWitnessContracts(null);

    setError('');

    try {
      const res = await apiService.filledContracts.listFilledContracts();

      setOwnContracts(res.own);
      setForeignContracts(res.foreign);
      setWitnessContracts(res.witness);
    } catch (err) {
      console.error(err);
      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const getContractListBox = ({ contracts, type, partyType } : DashboardContractListProps) => {
    return (
      <Box key={`${type}-contracts`} title={t(`dashboard:contracts.list.${type}`)}>
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
          <FilledContractList contracts={contracts} onChange={loadContracts} partyType={partyType} />
        )}
      </Box>
    );
  };

  let columns : DashboardContractListProps[] = [
    {contracts: ownContracts, type: 'own', partyType: PartyType.SELLER},
    {contracts: foreignContracts, type: 'buyer', partyType: PartyType.BUYER},
    {contracts: witnessContracts, type: 'witness', partyType: PartyType.WITNESS}
  ];

  // Sort the columns based on whether they are empty or not
  columns.sort((a, b) => (
    Number(b.contracts?.length > 0) - Number(a.contracts?.length > 0)
  ));

  const contractLists = columns.map(getContractListBox);

  return (
    <DashboardLayout user={user}>
      <Meta
        title={ t('dashboard:pages.my-contracts') }
        url="/dashboard/contracts"
      />
      {!error && (
        <Columns>
          <Column>
            {contractLists[0]}
            {contractLists[2]}
          </Column>

          <Column>
            {contractLists[1]}
          </Column>
        </Columns>
      )}

      {error && error.length > 0 && (
        <DangerMessage>
          {error}
        </DangerMessage>
      )}
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
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractListPage;
