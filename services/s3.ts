import AWS from 'aws-sdk';
import config from '@/config';

const S3Config = config.storage.s3;

class S3 {
  private s3: AWS.S3;

  constructor() {
    const endpoint = new AWS.Endpoint(S3Config.endpoint);

    this.s3 = new AWS.S3({
      endpoint,
      credentials: {
        accessKeyId: S3Config.key,
        secretAccessKey: S3Config.secret
      }
    });
  }

  exists(key: string): Promise<boolean> {
    const params = {
      Bucket: S3Config.bucket,
      Key: key
    };

    return new Promise((resolve, reject) => {
      this.s3.headObject(params, err => {
        if (err) {
          if (err.code === 'NotFound') {
            return resolve(false);
          }

          return reject(err);
        }

        return resolve(true);
      });
    });
  }

  upload(key: string, contents: string): Promise<any> {
    const params = {
      ACL: 'public-read',
      Body: contents,
      Bucket: S3Config.bucket,
      ContentType: 'text/plain',
      Key: key
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  getStream(key: string) {
    const params = {
      Bucket: S3Config.bucket,
      Key: key
    };

    return this.s3.getObject(params).createReadStream();
  }

  read(key: string): Promise<string> {
    const params = {
      Bucket: S3Config.bucket,
      Key: key
    };

    return new Promise((resolve, reject) => {
      return this.s3.getObject(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.Body.toString());
      });
    });
  }
}

export default S3;
