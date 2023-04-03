import bar from 'next-bar';

import * as filledContractAttachmentController from '@/controllers/filled-contract-attachments/filledContractAttachmentController';
import { ensureAuthenticated } from '@/middleware/auth';

export const config = {
  api: {
    bodyParser: false
  }
};

export default bar({
  post: ensureAuthenticated(filledContractAttachmentController.create)
});
