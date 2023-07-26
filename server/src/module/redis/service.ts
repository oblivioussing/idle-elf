import Redis from 'ioredis'
import config from '@/config'

export class RedisService {
  constructor() {
    this.redis = new Redis(config.redisUrl)
  }
  redis: Redis

  async set(key: string, value: any, ttl?: number) {
    await this.redis.set(key, value)
    if (ttl) {
      await this.expire(key, ttl)
    }
  }
  async get(key: string) {
    return await this.redis.get(key)
  }
  async expire(key: string, ttl: number) {
    await this.redis.expire(key, ttl)
  }
}
