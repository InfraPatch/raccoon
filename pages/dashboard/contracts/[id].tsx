import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { User } from '@/db/models/auth/User';
import { IFilledContract } from '@/db/models/contracts/FilledContract';

import apiService from '@/services/apis';

import DashboardLayout from '@/layouts/DashboardLayout';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Box from '@/components/common/box/Box';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import FilledContractFieldsForm from '@/components/dashboard/filled-contract/FilledContractFieldsForm';
import FilledContractActions from '@/components/dashboard/filled-contract/FilledContractActions';
import FilledContractOverview from '@/components/dashboard/filled-contract/FilledContractOverview';

export interface DashboardContractsPageProps {
  user: User;
  id: number;
};

const DashboardContractsPage = ({ user, id }: DashboardContractsPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ contract, setContract ] = useState<IFilledContract | null>(null);
  const [ error, setError ] = useState('');

  const loadContract = async () => {
    setContract(null);
    setError('');

    try {
      const res = await apiService.filledContracts.getFilledContract(id);
      setContract(res.filledContract);
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
    <DashboardLayout user={user}>
      {!error && contract !== null && (
        <Columns>
          <Column>
            <Box title={ t('dashboard:contracts.data.overview') }>
              <FilledContractOverview
                contract={contract}
                isBuyer={contract.buyerId === user.id}
              />
            </Box>

            <Box title={ t('dashboard:contracts.data.actions') }>
              <FilledContractActions
                filledContract={contract}
                onChange={loadContract}
                isBuyer={contract.buyerId === user.id}
              />
            </Box>
          </Column>

          <Column>
            {(contract.buyerId !== user.id || (contract.buyerId === user.id && contract.accepted)) && (
              <Box title={ t('dashboard:contracts.data.my-details') }>
                <FilledContractFieldsForm
                  filledContract={contract}
                  onChange={loadContract}
                  isBuyer={contract.buyerId === user.id}
                />
              </Box>
            )}
          </Column>
        </Columns>
      )}

      {!error && contract === null && <Loading />}

      {error && error.length > 0 && (
        <DangerMessage>
          {error}
        </DangerMessage>
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  const id = parseInt(Array.isArray(query.id) ? query.id[0] : query.id);

  return {
    props: {
      id,
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractsPage;
