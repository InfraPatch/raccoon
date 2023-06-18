import bar from 'next-bar';

import * as chatController from '@/controllers/chat/chatController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(chatController.index),
});
