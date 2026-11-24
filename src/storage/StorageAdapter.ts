// Interface-only port from storage-schema.md §10. BrowserStorage implements it.
export interface StorageAdapter {
  read(key: string): string | null;
  write(key: string, json: string): void;
  remove(key: string): void;
}
