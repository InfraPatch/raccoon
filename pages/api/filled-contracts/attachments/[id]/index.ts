import bar from 'next-bar';

import * as filledContractAttachmentController from '@/controllers/filled-contract-attachments/filledContractAttachmentController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(filledContractAttachmentController.get),
  delete: ensureAuthenticated(filledContractAttachmentController.destroy),
});
