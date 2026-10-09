import { Component, signal, inject                           } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';

import {
  BackendService,
  HealthResponse,
  DatabaseResponse,
  BlobItem,
} from './services/backend';


@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private readonly backend = inject(BackendService);

  readonly health = signal<HealthResponse | null>(null);
  readonly database = signal<DatabaseResponse | null>(null);
  readonly counter = signal<number | null>(null);
  readonly blobs = signal<BlobItem[]>([]);
  readonly uploadResult = signal<unknown>(null);
  readonly error = signal<string | null>(null);

  checkHealth() {
    this.error.set(null);

    this.backend.health().subscribe({
      next: (result) => this.health.set(result),
      error: () => this.error.set('Backend connection failed'),
    });
  }

  checkDatabase() {
    this.error.set(null);

    this.backend.databaseHealth().subscribe({
      next: (result) => this.database.set(result),
      error: () => this.error.set('PostgreSQL connection failed'),
    });
  }

  getCounter() {
    this.error.set(null);

    this.backend.getCounter().subscribe({
      next: (result) => this.counter.set(result.value),
      error: () => this.error.set('Redis request failed'),
    });
  }

  increment() {
    this.error.set(null);

    this.backend.increment().subscribe({
      next: (result) => this.counter.set(result.value),
      error: () => this.error.set('Redis increment failed'),
    });
  }

  loadBlobs() {
    this.error.set(null);

    this.backend.listBlobs().subscribe({
      next: (result) => this.blobs.set(result.blobs),
      error: () => this.error.set('Blob list failed'),
    });
  }

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.error.set(null);

    this.backend.uploadBlob(file).subscribe({
      next: (result) => {
        this.uploadResult.set(result);
        input.value = '';
        this.loadBlobs();
      },
      error: () => this.error.set('File upload failed'),
    });
  }
}
