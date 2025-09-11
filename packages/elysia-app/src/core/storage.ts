import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'src/conf/env';
import { v4 as uuidv4 } from 'uuid';

export interface IGetPreSignedUrlProps {
  key?: string;
}

export interface IStorage {
  getPreSignedUrl(props: IGetPreSignedUrlProps): Promise<{ url: string }>;
}

export class S3Storage implements IStorage {
  private client;

  public constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      endpoint: env.NODE_ENV === 'development' ? env.S3_ENDPOINT : undefined,
      forcePathStyle: env.NODE_ENV === 'development',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async getPreSignedUrl(props: IGetPreSignedUrlProps) {
    const command = new PutObjectCommand({
      Key: props.key ?? uuidv4(),
      Bucket: env.S3_BUCKET_NAME,
    });

    const url = await getSignedUrl(this.client, command, {
      expiresIn: 10 * 60, // 10 minutes
    });

    return {
      url,
    };
  }
}
