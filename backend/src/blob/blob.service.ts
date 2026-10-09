import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Bucket } from '@upstash/blob';
import { randomUUID } from 'node:crypto';


@Injectable()
export class BlobService {
  private readonly bucket: Bucket;
  private readonly prefix = 'demo/';

  constructor(private readonly config: ConfigService) {
    // 確保啟動時就能發現缺少 Token
    this.config.getOrThrow<string>('UPSTASH_BLOB_TOKEN');

    this.bucket = Bucket.fromEnv();
  }

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // 限制檔名，避免使用者直接控制儲存路徑
    const filename = file.originalname
      .replace(/\\/g, '/')
      .split('/')
      .pop()!
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 100);

    const path = `${this.prefix}${randomUUID()}-${filename}`;

    const blob = await this.bucket.put(path, file.buffer, {
      contentType: file.mimetype,
    });

    return {
      path: blob.path,
      url: blob.url ?? null,
      size: file.size,
      contentType: file.mimetype,
    };
  }

  async list() {
    return await this.bucket.list({
      prefix: this.prefix,
      limit: 100,
    });
  }

  async download(path: string) {
    this.validatePath(path);

    return await this.bucket.signedReadUrl(path, {
      expiresIn: '5m',
    });
  }

  async delete(path: string) {
    this.validatePath(path);

    await this.bucket.del(path);

    return {
      deleted: true,
      path,
    };
  }

  private validatePath(path: string) {
    if (
      !path.startsWith(this.prefix) ||
      path.includes('..') ||
      path.includes('\\')
    ) {
      throw new BadRequestException('Invalid blob path');
    }
  }
}