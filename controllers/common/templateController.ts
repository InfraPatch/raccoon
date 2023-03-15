import { NextApiRequest, NextApiResponse } from 'next';

import { getStorageStrategy } from '@/lib/storageStrategies';
const storage = getStorageStrategy();

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { key } = req.query;

  if (!(await storage.exists(`templates/${key}`))) {
    return res.status(404).json({ ok: false, error: 'FILE_NOT_FOUND' });
  }

  const stream = storage.getStream(`templates/${key}`);
  return stream.pipe(res);
};
