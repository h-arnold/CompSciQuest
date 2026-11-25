// Canonical definition from application-and-ui.md §3.2.
export interface ItemDefinition {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly portable: boolean;
  readonly description: string;
  readonly initialRoom: string; // starting owner; ownership lives in state
  // §5.2: authored in-voice reply when a non-portable item is taken; omit when
  // absent so the handler uses the canonical fallback (user decision, 2026-11-25).
  readonly refusalText?: string;
}
