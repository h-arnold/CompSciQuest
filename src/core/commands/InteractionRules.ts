// Trace-pinned authored interactions from walkthrough.md §2. The generator
// intentionally drops authoring.useNotes, so the runtime keeps this small,
// declarative action table separate from content definitions and prose.
import type { Effect } from '../effects/Effect';
import type { GameState } from '../GameState';
import type { TurnContext } from '../TurnContext';

interface SceneryDefinition {
  readonly id: string;
  readonly roomId: string;
  readonly aliases: readonly string[];
  readonly description: string;
}

interface FlagInteraction {
  readonly itemId: string;
  readonly targetId?: string;
  readonly roomId: string;
  readonly flags: readonly string[];
  readonly text: string;
}

const SCENERY: readonly SceneryDefinition[] = [
  {
    id: 'scenery-belt',
    roomId: 'room-switch-floor',
    aliases: ['belt', 'switch belt'],
    description: 'The belt clicks as its tiny switches settle into place.',
  },
  {
    id: 'scenery-carry-lamp',
    roomId: 'room-hex-deck',
    aliases: ['carry lamp', 'lamp'],
    description: 'A carry lamp hangs above a scratched overflow tray.',
  },
  {
    id: 'scenery-carry-token',
    roomId: 'room-hex-deck',
    aliases: ['carry token', 'token'],
    description: 'A bright carry token waits beside the addition columns.',
  },
  {
    id: 'scenery-nibble-groups',
    roomId: 'room-hex-deck',
    aliases: ['nibble groups', 'nibbles', 'groups'],
    description: 'The card groups its marks into nibbles of four.',
  },
  {
    id: 'scenery-rightmost-column',
    roomId: 'room-hex-deck',
    aliases: ['rightmost column', 'column'],
    description: 'The rightmost column is marked for the first carry.',
  },
  {
    id: 'scenery-shift-lever',
    roomId: 'room-hex-deck',
    aliases: ['shift lever', 'lever'],
    description: 'The shift lever has notches for moving the marked row.',
  },
  {
    id: 'scenery-row',
    roomId: 'room-hex-deck',
    aliases: ['row', 'marked row'],
    description: 'A row of bits waits beside the shift gutter.',
  },
  {
    id: 'scenery-tiles',
    roomId: 'room-character-tiles',
    aliases: ['tiles', 'character tiles', 'character case'],
    description: 'The character case holds ordered rows of marked tiles.',
  },
  {
    id: 'scenery-mosaic',
    roomId: 'room-picture-mosaic',
    aliases: ['mosaic', 'picture mosaic'],
    description: 'A square mosaic waits for its missing coloured squares.',
  },
  {
    id: 'scenery-bit-rate-desk',
    roomId: 'room-sound-choir',
    aliases: ['bit rate desk', 'bit-rate desk', 'desk'],
    description: 'The desk carries sampling dials and a blank bit-rate dial.',
  },
  {
    id: 'scenery-unit-ladder',
    roomId: 'room-storage-stacks',
    aliases: ['unit ladder', 'ladder'],
    description: 'The unit ladder climbs from bit to byte and beyond.',
  },
  {
    id: 'scenery-real-bin',
    roomId: 'room-binary-hall',
    aliases: ['real bin', 'bin'],
    description: 'The real bin is labelled for a number with a decimal point.',
  },
];

