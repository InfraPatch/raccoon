import * as fs from 'fs-extra';
import * as path from 'path';
import config from '@/config';
import IStorageStrategy from './IStorageStrategy';

const STORAGE_ROOT = path.join(
  process.cwd(),
  config.storage.file?.location || 'storage',
);

class FileStorageStrategy implements IStorageStrategy {
  async create(params) {
    const { key, contents } = params;
    const filePath = path.join(STORAGE_ROOT, key);
    const dirPath = path.dirname(filePath);

    if (dirPath?.length > 0) {
      await fs.ensureDir(dirPath);
    }

    await fs.writeFile(filePath, contents);
  }

  async get(key): Promise<Buffer> {
    return fs.readFile(path.join(STORAGE_ROOT, key));
  }

  getStream(key) {
    const filePath = path.join(STORAGE_ROOT, key);
    return fs.createReadStream(filePath);
  }

  async exists(key): Promise<boolean> {
    return fs.pathExists(path.join(STORAGE_ROOT, key));
  }

  async delete(key): Promise<boolean> {
    return fs.unlink(path.join(STORAGE_ROOT, key));
  }
}

export default FileStorageStrategy;
