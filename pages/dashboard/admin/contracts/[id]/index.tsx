import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Contract } from '@/db/models/contracts/Contract';
import { ContractOption } from '@/db/models/contracts/ContractOption';
import EditContractForm from '@/components/dashboard/admin/contracts/EditContractForm';
import ContractOptionForm from '@/components/dashboard/admin/contracts/ContractOptionForm';
import Meta from '@/components/common/Meta';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

export interface DashboardContractPageProps {
  id: number;
}

const DashboardContractPage = ({ id }: DashboardContractPageProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const [contract, setContract] = useState<Contract | null>(null);
  const [rows, setRows] = useState<ContractOption[][]>([]);

  const [error, setError] = useState('');

  const rerenderOptions = (contract: Contract) => {
    const rows: ContractOption[][] = [];

    for (let i = 0; i < contract.options.length; i += 3) {
      rows.push(contract.options.slice(i, i + 3));
    }

    setRows(rows);
  };

  const loadContract = async () => {
    setContract(null);
    setRows(null);

    setError('');

    try {
      const res = await apiService.contracts.getContract({ id });
      setContract(res.contract);
      rerenderOptions(res.contract);
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
        title={`${t('dashboard:pages.contract')}: ${
          contract?.friendlyName || '...'
        }`}
        url={`/dashboard/admin/contracts/${id}`}
      />

      {contract && (
        <>
          <Columns>
            <Column key={'contract-' + contract.id}>
              <EditContractForm contractProp={contract} />
            </Column>
          </Columns>

          {rows &&
            rows.map((row, index) => {
              const columns = [];

              for (let i = 0; i < row.length; ++i) {
                const contractOption: ContractOption = row[i];

                columns.push(
                  <Column key={'contractoption-' + contractOption.id}>
                    <ContractOptionForm
                      contract={contract}
                      contractOption={contractOption}
                      setContract={rerenderOptions}
                    />
                  </Column>,
                );
              }

              return <Columns key={'column-' + index}>{columns}</Columns>;
            })}
          <Columns>
            <Column>
              <ContractOptionForm
                contract={contract}
                setContract={rerenderOptions}
              />
            </Column>
          </Columns>
        </>
      )}

      {!contract && !error && <Loading />}

      {error && error.length && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { id } = query;

  return {
    props: {
      id,
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'errors',
      ])),
    },
  };
};

export default DashboardContractPage;
