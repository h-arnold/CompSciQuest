import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { RoomDefinition } from '../../src/content/RoomDefinition';
import { loadValidator, makeRoom, withRooms } from '../fixtures/content';
import {
  cardText,
  conformingCardSet,
  loadValidation,
  ROOMS_PATH,
  withCard,
  type ValidateResult,
} from '../fixtures/contentToolchain';
import { makeBundle } from '../fixtures/persistence';

const ROOM_ANCHOR = '    exits: []\n    score: 0';
const VALID_SCENERY = [
  {
    name: 'inspection panel',
    aliases: ['inspection panel', 'panel'],
    description: 'A bespoke inspection panel.',
  },
] as const;
const VALID_INTERACTIONS = [
  {
    kind: 'use',
    itemId: 'lamp',
    target: { kind: 'scenery', name: 'inspection panel' },
    flags: ['panel-used'],
    text: 'The bespoke lamp lights the panel.',
  },
  {
    kind: 'examine',
    target: { kind: 'scenery', name: 'inspection panel' },
    flags: ['panel-examined'],
    text: 'The bespoke panel reveals its markings.',
  },
] as const;
const VALID_ROOM_CONTENT = `    scenery:
      - name: inspection panel
        aliases: [inspection panel, panel]
        description: A bespoke inspection panel.
    interactions:
      - kind: use
        itemId: item-register-cache
        target: { kind: scenery, name: inspection panel }
        flags: [panel-used]
        text: The bespoke lamp lights the panel.
      - kind: examine
        target: { kind: scenery, name: inspection panel }
        flags: [panel-examined]
        text: The bespoke panel reveals its markings.`;

const EXAMINE_CASES = [
  {
    label: 'numeric itemId: 42',
    actingItem: 'itemId: 42',
    interaction: { itemId: 42 },
  },
  {
    label: 'boolean itemId: true',
    actingItem: 'itemId: true',
    interaction: { itemId: true },
  },
  {
    label: 'array itemId',
    actingItem: 'itemId: [item-register-cache]',
    interaction: { itemId: ['item-register-cache'] },
  },
  {
    label: 'object itemId',
    actingItem: 'itemId: { id: item-register-cache }',
    interaction: { itemId: { id: 'item-register-cache' } },
  },
  {
    label: 'null itemId',
    actingItem: 'itemId: null',
    interaction: { itemId: null },
  },
  {
    label: 'empty-string itemId',
    actingItem: 'itemId: ""',
    interaction: { itemId: '' },
  },
  {
    label: 'whitespace-only itemId',
    actingItem: 'itemId: "   "',
    interaction: { itemId: '   ' },
  },
  {
    label: 'a valid string itemId on EXAMINE',
    actingItem: 'itemId: item-register-cache',
    interaction: { itemId: 'item-register-cache' },
  },
  {
    label: 'a scenery item on EXAMINE',
    actingItem: 'item: { kind: scenery, name: inspection panel }',
    interaction: { item: { kind: 'scenery', name: 'inspection panel' } },
  },
] as const;

function examineRoomBlock(actingItem: string): string {
  return `    scenery:
      - name: inspection panel
        aliases: [inspection panel, panel]
        description: A bespoke inspection panel.
    interactions:
      - kind: examine
        ${actingItem}
        target: { kind: scenery, name: inspection panel }
        flags: [panel-examined]
        text: The bespoke panel reveals its markings.`;
}

function cardsWithRoomBlock(block: string) {
  const original = cardText(conformingCardSet(), ROOMS_PATH);
  if (!original.includes(ROOM_ANCHOR)) {
    throw new Error('The deterministic rooms fixture anchor is missing.');
  }
  return withCard(
    conformingCardSet(),
    ROOMS_PATH,
    original.replace(
      ROOM_ANCHOR,
      () => `    exits: []\n${block}\n    score: 0`,
    ),
  );
}

function expectUsefulAuthoringFindings(
  result: ValidateResult,
  pattern: RegExp,
): void {
  expect(result.exitCode).not.toBe(0);
  const findings = result.findings.filter(
    (finding) => finding.path === ROOMS_PATH && finding.gate === 'shape',
  );
  expect(findings.length).toBeGreaterThan(0);
  expect(findings.map((finding) => finding.message).join('\n')).toMatch(
    pattern,
  );
}

