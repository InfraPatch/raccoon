import S3 from '@/services/s3';
import IStorageStrategy from './IStorageStrategy';

class S3StorageStrategy implements IStorageStrategy {
  async create(params) {
    await new S3().upload(params.key, params.contents, params.isPublic);
  }

  async get(key) : Promise<Buffer> {
    return new S3().read(key);
  }

  getStream(key) {
    return new S3().getStream(key);
  }

  async exists(key) : Promise<boolean> {
    return new S3().exists(key);
  }

  async delete(key) : Promise<boolean> {
    return new S3().delete(key);
  }
}

export default S3StorageStrategy;
