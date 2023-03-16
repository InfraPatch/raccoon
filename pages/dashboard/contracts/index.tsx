import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import { IFilledContract } from '@/db/models/contracts/FilledContract';

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

const DashboardContractListPage = ({ user }: DashboardContractListPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ ownContracts, setOwnContracts ] = useState<IFilledContract[] | null>(null);
  const [ foreignContracts, setForeignContracts ] = useState<IFilledContract[] | null>(null);

  const [ error, setError ] = useState('');

  const loadContracts = async () => {
    setOwnContracts(null);
    setForeignContracts(null);

    setError('');

    try {
      const res = await apiService.filledContracts.listFilledContracts();
      setOwnContracts(res.own);
      setForeignContracts(res.foreign);
    } catch (err) {
      console.error(err);
      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  return (
    <DashboardLayout user={user}>
      <Meta
        title={ t('dashboard:pages.contracts') }
        url="/dashboard/contracts"
      />
      {!error && (
        <Columns>
          <Column>
            <Box title={t('dashboard:contracts.list.own')}>
              {ownContracts === null && (
                <div className="text-center">
                  <Loading />
                </div>
              )}

              {ownContracts && ownContracts.length === 0 && (
                <div className="text-center">
                  <ZeroDataState />
                </div>
              )}

              {ownContracts && ownContracts.length > 0 && (
                <FilledContractList contracts={ownContracts} onChange={loadContracts} />
              )}
            </Box>
          </Column>

          <Column>
            <Box title={t('dashboard:contracts.list.buyer')}>
              {foreignContracts === null && (
                <div className="text-center">
                  <Loading />
                </div>
              )}

              {foreignContracts && foreignContracts.length === 0 && (
                <div className="text-center">
                  <ZeroDataState />
                </div>
              )}

              {foreignContracts && foreignContracts.length > 0 && (
                <FilledContractList contracts={foreignContracts} onChange={loadContracts} isBuyer />
              )}
            </Box>
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