function runtimeBundle(
  scenery: unknown,
  interactions: unknown = [],
): ContentBundle {
  const base = makeBundle();
  const room = {
    ...makeRoom(),
    scenery,
    interactions,
  } as unknown as RoomDefinition;
  return withRooms(
    base,
    base.rooms.all.map((entry) => (entry.id === room.id ? room : entry)),
  );
}

const AUTHORING_CASES = [
  {
    label: 'scenery: [42]',
    block: '    scenery:\n      - 42',
    pattern: /scenery.*object|object.*scenery/iu,
  },
  {
    label: 'a non-array scenery value',
    block: '    scenery: inspection panel',
    pattern: /scenery.*array/iu,
  },
  {
    label: 'a non-object scenery entry',
    block: '    scenery:\n      - inspection panel',
    pattern: /scenery.*object|object.*scenery/iu,
  },
  {
    label: 'a scenery entry without a name',
    block:
      '    scenery:\n      - aliases: [panel]\n        description: A panel.',
    pattern: /scenery.*name|name.*scenery/iu,
  },
  {
    label: 'a non-string scenery name',
    block:
      '    scenery:\n      - name: 42\n        aliases: [panel]\n        description: A panel.',
    pattern: /scenery.*name|name.*scenery/iu,
  },
  {
    label: 'a scenery entry without a description',
    block: '    scenery:\n      - name: panel\n        aliases: [panel]',
    pattern: /scenery.*description|description.*scenery/iu,
  },
  {
    label: 'a non-string scenery description',
    block:
      '    scenery:\n      - name: panel\n        aliases: [panel]\n        description: 42',
    pattern: /scenery.*description|description.*scenery/iu,
  },
  {
    label: 'aliases: [42]',
    block:
      '    scenery:\n      - name: panel\n        aliases: [42]\n        description: A panel.',
    pattern: /alias.*string|string.*alias/iu,
  },
  {
    label: 'a non-array scenery alias value',
    block:
      '    scenery:\n      - name: panel\n        aliases: panel\n        description: A panel.',
    pattern: /alias.*array/iu,
  },
  {
    label: 'blank scenery alias strings',
    block: `    scenery:\n      - name: panel\n        aliases: ["${' '.repeat(3)}"]\n        description: A panel.`,
    pattern: /alias.*(?:empty|blank)|(?:empty|blank).*alias/iu,
  },
] as const;

const RUNTIME_CASES = [
  {
    label: 'scenery: [42]',
    scenery: [42],
    pattern: /scenery.*object|object.*scenery/iu,
  },
  {
    label: 'a non-array scenery value instead of an empty list',
    scenery: { name: 'inspection panel' },
    pattern: /scenery.*array/iu,
  },
  {
    label: 'a non-object scenery entry',
    scenery: ['inspection panel'],
    pattern: /scenery.*object|object.*scenery/iu,
  },
  {
    label: 'a scenery entry without a name',
    scenery: [{ aliases: ['panel'], description: 'A panel.' }],
    pattern: /scenery.*name|name.*scenery/iu,
  },
  {
    label: 'a non-string scenery name',
    scenery: [{ name: 42, aliases: ['panel'], description: 'A panel.' }],
    pattern: /scenery.*name|name.*scenery/iu,
  },
  {
    label: 'a scenery entry without a description',
    scenery: [{ name: 'panel', aliases: ['panel'] }],
    pattern: /scenery.*description|description.*scenery/iu,
  },
  {
    label: 'a non-string scenery description',
    scenery: [{ name: 'panel', aliases: ['panel'], description: 42 }],
    pattern: /scenery.*description|description.*scenery/iu,
  },
  {
    label: 'aliases: [42]',
    scenery: [{ name: 'panel', aliases: [42], description: 'A panel.' }],
    pattern: /alias.*string|string.*alias|alias.*empty/iu,
  },
  {
    label: 'a non-array scenery alias value',
    scenery: [{ name: 'panel', aliases: 'panel', description: 'A panel.' }],
    pattern: /alias.*array/iu,
  },
  {
    label: 'blank scenery alias strings',
    scenery: [
      { name: 'panel', aliases: [' '.repeat(3)], description: 'A panel.' },
    ],
    pattern: /alias.*(?:empty|blank)|(?:empty|blank).*alias/iu,
  },
] as const;

