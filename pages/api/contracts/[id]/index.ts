import bar from 'next-bar';

import * as contractsController from '@/controllers/contracts/contractsController';
import { ensureAuthenticated } from '@/middleware/auth';
import contracts from '..';

export default bar({
  get: ensureAuthenticated(contractsController.get),
//  put: ensureAuthenticated(contractsController.fill),
//  delete: ensureAuthenticated(contractsController.destroy)
});
