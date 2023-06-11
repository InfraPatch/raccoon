import bar from 'next-bar';

import * as filledItemAttachmentController from '@/controllers/filled-item-attachments/filledItemAttachmentController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(filledItemAttachmentController.get),
  delete: ensureAuthenticated(filledItemAttachmentController.destroy),
});
