import Link from 'next/link';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { useTranslation } from 'next-i18next';
import { Contract } from '@/db/models/contracts/Contract';
import Box from '@/components/common/box/Box';

interface DashboardNewContractBoxProps {
  contract: Contract;
}

const NewContractBox = ({ contract }: DashboardNewContractBoxProps) => {
  const { t } = useTranslation(['dashboard']);

  return (
    <Box title={contract.friendlyName}>
      <h1 className="py-3">
        {contract.description ||
          t('dashboard:admin.contracts.default-description')}
      </h1>
      <Link href={'/dashboard/contracts/new/' + contract.id}>
        <Button size={ButtonSize.MEDIUM} type="submit">
          {t('dashboard:contracts.new.choose-contract')}
        </Button>
      </Link>
    </Box>
  );
};

export default NewContractBox;
