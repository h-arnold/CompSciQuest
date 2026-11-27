// Toolchain-local contracts (content-toolchain.md §2–§5). These describe the
// YAML authoring layer only; canonical runtime DTOs live under src/ and are
// imported from there rather than copied.
export interface CardFile {
  readonly path: string;
  readonly text: string;
}

export interface CardSet {
  readonly files: readonly CardFile[];
}

export interface Finding {
  readonly path: string;
  readonly entry: string;
  readonly message: string;
  readonly gate: string;
}

export interface ParseResult {
  readonly findings: readonly Finding[];
  readonly parsed: Readonly<Record<string, Record<string, unknown>>>;
}

export interface ParsedCard {
  readonly path: string;
  readonly data: Record<string, unknown>;
}

export interface ParsedCardSet {
  readonly cards: readonly ParsedCard[];
}

export interface ValidationOptions {
  readonly coverageTopicIds?: readonly string[];
  readonly coverageHeadings?: readonly string[];
  readonly uncheckedClauses?: readonly string[];
  // C7 authoring-time topic-overlap check. Off for direct validateCards()
  // callers; content:validate and generation enable it.
  readonly topicOverlap?: boolean;
}

export interface ValidateResult {
  readonly findings: readonly Finding[];
  readonly exitCode: number;
}

export interface ScaffoldOptions {
  readonly force?: boolean;
  readonly world?: {
    readonly id: string;
    readonly startAreaId: string;
  };
}

export interface ScaffoldResult {
  readonly written: readonly string[];
  readonly refused: readonly string[];
  readonly skipped: readonly string[];
}

export interface GeneratedFile {
  readonly path: string;
  readonly text: string;
}

export interface GenerationResult {
  readonly ok: boolean;
  readonly findings: readonly Finding[];
  readonly files: readonly GeneratedFile[];
}

// The injected IO seam keeps the CLI and the tests on the same code path.
export interface ContentIo {
  readFile(path: string): string | undefined;
  writeFile(path: string, text: string): void;
  listFiles(prefix: string): readonly string[];
  exists(path: string): boolean;
}
