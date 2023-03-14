import bar from 'next-bar';

import * as filledContractsController from '@/controllers/filled-contracts/filledContractsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  patch: ensureAuthenticated(filledContractsController.decline)
});
