import bar from 'next-bar';

import { ensureAdministrator } from '@/middleware/auth';

import * as contractsController from '@/controllers/contracts/contractsController';

export const config = {
  api: {
    bodyParser: false
  }
};

export default bar({
  post: ensureAdministrator(contractsController.newContract),
  get: ensureAdministrator(contractsController.listContracts)
});
