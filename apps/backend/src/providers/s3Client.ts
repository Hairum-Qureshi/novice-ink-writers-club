import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3ClientProvider = {
  provide: 'S3ClientProvider',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const AWS_REGION = configService.get<string>('AWS_REGION');
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
    return s3;
  },
};
