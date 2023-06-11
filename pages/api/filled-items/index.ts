import bar from 'next-bar';

import * as filledItemsController from '@/controllers/filled-items/filledItemsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  post: ensureAuthenticated(filledItemsController.create),
});
