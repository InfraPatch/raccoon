import bar from 'next-bar';

import * as contractsController from '@/controllers/contracts/contractsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(contractsController.download),
});
