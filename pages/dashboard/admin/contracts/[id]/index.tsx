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

import { GetContractAPIResponse } from '@/services/apis/contracts/ContractAPIService';
import { Contract } from '@/db/models/contracts/Contract';
import EditContractForm from '@/components/dashboard/admin/contracts/EditContractForm';
import ContractOptionForm from '@/components/dashboard/admin/contracts/ContractOptionForm';

export interface DashboardContractPageProps {
  user: User;
  contract: Contract;
};

const DashboardContractPage = ({ user, contract }: DashboardContractPageProps) => {
  return (
    <DashboardLayout user={user}>
      <Columns>
        <Column key={'contract-' + contract.id}>
          <EditContractForm contractProp={contract} />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <ContractOptionForm contract={contract} />
        </Column>
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res, locale, query }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

  apiService.contracts.setHeaders(req.headers);
  apiService.contractOptions.setHeaders(req.headers);

  const { id } = query;
  const contractId : number = parseInt(Array.isArray(id) ? id[0] : id);

  if (isNaN(contractId)) {
    Router.push('/dashboard/admin/contracts');
    return;
  }

  const contract : GetContractAPIResponse = await apiService.contracts.getContract({ id: contractId });

  if (!contract.ok) {
    Router.push('/dashboard/admin/contracts');
    return;
  }

  return {
    props: {
      user: session.user,
      contract: contract.contract,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractPage;
