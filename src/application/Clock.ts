// Injected time source from application-and-ui.md §8; savedAt is ISO 8601.
export interface Clock {
  now(): string;
}
