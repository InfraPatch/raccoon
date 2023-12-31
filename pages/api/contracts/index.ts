import bar from 'next-bar';

import { ensureAdministrator, ensureAuthenticated } from '@/middleware/auth';

import * as contractsController from '@/controllers/contracts/contractsController';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default bar({
  post: ensureAdministrator(contractsController.newContract),
  get: ensureAuthenticated(contractsController.listContracts),
});
