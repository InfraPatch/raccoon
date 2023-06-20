import bar from 'next-bar';

import * as contractsController from '@/controllers/contracts/contractsController';
import { ensureAdministrator } from '@/middleware/auth';

export default bar({
  get: ensureAdministrator(contractsController.edit),
});
