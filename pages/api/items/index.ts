import bar from 'next-bar';

import { ensureAdministrator, ensureAuthenticated } from '@/middleware/auth';

import * as itemsController from '@/controllers/items/itemsController';

export default bar({
  get: ensureAuthenticated(itemsController.index),
  post: ensureAdministrator(itemsController.create),
});
