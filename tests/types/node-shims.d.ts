// Minimal ambient declarations for the Node built-ins used by the Playwright
// specs. The TypeScript program restricts `types` to `vite/client`, so the
// Node globals are absent; declare only the two members the specs call.

declare module 'node:fs/promises' {
  export function readFile(path: string, encoding: 'utf8'): Promise<string>;
}

declare class Buffer extends Uint8Array {
  static from(text: string): Buffer;
}
