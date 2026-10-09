import { Module } from '@nestjs/common';
import { BlobController } from './blob.controller';
import { BlobService } from './blob.service';

@Module({
  controllers: [BlobController],
  providers: [BlobService],
  exports: [BlobService],
})
export class BlobModule {}