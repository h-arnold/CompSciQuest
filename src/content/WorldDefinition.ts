// Canonical definition from application-and-ui.md §3.2.
export interface WorldDefinition {
  readonly id: string;
  readonly name: string;
  readonly areaIds: readonly string[];
  readonly startAreaId: string;
  readonly lives: number; // 3 in the stub and in all v1 content
}
