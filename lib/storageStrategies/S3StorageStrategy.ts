import S3 from '@/services/s3';
import IStorageStrategy from './IStorageStrategy';

class S3StorageStrategy implements IStorageStrategy {
  async create(params) {
    await new S3().upload(params.key, params.contents);
  }

  async get(key) {
    return new S3().read(key);
  }

  getStream(key) {
    return new S3().getStream(key);
  }

  async exists(key) {
    return new S3().exists(key);
  }
}

export default S3StorageStrategy;
