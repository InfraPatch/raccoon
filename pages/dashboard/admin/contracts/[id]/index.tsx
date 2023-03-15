import { GetServerSideProps } from 'next';
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
import { ContractOption } from '@/db/models/contracts/ContractOption';
import EditContractForm from '@/components/dashboard/admin/contracts/EditContractForm';
import ContractOptionForm from '@/components/dashboard/admin/contracts/ContractOptionForm';

export interface DashboardContractPageProps {
  user: User;
  contract: Contract;
};

const DashboardContractPage = ({ user, contract }: DashboardContractPageProps) => {
  let rows : ContractOption[][] = [];

  for (let i : number = 0; i < contract.options.length; i += 3) {
    rows.push(contract.options.slice(i, i + 3));
  }

  console.log(contract);
  return (
    <DashboardLayout user={user}>
      <Columns>
        <Column key={'contract-' + contract.id}>
          <EditContractForm contractProp={contract} />
        </Column>
      </Columns>
      {rows.map((row, index) => {
        let columns = [];

        for (let i : number = 0; i < row.length; ++i) {
          let contractOption : ContractOption = row[i];

          columns.push(
            <Column key={'contractoption-' + contractOption.id}>
              <ContractOptionForm contract={contract} contractOption={contractOption} />
            </Column>
          );
        }

        return <Columns key={'column-' + index}>{columns}</Columns>;
      })}
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
    res.writeHead(301, {
      location: '/dashboard/admin/contracts'
    });
    res.end();
    return { props: { user: null } };
  }

  let contract : GetContractAPIResponse;

  try {
    contract = await apiService.contracts.getContract({ id: contractId });
  } catch (err) {
    console.log(err);
    res.writeHead(301, {
      location: '/dashboard/admin/contracts'
    });
    res.end();
    return { props: { user: null } };
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
