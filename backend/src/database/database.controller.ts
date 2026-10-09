import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('api/database')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('health')
  async health() {
    const rows = await this.databaseService.query<{
      current_time: Date;
    }>('SELECT NOW() AS current_time');

    return {
      status: 'ok',
      database: 'postgresql',
      serverTime: rows[0].current_time,
    };
  }
}