describe('W7R-CONTENT-01 authoring scenery validation', () => {
  it.each(AUTHORING_CASES)(
    'W7R-CONTENT-01: authoring validation rejects $label',
    async ({ block, pattern }) => {
      const { validateCommand } = await loadValidation();
      const cards = cardsWithRoomBlock(block);
      const before = JSON.stringify(cards);

      const result = validateCommand(cards);

      expectUsefulAuthoringFindings(result, pattern);
      expect(JSON.stringify(cards)).toBe(before);
    },
  );

  it('W7R-CONTENT-01: valid custom scenery and interactions pass authoring validation', async () => {
    const { validateCommand } = await loadValidation();
    const cards = cardsWithRoomBlock(VALID_ROOM_CONTENT);
    const before = JSON.stringify(cards);

    const result = validateCommand(cards);

    expect(result.exitCode).toBe(0);
    expect(result.findings).toEqual([]);
    expect(JSON.stringify(cards)).toBe(before);
  });
});

describe('W7R-CONTENT-01 authoring EXAMINE interaction validation', () => {
  it.each(EXAMINE_CASES)(
    'W7R-CONTENT-01: authoring validation rejects $label',
    async ({ actingItem }) => {
      const { validateCommand } = await loadValidation();
      const cards = cardsWithRoomBlock(examineRoomBlock(actingItem));
      const before = JSON.stringify(cards);

      const result = validateCommand(cards);

      expectUsefulAuthoringFindings(
        result,
        /EXAMINE interaction must omit its acting item/iu,
      );
      expect(JSON.stringify(cards)).toBe(before);
    },
  );
});

describe('W7R-CONTENT-01 runtime scenery validation', () => {
  it.each(RUNTIME_CASES)(
    'W7R-CONTENT-01: runtime validation rejects $label',
    async ({ scenery, pattern }) => {
      const validate = await loadValidator();
      const bundle = runtimeBundle(scenery);
      const before = JSON.stringify(bundle);

      const problems = validate(bundle);

      expect(problems.length).toBeGreaterThan(0);
      expect(problems.join('\n')).toMatch(pattern);
      expect(JSON.stringify(bundle)).toBe(before);
    },
  );

  it.each(EXAMINE_CASES)(
    'W7R-CONTENT-01: runtime validation rejects $label',
    async ({ interaction: actingItem }) => {
      const validate = await loadValidator();
      const bundle = runtimeBundle(VALID_SCENERY, [
        {
          kind: 'examine',
          target: { kind: 'scenery', name: 'inspection panel' },
          flags: ['panel-examined'],
          text: 'The bespoke panel reveals its markings.',
          ...actingItem,
        },
      ]);
      const before = JSON.stringify(bundle);

      const problems = validate(bundle);

      expect(problems.length).toBeGreaterThan(0);
      expect(problems.join('\n')).toMatch(
        /EXAMINE interaction must omit its item/iu,
      );
      expect(JSON.stringify(bundle)).toBe(before);
    },
  );

  it('W7R-CONTENT-01: runtime validation rejects a present non-array interactions value', async () => {
    const validate = await loadValidator();
    const bundle = runtimeBundle(VALID_SCENERY, { kind: 'examine' });
    const before = JSON.stringify(bundle);

    const problems = validate(bundle);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join('\n')).toMatch(/interactions.*array/iu);
    expect(JSON.stringify(bundle)).toBe(before);
  });

  it('W7R-CONTENT-01: valid custom scenery and interactions pass runtime validation', async () => {
    const validate = await loadValidator();
    const bundle = runtimeBundle(VALID_SCENERY, VALID_INTERACTIONS);
    const before = JSON.stringify(bundle);

    const problems = validate(bundle);

    expect(problems).toEqual([]);
    expect(JSON.stringify(bundle)).toBe(before);
  });
});
