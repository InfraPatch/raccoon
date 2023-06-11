import bar from 'next-bar';

import * as filledItemAttachmentController from '@/controllers/filled-item-attachments/filledItemAttachmentController';
import { ensureAuthenticated } from '@/middleware/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default bar({
  post: ensureAuthenticated(filledItemAttachmentController.create),
});
