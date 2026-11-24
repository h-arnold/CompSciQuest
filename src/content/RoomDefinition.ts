// Canonical definition from application-and-ui.md §3.2.
import type { Effect } from '../core/effects/Effect';
import type { ExitDefinition } from './ExitDefinition';

export interface RoomDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly ExitDefinition[];
  readonly entryEffects: readonly Effect[];
  readonly score: number; // first-visit award, 0 when not scoreable
}
