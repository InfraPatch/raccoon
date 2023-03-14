import bar from 'next-bar';

import { ensureAdministrator } from '@/middleware/auth';

import * as contractOptionsController from '@/controllers/contract-options/contractOptionsController';

export default bar({
//  post: ensureAdministrator(contractOptionsController.newContractOption),
  get: ensureAdministrator(contractOptionsController.listContractOptions)
});
