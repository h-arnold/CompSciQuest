// ENG2-HELP-01: the help verb must emit the generated static command list
// rather than the fixed one-liner (application-and-ui.md §5.2). Only the
// returned effects are observed; the message effects never mutate state.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameState } from '../../src/core/GameState';
import { hasCommandToken, loadCommandTable } from '../fixtures/commandTable';
import { loadVerbTable, makeTurnContext } from '../fixtures/parser';

function stateSnapshot(state: GameState): string {
  return JSON.stringify({
    player: state.player,
    flags: state.flags,
    rooms: state.rooms,
  });
}

function messageTexts(effects: readonly Effect[]): readonly string[] {
  return effects
    .filter(
      (effect): effect is Extract<Effect, { kind: 'message' }> =>
        effect.kind === 'message',
    )
    .map((effect) => effect.text);
}

async function helpMessage(): Promise<string> {
  const table = await loadVerbTable();
  const command: Command = { kind: 'help' };
  const context = makeTurnContext();
  const before = stateSnapshot(context.state);
  const handler = table.getCommandHandler(command);
  expect(handler, 'help must have a handler').toBeTypeOf('function');
  if (!handler) {
    throw new Error('getCommandHandler must return a handler for help');
  }
  const effects = handler(command, context);
  expect(stateSnapshot(context.state), 'help must not change state').toBe(
    before,
  );
  const messages = messageTexts(effects);
  expect(messages.length, 'help must emit a message').toBeGreaterThan(0);
  return messages.join('\n');
}

describe('ENG2-HELP-01 help handler output', () => {
  it('ENG2-HELP-01: the help reply lists every command the fixed one-line reply omitted', async () => {
    const text = await helpMessage();

    for (const token of [
      'use',
      'talk',
      'ask',
      'tell',
      'give',
      'show',
      'bye',
      'answer',
      'hint',
      '?',
    ]) {
      expect(hasCommandToken(text, token), `${token} must appear in help`).toBe(
        true,
      );
    }
    for (const syntax of [
      'use <item> on <target>',
      'ask <npc> about <topic>',
      'answer N',
      'hint [target]',
    ]) {
      expect(text, `${syntax} must appear in help`).toContain(syntax);
    }
  });

  it('ENG2-HELP-01: the help reply emits the generated static helpText()', async () => {
    const { helpText } = await loadCommandTable();
    const generated = helpText();
    expect(generated.length).toBeGreaterThan(0);

    const text = await helpMessage();
    expect(
      text.includes(generated),
      'the help message must be the generated static list',
    ).toBe(true);
  });
});

// Follow-up (issue 9): the player-facing help reply must surface the two forms
// added by ENGINE_ISSUES.md Batch E1 ("ask syntax" and "Quiz answers"), because
// "Help" is one static list of every supported command and required syntax.
describe('issue 9 forms in the help reply', () => {
  it('ENG9-ASKINFER-01: the help reply lists ask about <topic> with NPC-inference wording', async () => {
    const text = await helpMessage();

    expect(text, 'the reply must list the inferred ask syntax').toContain(
      'ask about <topic>',
    );
    expect(
      text.toLowerCase(),
      'the reply must explain NPC inference',
    ).toContain('infer');
    expect(
      text.toLowerCase(),
      'the reply must say inference applies when exactly one NPC is present',
    ).toContain('exactly one');
  });

  it('ENG9-BAREANSWER-01: the help reply lists the bare quiz number forms 1, 2, …', async () => {
    const text = await helpMessage();

    expect(text, 'the reply must list bare quiz numbers').toContain('1, 2, …');
  });
});
