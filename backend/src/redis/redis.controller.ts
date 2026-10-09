import {
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { RedisService } from './redis.service';

@Controller('api/redis')
export class RedisController {
  constructor(
    private readonly redisService: RedisService,
  ) {}

  @Get('health')
  async health() {
    const result = await this.redisService.ping();

    return {
      status: result === 'PONG' ? 'ok' : 'error',
      redis: result,
    };
  }

  @Post('increment')
  async increment() {
    const value = await this.redisService.increment();

    return {
      key: 'angular:demo:counter',
      value,
    };
  }

  @Get('counter')
  async getCounter() {
    const value = await this.redisService.getCounter();

    return {
      key: 'angular:demo:counter',
      value,
    };
  }
}