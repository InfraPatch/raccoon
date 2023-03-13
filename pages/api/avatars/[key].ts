import bar from 'next-bar';

import * as avatarsController from '@/controllers/common/avatarsController';

export default bar({
  get: avatarsController.index
});
