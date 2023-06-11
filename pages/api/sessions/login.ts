import bar from 'next-bar';

import { ensureAnonymous } from '@/middleware/auth';
import * as sessionsController from '@/controllers/session/sessionsController';

export default bar({
  post: ensureAnonymous(sessionsController.create),
});
