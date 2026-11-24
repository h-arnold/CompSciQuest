// DESIGN-OWNED GAP: referenced by application-and-ui.md §3.1 (ContentBundle)
// but not defined there; the design docs own a later canonical definition.
// The runtime fields of the NPC card are canonical in content-rules.md §4.3;
// authoring-only fields (role, voice, motivation, relationship) stay in cards.
export interface ActorDefinition {
  readonly id: string;
  readonly aliases: readonly string[];
  readonly initialStateId: string;
}
