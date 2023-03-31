import bar from 'next-bar';

import * as itemOptionsController from '@/controllers/item-options/itemOptionsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(itemOptionsController.get),
  patch: ensureAuthenticated(itemOptionsController.update),
  delete: ensureAuthenticated(itemOptionsController.destroy)
});
