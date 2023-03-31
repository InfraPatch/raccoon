import bar from 'next-bar';

import * as contractsController from '@/controllers/contracts/contractsController';
import { ensureAuthenticated, ensureAdministrator } from '@/middleware/auth';

export const config = {
  api: {
    bodyParser: false
  }
};

export default bar({
  get: ensureAuthenticated(contractsController.get),
  patch: ensureAdministrator(contractsController.update),
  delete: ensureAdministrator(contractsController.destroy)
});
