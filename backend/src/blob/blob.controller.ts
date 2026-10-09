import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { BlobService } from './blob.service';


@Controller('api/blob')
export class BlobController {
  constructor(
    private readonly blobService: BlobService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.blobService.upload(file);
  }

  @Get()
  async list() {
    return this.blobService.list();
  }

  @Get('download')
  async download(@Query('path') path: string) {
    return this.blobService.download(path);
  }

  @Delete()
  async delete(@Query('path') path: string) {
    return this.blobService.delete(path);
  }
}