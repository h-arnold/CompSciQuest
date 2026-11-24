// Canonical intermediate shape from architecture.md §7.
export interface ParsedCommand {
  readonly verb: string; // canonical verb, e.g. 'take'
  readonly nounPhrases: readonly string[]; // raw words, e.g. ['brass key']
  readonly raw: string; // original input for friendly errors
}
