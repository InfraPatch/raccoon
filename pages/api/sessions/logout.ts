import bar from 'next-bar';

import { ensureAuthenticated } from '@/middleware/auth';
import * as sessionsController from '@/controllers/session/sessionsController';

export default bar({
  post: ensureAuthenticated(sessionsController.destroy),
});
