// Deterministic loader for the canonical command-table seam (ENG2-HELP-01).
// It follows the loadSeam contract: a missing module or export names itself
// rather than surfacing as an opaque import error.
import { expect } from 'vitest';

const SPECIFIER = '../../src/core/commands/CommandTable';
const REASON =
  'application-and-ui.md §5.2 — one canonical table must drive help text and parser aliases';

// spec §6.3 — the four command groups assigned to COMMAND_TABLE verbs.
// "Reading the room" is a legend section and "Saves" is a help section fed by
// the separate SAVE_ACTIONS constant; neither is a group on a table entry.
export const HELP_GROUPS = [
  'Movement',
  'Looking and handling',
  'People',
  'Progress',
] as const;

export type HelpGroup = (typeof HELP_GROUPS)[number];

export interface CommandSpec {
  readonly verb: string;
  readonly syntax: string;
  readonly aliases: readonly string[];
  readonly group?: HelpGroup;
}

export interface DirectionSpec {
  readonly name: string;
  readonly shortcut: string;
}

export interface CommandTableModule {
  readonly COMMAND_TABLE: readonly CommandSpec[];
  readonly DIRECTIONS: readonly DirectionSpec[];
  readonly helpText: () => string;
}

export async function loadCommandTable(): Promise<CommandTableModule> {
  let imported: CommandTableModule;
  try {
    imported = await import(/* @vite-ignore */ SPECIFIER);
  } catch (error) {
    throw new Error(`Missing module ${SPECIFIER} — ${REASON}`, {
      cause: error,
    });
  }
  for (const name of ['COMMAND_TABLE', 'DIRECTIONS', 'helpText'] as const) {
    expect(
      imported[name],
      `${name} must be exported from ${SPECIFIER} (${REASON})`,
    ).toBeDefined();
  }
  return imported;
}

// Matches a whole alias, so short forms such as `n` and `i` cannot be satisfied
// by an unrelated letter inside another word.
export function hasCommandToken(text: string, token: string): boolean {
  if (token === '?') {
    return text.includes('?');
  }
  const escaped = token.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  return new RegExp(`(^|[^a-z0-9-])${escaped}([^a-z0-9-]|$)`, 'i').test(text);
}
