import bar from 'next-bar';

import * as templateController from '@/controllers/common/templateController';

export default bar({
  get: templateController.index,
});
