// Single canonical command union from application-and-ui.md §5.
import type { Direction } from '../../types/domain';

export type Command =
  | { readonly kind: 'go'; readonly direction: Direction }
  | { readonly kind: 'take'; readonly itemId: string }
  | { readonly kind: 'drop'; readonly itemId: string }
  | {
      readonly kind: 'use';
      readonly itemId: string;
      readonly targetId?: string;
    }
  | { readonly kind: 'examine'; readonly targetId: string }
  | { readonly kind: 'open'; readonly targetId: string }
  | { readonly kind: 'close'; readonly targetId: string }
  | {
      readonly kind: 'unlock';
      readonly itemId: string;
      readonly targetId: string;
    }
  | { readonly kind: 'put'; readonly itemId: string; readonly targetId: string }
  | { readonly kind: 'look' }
  | { readonly kind: 'inventory' }
  | { readonly kind: 'score' }
  | { readonly kind: 'help' }
  | { readonly kind: 'unknown'; readonly raw: string }
  | { readonly kind: 'talk-to'; readonly actorId: string }
  | { readonly kind: 'ask'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'tell'; readonly actorId: string; readonly topic: string }
  | { readonly kind: 'give'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'show'; readonly actorId: string; readonly itemId: string }
  | { readonly kind: 'unseen-actor'; readonly actorId: string }
  | { readonly kind: 'bye' }
  | { readonly kind: 'answer'; readonly option: number }
  | { readonly kind: 'hint'; readonly targetId?: string };
