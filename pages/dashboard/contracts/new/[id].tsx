import DashboardLayout from '@/layouts/DashboardLayout';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';
import NewFilledContractForm from '@/components/dashboard/new-filled-contract/NewFilledContractForm';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Meta from '@/components/common/Meta';

import idFromQueryParam from '@/lib/idFromQueryParam';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';
import { Contract } from '@/db/models/contracts/Contract';

export interface DashboardNewContractPageProps {
  contractId: number;
};

const DashboardNewContractPage = ({ contractId }: DashboardNewContractPageProps) => {
  const { t } = useTranslation('dashboard');

  const [ contract, setContract ] = useState<Contract | null>(null);
  const [ error, setError ] = useState('');

  const loadContract = async () => {
    setContract(null);
    setError('');

    try {
      const res = await apiService.contracts.getContract({ id: contractId });
      setContract(res.contract);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          setError(t(`errors:contracts.${message}`));
          return;
        }
      }

      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadContract();
  }, []);

  return (
    <DashboardLayout>
      <Meta
        title={ t('dashboard:pages.new-contract') }
        url={`/dashboard/contracts/new/${contractId}`}
      />
      <Columns>
        <Column>
          <Box title={ t('new-contract.title') }>
            {contract && <NewFilledContractForm contract={contract} />}
            {!contract && !error && <Loading />}
            {error && error.length > 0 && <DangerMessage>{error}</DangerMessage>}
          </Box>
        </Column>

        <Column />
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  const { id } = query;

  return {
    props: {
      contractId: idFromQueryParam(id),
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardNewContractPage;
