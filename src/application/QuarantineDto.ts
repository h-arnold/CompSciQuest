// Canonical quarantine shape from storage-schema.md §9.
import type { LoadFailureReason } from './SaveDto';

export interface QuarantineDto {
  readonly quarantinedAt: string; // ISO 8601, from Clock
  readonly reason: LoadFailureReason;
  readonly raw: string; // exact text read from storage
}
