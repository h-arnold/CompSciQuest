// Canonical precondition subset from application-and-ui.md §8.
import type { Condition } from './Condition';

export type Precondition = Condition & {
  readonly kind:
    | 'flag-set'
    | 'has-item'
    | 'visited-room'
    | 'puzzle-solved'
    | 'counter-at-least';
};
