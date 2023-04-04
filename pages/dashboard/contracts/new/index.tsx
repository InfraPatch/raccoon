import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Contract } from '@/db/models/contracts/Contract';
import NewContractBox from '@/components/dashboard/contracts/NewContractBox';
import Box from '@/components/common/box/Box';
import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

const DashboardContractsPage = () => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ rows, setRows ] = useState<Contract[][] | null>(null);
  const [ error, setError ] = useState('');

  const loadContracts = async () => {
    setRows(null);
    setError('');

    try {
      const res = await apiService.contracts.getContracts();
      const contracts = res.contracts;

      const rows: Contract[][] = [];

      for (let i : number = 0; i < contracts.length; i += 2) {
        rows.push(contracts.slice(i, i + 2));
      }

      setRows(rows);
    } catch (err) {
      console.error(err);
      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  return (
    <DashboardLayout>
      <Meta
        title={ t('dashboard:pages.new-contract') }
        url="/dashboard/contracts/new"
      />

      <Box>
        <div className="text-center">
          <span className="text-xl font-bold">{ t('dashboard:contracts.new.choose-contract-title') }</span>
        </div>
      </Box>

      {rows && rows.map((row, index) => {
        let columns = [];

        for (let i : number = 0; i < row.length; ++i) {
          let contract : Contract = row[i];

          columns.push(
            <Column key={'newcontract-' + contract.id}>
              <NewContractBox contract={contract} />
            </Column>
          );
        }

        return <Columns key={'column-' + index}>{columns}</Columns>;
      })}

      {!rows && !error && <Loading />}

      {error && error.length && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractsPage;
