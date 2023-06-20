import AWS_S3, { S3 as S3Client } from '@aws-sdk/client-s3';
import config from '@/config';

import type { Readable } from 'stream';

const S3Config = config.storage.s3;

class S3 {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: S3Config?.key,
        secretAccessKey: S3Config?.secret,
      },
      region: S3Config?.region,
    });
  }

  async exists(key: string): Promise<boolean> {
    const params = {
      Bucket: S3Config?.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err) {
      if (err.name === 'NotFound') {
        return false;
      }

      throw err;
    }
  }

  async delete(key: string): Promise<boolean> {
    const params = {
      Bucket: S3Config?.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err) {
      if (err.code === 'NotFound') {
        return true; // This key doesn't exist, we wanted to delete it anyway.
      }

      throw err;
    }
  }

  async upload(
    key: string,
    contents: string,
    isPublic?: boolean,
  ): Promise<AWS_S3.PutObjectCommandOutput> {
    const params = {
      ACL: isPublic ? 'public-read' : 'authenticated-read',
      Body: contents,
      Bucket: S3Config?.bucket,
      ContentType: 'text/plain',
      Key: key,
    };

    const data = await this.s3.putObject(params);
    return data;
  }

  async getStream(key: string) {
    const params = {
      Bucket: S3Config?.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    return data.Body as Readable;
  }

  async read(key: string): Promise<Buffer> {
    const params = {
      Bucket: S3Config?.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    const bytes = await data.Body.transformToByteArray();

    return Buffer.from(bytes);
  }
}

export default S3;
