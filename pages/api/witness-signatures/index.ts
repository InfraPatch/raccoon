import bar from 'next-bar';

import * as witnessSignaturesController from '@/controllers/witness-signatures/witnessSignaturesController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  post: ensureAuthenticated(witnessSignaturesController.create)
});
