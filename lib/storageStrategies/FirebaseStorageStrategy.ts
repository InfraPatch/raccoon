import Firebase from '@/services/firebase';
import IStorageStrategy from './IStorageStrategy';

class FirebaseStorageStrategy implements IStorageStrategy {
  async create(params) {
    await new Firebase().upload(params.key, params.contents);
  }

  async get(key: string): Promise<Buffer> {
    return new Firebase().read(key);
  }

  getStream(key: string) {
    return new Firebase().getStream(key);
  }

  async exists(key: string): Promise<boolean> {
    return new Firebase().exists(key);
  }

  async delete(key: string): Promise<boolean> {
    return new Firebase().delete(key);
  }
}

export default FirebaseStorageStrategy;
