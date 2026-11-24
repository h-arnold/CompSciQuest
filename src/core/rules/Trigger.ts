// Canonical trigger union from shared-rules.md §4.
export type Trigger =
  | { readonly kind: 'on-room-enter'; readonly roomId: string }
  | { readonly kind: 'on-turn' }
  | { readonly kind: 'on-verb'; readonly verb: string }
  | { readonly kind: 'on-item-used'; readonly itemId: string }
  | { readonly kind: 'on-event'; readonly eventType: string }
  | { readonly kind: 'on-schedule'; readonly eventId: string };
