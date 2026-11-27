// DESIGN-OWNED GAP: this type is referenced by the ContentBundle contract but
// was not defined alongside it; a canonical definition is expected later.
// Only runtime fields belong here; authoring-only fields (role, voice,
// motivation, relationship) stay in the card source.
export interface ActorDefinition {
  readonly id: string;
  readonly aliases: readonly string[];
  readonly initialStateId: string;
}
