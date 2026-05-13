import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from '../config/envs';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly redis: Redis | null;

  constructor() {
    if (!envs.REDIS_ENABLED) {
      this.redis = null;
      return;
    }

    this.redis = new Redis(this.getRedisUrl(), {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.redis.on('error', (error) => {
      this.logger.warn(`Redis cache unavailable: ${error.message}`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.warn(`Could not read cache key ${key}: ${this.getErrorMessage(error)}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = envs.REDIS_TTL_SECONDS): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Could not write cache key ${key}: ${this.getErrorMessage(error)}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.warn(`Could not delete cache key ${key}: ${this.getErrorMessage(error)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private getRedisUrl(): string {
    if (envs.REDIS_URL !== 'redis://localhost:6379') {
      return envs.REDIS_URL;
    }

    return `redis://${envs.REDIS_HOST}:${envs.REDIS_PORT}`;
  }
}
