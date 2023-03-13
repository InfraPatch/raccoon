import firebase from 'firebase-admin';
import config from '@/config';

import * as fs from 'fs';
import * as path from 'path';
import { Bucket } from '@google-cloud/storage';

const FirebaseConfig = config.storage.firebase;

const getCredentials = () => {
  const serviceAccountFilepath = path.join(process.cwd(), '.firebase/credentials.json');

  if (fs.existsSync(serviceAccountFilepath)) {
    const serviceAccountFile = fs.readFileSync(serviceAccountFilepath, {
      encoding: 'utf8'
    });

    return JSON.parse(serviceAccountFile);
  }

  const serviceAccountEnv = FirebaseConfig.serviceAccount;

  if (serviceAccountEnv) {
    return JSON.parse(serviceAccountEnv);
  }

  return null;
};

const initFirebaseStorage = () => {
  if (firebase.apps.length === 0) {
    const credentials = getCredentials();

    firebase.initializeApp({
      credential: firebase.credential.cert(credentials)
    });
  }

  const bucket = FirebaseConfig.bucket?.replace('.appspot.com', '');
  return firebase.app().storage().bucket(`${bucket}.appspot.com`);
};

class Firebase {
  private storage: Bucket | null;

  constructor() {
    this.storage = initFirebaseStorage();
  }

  exists(key): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.file(key).exists()
        .then(res => resolve(res[0]))
        .catch(reject);
    });
  }

  upload(key: string, contents: Buffer): Promise<any> {
    const file = this.storage.file(key);

    return new Promise((resolve, reject) => {
      file.save(contents, err => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  getStream(key: string) {
    const file = this.storage.file(key);
    return file.createReadStream();
  }

  read(key: string): Promise<Buffer> {
    const file = this.storage.file(key);

    return new Promise((resolve, reject) => {
      file.download()
        .then(contents => resolve(contents[0]))
        .catch(reject);
    });
  }
}

export default Firebase;
