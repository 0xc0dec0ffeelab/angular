//負責集中管理所有 HTTP API。

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface DatabaseResponse {
  status: string;
  database: string;
  serverTime: string;
}

export interface CounterResponse {
  key: string;
  value: number;
}

export interface BlobItem {
  pathname?: string;
  path?: string;
  size: number;
  uploadedAt?: string;
}

export interface BlobListResponse {
  blobs: BlobItem[];
  cursor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly http = inject(HttpClient);
  // api 相對路徑，而不是寫死 http://localhost:3000
  private readonly baseUrl = '/api';

  health() {
    return this.http.get<HealthResponse>(
      `${this.baseUrl}/health`,
    );
  }

  databaseHealth() {
    return this.http.get<DatabaseResponse>(
      `${this.baseUrl}/database/health`,
    );
  }

  getCounter() {
    return this.http.get<CounterResponse>(
      `${this.baseUrl}/redis/counter`,
    );
  }

  increment() {
    return this.http.post<CounterResponse>(
      `${this.baseUrl}/redis/increment`,
      {},
    );
  }

  listBlobs() {
    return this.http.get<BlobListResponse>(
      `${this.baseUrl}/blob`,
    );
  }

  uploadBlob(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.baseUrl}/blob/upload`,
      formData,
    );
  }
}