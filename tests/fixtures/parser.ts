// Small deterministic parser fixtures. No authored game content is used: verbs
// and aliases are engine constants, while object aliases come from these
// in-memory catalogues (application-and-ui.md §5.2).
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { CommandHandler } from '../../src/core/commands/CommandHandler';
import type { NameResolver } from '../../src/core/commands/NameResolver';
import type { ParsedCommand } from '../../src/core/commands/ParsedCommand';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { TurnContext } from '../../src/core/TurnContext';
import {
  FakeRandom,
  catalogueOf,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
} from './persistence';
import { loadSeam } from './seams';

export const KEY_A = 'brass-key';
export const KEY_B = 'silver-key';
export const DOOR_ID = 'door-1';
export const CHEST_ID = 'chest-1';
export const START_ROOM = 'room-stub-start';

export interface TokenizerLike {
  tokenize(raw: string): readonly string[];
}

export interface ParserLike {
  parse(raw: string): ParsedCommand;
}

export interface VerbTableLike {
  getCommandHandler(command: Command): CommandHandler | undefined;
}

export function loadTokenizer(): Promise<TokenizerLike> {
  return loadSeam<TokenizerLike>(
    '../../src/core/commands/Tokenizer',
    'tokenize',
    'architecture.md §5 — lowercase, strip punctuation, then tokenise',
  );
}

export function loadParser(): Promise<ParserLike> {
  return loadSeam<ParserLike>(
    '../../src/core/commands/Parser',
    'parse',
    'architecture.md §5 — tokens to ParsedCommand without throwing',
  );
}

export function loadNameResolver(): Promise<() => NameResolver> {
  return loadSeam<() => NameResolver>(
    '../../src/core/commands/NameResolver',
    'createNameResolver',
    'application-and-ui.md §8 — phrase to visible object ID',
  );
}

export function loadVerbTable(): Promise<VerbTableLike> {
  return loadSeam<VerbTableLike>(
    '../../src/core/commands/verbs/index',
    'getCommandHandler',
    'architecture.md §4 — one handler per verb (Command pattern)',
  );
}

export function makeParserBundle(): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    items: catalogueOf([
      {
        id: KEY_A,
        name: 'Brass key',
        aliases: ['key', 'brass key'],
        portable: true,
        description: 'A small brass key.',
        initialRoom: START_ROOM,
      },
      {
        id: KEY_B,
        name: 'Silver key',
        aliases: ['key', 'silver key'],
        portable: true,
        description: 'A small silver key.',
        initialRoom: START_ROOM,
      },
      {
        id: DOOR_ID,
        name: 'Door',
        aliases: ['door'],
        portable: false,
        description: 'A closed door.',
        initialRoom: START_ROOM,
      },
      {
        id: CHEST_ID,
        name: 'Chest',
        aliases: ['chest'],
        portable: false,
        description: 'A wooden chest.',
        initialRoom: START_ROOM,
      },
    ]),
    actors: catalogueOf([
      { id: 'npc-1', aliases: ['guide'], initialStateId: 'idle' },
    ]),
  };
}

export function makeParserStateDto(
  overrides: Partial<GameStateDto> = {},
): GameStateDto {
  return makeStateDto({
    player: {
      position: {
        worldId: 'world-stub',
        areaId: 'area-stub',
        roomId: START_ROOM,
      },
      inventory: [KEY_A],
      lives: 3,
    },
    rooms: {
      [START_ROOM]: { inventory: [KEY_B, DOOR_ID, CHEST_ID] },
      'room-stub-north': { inventory: [] },
    },
    flags: {},
    ...overrides,
  });
}

export function makeParserState(
  overrides: Partial<GameStateDto> = {},
): GameState {
  return makeRuntimeState(makeParserStateDto(overrides));
}

// Deterministic, unambiguous aliases for the façade-level `put <noun> in
// <target>` case. The default parser bundle deliberately makes "key" ambiguous
// so it cannot be used to observe which Command the façade resolved.
export interface PutFixture {
  readonly bundle: ContentBundle;
  readonly state: GameState;
}

export function makePutFixture(): PutFixture {
  const bundle: ContentBundle = {
    ...makeParserBundle(),
    items: catalogueOf([
      {
        id: KEY_A,
        name: 'Brass key',
        aliases: ['brass key'],
        portable: true,
        description: 'A small brass key.',
        initialRoom: START_ROOM,
      },
      {
        id: CHEST_ID,
        name: 'Chest',
        aliases: ['chest'],
        portable: false,
        description: 'A wooden chest.',
        initialRoom: START_ROOM,
      },
    ]),
  };
  const state = makeRuntimeState(
    makeParserStateDto({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: [KEY_A],
        lives: 3,
      },
      rooms: { [START_ROOM]: { inventory: [CHEST_ID] } },
    }),
  );
  return { bundle, state };
}

export function makeTurnContext(
  overrides: Partial<TurnContext> = {},
): TurnContext {
  return {
    turn: 1,
    state: makeParserState(),
    bundle: makeParserBundle(),
    random: new FakeRandom(),
    ...overrides,
  };
}
