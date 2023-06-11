import bar from 'next-bar';

import { ensureAdministrator } from '@/middleware/auth';

import * as usersController from '@/controllers/users/usersController';

export default bar({
  post: ensureAdministrator(usersController.makeAdmin),
});
