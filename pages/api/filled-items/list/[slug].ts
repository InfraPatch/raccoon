import bar from 'next-bar';

import * as filledItemsController from '@/controllers/filled-items/filledItemsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(filledItemsController.index),
});
