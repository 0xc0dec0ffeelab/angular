import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { BlobModule } from './blob/blob.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 代表其他 Module 可以直接注入 ConfigService，不必在每個 Module 重複匯入 ConfigModule
    }),
    DatabaseModule,
    RedisModule,
    BlobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
