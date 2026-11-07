import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { Logger } from '@nestjs/common';

const logger = new Logger('Redis');

export const CacheConfig = {
  inject: [ConfigService],

  useFactory: async (configService: ConfigService) => {
    const redisUrl = configService.getOrThrow<string>('REDIS_URL');
    const redisStore = createKeyv(redisUrl);

    redisStore.store.on('connect', () => {
      logger.log('Successfully connected to Redis!');
    });

    redisStore.store.once('disconnect', () => {
      logger.warn('Disconnected from Redis!');
    });

    redisStore.store.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    redisStore.store.on('reconnecting', () => {
      logger.log('Reconnecting to Redis...');
    });

    await redisStore.has('__healthcheck__');

    return {
      stores: [
        new Keyv({
          store: new KeyvCacheableMemory({
            ttl: 60000,
            lruSize: 5000,
          }),
        }),
        redisStore,
      ],
    };
  },
};
