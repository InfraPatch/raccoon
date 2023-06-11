import bar from 'next-bar';

import * as contactController from '@/controllers/contact/contactController';

export default bar({
  post: contactController.send,
});
