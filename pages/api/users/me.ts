import bar from 'next-bar';

import { ensureAuthenticated } from '@/middleware/auth';

import * as usersController from '@/controllers/users/usersController';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default bar({
  get: ensureAuthenticated(usersController.get),
  patch: ensureAuthenticated(usersController.update),
});
