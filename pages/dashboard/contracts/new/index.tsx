import { GetServerSideProps } from 'next';
import Router from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { GetContractsAPIResponse } from '@/services/apis/contracts/ContractAPIService';
import { Contract } from '@/db/models/contracts/Contract';
import NewContractBox from '@/components/dashboard/contracts/NewContractBox';
import Box from '@/components/common/box/Box';
import { useTranslation } from 'react-i18next';

export interface DashboardNewContractPageProps {
  user: User;
  contracts: Contract[];
};

const DashboardContractsPage = ({ user, contracts }: DashboardNewContractPageProps) => {
  const { t } = useTranslation([ 'dashboard' ]);

  let rows : Contract[][] = [];

  for (let i : number = 0; i < contracts.length; i += 2) {
    rows.push(contracts.slice(i, i + 2));
  }

  return (
    <DashboardLayout user={user}>
      <Columns>
        <Column>
          <Box>
            <div className="text-center">
              <span className="text-xl font-bold">{ t('dashboard:contracts.new.choose-contract-title') }</span>
            </div>
          </Box>
        </Column>
      </Columns>
      {rows.map((row, index) => {
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
    </DashboardLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

  apiService.contracts.setHeaders(req.headers);

  const contracts : GetContractsAPIResponse = await apiService.contracts.getContracts();

  if (!contracts.ok) {
    Router.push('/dashboard');
    return;
  }

  return {
    props: {
      user: session.user,
      contracts: contracts.contracts,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractsPage;
