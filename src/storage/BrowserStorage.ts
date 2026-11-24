// localStorage implementation of the injected port (storage-schema.md §10).
// No storage access happens at import time, so unit tests never touch it.
import type { StorageAdapter } from './StorageAdapter';

// Resolved lazily so importing this module in Node never touches localStorage.
function store(): Storage {
  return localStorage;
}

export class BrowserStorage implements StorageAdapter {
  read(key: string): string | null {
    return store().getItem(key);
  }

  write(key: string, json: string): void {
    store().setItem(key, json);
  }

  remove(key: string): void {
    store().removeItem(key);
  }
}
