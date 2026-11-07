import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisProvider = {
  provide: 'RedisProvider',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const redis = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      password: configService.get<string>('REDIS_PASSWORD'),
    });

    return redis;
  },
};
