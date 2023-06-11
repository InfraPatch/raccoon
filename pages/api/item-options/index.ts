import bar from 'next-bar';

import { ensureAdministrator } from '@/middleware/auth';

import * as itemOptionsController from '@/controllers/item-options/itemOptionsController';

export default bar({
  post: ensureAdministrator(itemOptionsController.newItemOption),
  get: ensureAdministrator(itemOptionsController.index),
});
