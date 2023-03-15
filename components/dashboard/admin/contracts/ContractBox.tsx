import Link from 'next/link';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { useTranslation } from 'react-i18next';
import { Contract } from '@/db/models/contracts/Contract';
import Box from '@/components/common/box/Box';

interface DashboardContractBoxProps {
  contract: Contract;
};

const ContractBox = ({ contract } : DashboardContractBoxProps) => {
  const { t } = useTranslation([ 'dashboard' ]);

  return (
    <Box title={contract.friendlyName}>
      <span className="py-3">{t('dashboard:admin.contracts.last-updated')}: {contract.updatedAt}</span>
      <h1 className="py-3">{contract.description || t('dashboard:admin.contracts.default-description')}</h1>
      <Link href={"/dashboard/admin/contracts/" + contract.id}>
        <Button size={ButtonSize.MEDIUM} type="submit">
          { t('dashboard:admin.contracts.edit-contract') }
        </Button>
      </Link>
    </Box>
  );
};

export default ContractBox;
