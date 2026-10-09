import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  private readonly counterKey = 'angular:demo:counter';

  constructor(private readonly config: ConfigService) {
    this.client = new Redis({
      url: this.config.getOrThrow<string>(
        'UPSTASH_REDIS_REST_URL',
      ),
      token: this.config.getOrThrow<string>(
        'UPSTASH_REDIS_REST_TOKEN',
      ),
    });
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async increment(): Promise<number> {
    return this.client.incr(this.counterKey);
  }

  async getCounter(): Promise<number> {
    const value = await this.client.get<number>(
      this.counterKey,
    );

    return value ?? 0;
  }
}