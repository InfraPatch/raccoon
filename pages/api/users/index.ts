import bar from 'next-bar';

import { ensureAnonymous } from '@/middleware/auth';

import * as usersController from '@/controllers/users/usersController';

export default bar({
  post: ensureAnonymous(usersController.create)
});
