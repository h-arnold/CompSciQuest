// Canonical definition from application-and-ui.md §3.2.
export interface ItemDefinition {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly portable: boolean;
  readonly description: string;
  readonly initialRoom: string; // starting owner; ownership lives in state
}