const USE_INTERACTIONS: readonly FlagInteraction[] = [
  {
    itemId: 'item-switch-gauge',
    targetId: 'scenery-belt',
    roomId: 'room-switch-floor',
    flags: ['switch-cooled', 'switches-set'],
    text: 'The gauge cools the belt and clicks every switch into place.',
  },
  {
    itemId: 'item-hex-nibble-card',
    targetId: 'scenery-carry-lamp',
    roomId: 'room-hex-deck',
    flags: ['carry-cleared'],
    text: 'The card fits the lamp socket and clears its carry warning.',
  },
  {
    itemId: 'item-hex-nibble-card',
    targetId: 'scenery-nibble-groups',
    roomId: 'room-hex-deck',
    flags: ['hex-read'],
    text: 'You read the card in nibbles and mark the groups on the deck.',
  },
  {
    itemId: 'scenery-carry-token',
    targetId: 'scenery-rightmost-column',
    roomId: 'room-hex-deck',
    flags: ['carries-added'],
    text: 'You place the carry token in the rightmost column.',
  },
  {
    itemId: 'scenery-shift-lever',
    targetId: 'scenery-row',
    roomId: 'room-hex-deck',
    flags: ['row-shifted'],
    text: 'You move the lever and shift the marked row.',
  },
  {
    itemId: 'item-ascii-stamp',
    targetId: 'scenery-tiles',
    roomId: 'room-character-tiles',
    flags: ['characters-matched'],
    text: 'The stamp matches each character to its place in the case.',
  },
  {
    itemId: 'item-pixel-lens',
    targetId: 'scenery-mosaic',
    roomId: 'room-picture-mosaic',
    flags: ['picture-built'],
    text: 'Through the lens, the numbered squares form a complete picture.',
  },
  {
    itemId: 'item-pixel-lens',
    targetId: 'item-hex-nibble-card',
    roomId: 'room-picture-mosaic',
    flags: ['pixels-weighed'],
    text: 'You compare the pixel grid with the values on the nibble card.',
  },
  {
    itemId: 'item-sample-fork',
    targetId: 'scenery-bit-rate-desk',
    roomId: 'room-sound-choir',
    flags: ['sound-sampled'],
    text: 'The fork sounds a clear sample and the desk records it.',
  },
  {
    itemId: 'item-sample-fork',
    targetId: 'scenery-unit-ladder',
    roomId: 'room-storage-stacks',
    flags: ['stacks-sorted'],
    text: 'The fork marks each unit as you order the stacks on the ladder.',
  },
  {
    itemId: 'item-compression-die',
    roomId: 'room-compression-press',
    flags: ['archive-packed'],
    text: 'You set the die and pack the archive into its smaller column.',
  },
  {
    itemId: 'item-compression-die',
    targetId: 'item-ascii-stamp',
    roomId: 'room-compression-press',
    flags: ['compression-chosen'],
    text: 'You compare the stamped characters and choose the compression setting.',
  },
];

const PUT_INTERACTIONS: readonly FlagInteraction[] = [
  {
    itemId: 'item-decimal-sample',
    targetId: 'scenery-real-bin',
    roomId: 'room-binary-hall',
    flags: ['types-sorted'],
    text: 'You place the decimal sample in the real bin.',
  },
];

function normalise(phrase: string): string {
  return phrase.trim().toLowerCase().replaceAll(/\s+/gu, ' ');
}

function hasMatchingName(names: readonly string[], phrase: string): boolean {
  const normalised = normalise(phrase);
  return names.some((name) => {
    const candidate = normalise(name);
    return (
      candidate === normalised || candidate.split(' ').at(-1) === normalised
    );
  });
}

function sceneryInRoom(roomId: string): readonly SceneryDefinition[] {
  return SCENERY.filter((entry) => entry.roomId === roomId);
}

export function resolveScenery(
  phrase: string,
  state: GameState,
): string | undefined {
  const matches = sceneryInRoom(state.player.position.roomId).filter((entry) =>
    hasMatchingName(entry.aliases, phrase),
  );
  return matches.length === 1 ? matches[0]?.id : undefined;
}

export function isSceneryVisible(
  context: TurnContext,
  targetId: string,
): boolean {
  return sceneryInRoom(context.state.player.position.roomId).some(
    (entry) => entry.id === targetId,
  );
}

export function describeScenery(
  context: TurnContext,
  targetId: string,
): string | undefined {
  return sceneryInRoom(context.state.player.position.roomId).find(
    (entry) => entry.id === targetId,
  )?.description;
}

function flagEffects(interaction: FlagInteraction): readonly Effect[] {
  return interaction.flags.map((flag) => ({
    kind: 'set-flag',
    flag,
    value: true,
  }));
}

function matchingInteraction(
  interactions: readonly FlagInteraction[],
  context: TurnContext,
  itemId: string,
  targetId?: string,
): FlagInteraction | undefined {
  return interactions.find(
    (entry) =>
      entry.roomId === context.state.player.position.roomId &&
      entry.itemId === itemId &&
      entry.targetId === targetId,
  );
}

export function useInteraction(
  command: Extract<TurnContext['command'], { kind: 'use' }>,
  context: TurnContext,
): readonly Effect[] | undefined {
  const interaction = matchingInteraction(
    USE_INTERACTIONS,
    context,
    command.itemId,
    command.targetId,
  );
  return interaction === undefined
    ? undefined
    : [
        ...flagEffects(interaction),
        { kind: 'message', text: interaction.text },
      ];
}

export function putInteraction(
  command: Extract<TurnContext['command'], { kind: 'put' }>,
  context: TurnContext,
): readonly Effect[] {
  const interaction = matchingInteraction(
    PUT_INTERACTIONS,
    context,
    command.itemId,
    command.targetId,
  );
  return interaction === undefined ? [] : flagEffects(interaction);
}

export function examineInteraction(targetId: string): readonly Effect[] {
  if (targetId !== 'scenery-tiles') return [];
  return [
    { kind: 'set-flag', flag: 'tiles-verified', value: true },
    {
      kind: 'message',
      text: 'You check the marked tiles and verify their order.',
    },
  ];
}
