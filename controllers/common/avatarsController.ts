import { NextApiRequest, NextApiResponse } from 'next';

import * as fs from 'fs';
import * as path from 'path';

import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { key } = req.query;

  if (!(await storage.exists(`avatars/${key}`))) {
    const defaultAvatar = fs.createReadStream(
      path.join(process.cwd(), 'assets/images', 'default-avatar.png'),
    );
    defaultAvatar.pipe(res);
    return;
  }

  const stream = await storage.getStream(`avatars/${key}`);
  stream.pipe(res);
};
