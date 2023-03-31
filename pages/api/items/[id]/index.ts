import bar from 'next-bar';

import { ensureAuthenticated, ensureAdministrator } from '@/middleware/auth';

import * as itemsController from '@/controllers/items/itemsController';

export default bar({
  get: ensureAuthenticated(itemsController.get),
  patch: ensureAdministrator(itemsController.update),
  delete: ensureAdministrator(itemsController.destroy)
});
