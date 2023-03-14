import bar from 'next-bar';

import * as filledContractsController from '@/controllers/filled-contracts/filledContractsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(filledContractsController.get),
  put: ensureAuthenticated(filledContractsController.fill),
  delete: ensureAuthenticated(filledContractsController.destroy)
});
