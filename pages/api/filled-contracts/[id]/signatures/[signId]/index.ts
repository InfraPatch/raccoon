import bar from 'next-bar';

import * as filledContractController from '@/controllers/filled-contracts/filledContractsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(filledContractController.downloadSignature),
});
