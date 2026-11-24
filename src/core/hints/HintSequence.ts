// Canonical declarative definitions from hints.md §2.
import type { Condition } from '../rules/Condition';

export interface HintLevel {
  readonly level: number; // 1-based
  readonly text: string;
  readonly unlock: Condition;
  readonly scorePenalty?: number; // omitted = 0
}

export interface HintSequence {
  readonly id: string;
  readonly targets: readonly string[]; // puzzle / quiz / topic ids
  readonly levels: readonly HintLevel[];
  readonly autoOfferAfter?: number; // failed attempts or stuck turns
  readonly cooldownTurns?: number; // minimum turns between requests
}
