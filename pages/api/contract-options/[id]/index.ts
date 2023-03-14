import bar from 'next-bar';

import * as contractOptionsController from '@/controllers/contract-options/contractOptionsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(contractOptionsController.get),
  //  patch: ensureAuthenticated(contractOptionsController.update),
  delete: ensureAuthenticated(contractOptionsController.destroy)
});
