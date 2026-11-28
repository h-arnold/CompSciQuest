// E2E-AREA-ROOMS-01 — per-area rooms-visited contract after a real navigation.
// Confirmed by exploration/playtest; no code change and no private state pin.
// The expected area name is derived from the generated authored bundle rather
// than re-pinned as generated copy (testing.md §Generated copy).
import { expect, test, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import {
  scorePanel,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

// `area-network-hub` declares exactly one room, `room-network-hub`; `room-arrival`
// exits east into it with an empty precondition list.
const hubArea = areas.find((area) => area.id === 'area-network-hub');
if (hubArea === undefined)
  throw new Error('Generated area-network-hub is missing');

function occurrences(text: string, needle: string): number {
  let count = 0;
  let index = text.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(needle, index + needle.length);
  }
  return count;
}

async function panelLines(page: Page): Promise<string[]> {
  return scorePanel(page).locator(':scope > div').allTextContents();
}

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('E2E-AREA-ROOMS-01 per-area rooms visited after east', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-AREA-ROOMS-01 — east from room-arrival shows Rooms visited: 1 / 1 in the single-room Network Hub with score and lives unchanged', async ({
    page,
  }) => {
    await startNewGame(page);

    // Boot view data: the only progress row is the start area. These global
    // lines are the baseline for "navigation itself awards/changes nothing".
    const before = await panelLines(page);
    expect(before[0]).toBe('Score: 0');
    expect(before[1]).toBe('Lives: 3');

    // Real authored exit: `room-arrival` east → `room-network-hub`.
    await submit(page, 'east');
    await expect
      .poll(
        async () => {
          const lines = await panelLines(page);
          return lines.some((line) => line.includes(hubArea.name));
        },
        { message: 'current area is the Network Hub' },
      )
      .toBe(true);

    const after = await panelLines(page);
    // The ScorePanel reads view data, not a computed score: navigation alone
    // (`room.score:0`) neither awards points nor costs a life.
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
    expect(after[0]).toBe('Score: 0');
    expect(after[1]).toBe('Lives: 3');

    // Current-area filter keeps exactly one area card, hence one counter line.
    const roomsLines = after.filter((line) =>
      line.startsWith('Rooms visited:'),
    );
    expect(roomsLines).toEqual(['Rooms visited: 1 / 1']);
    const panelText = (await scorePanel(page).textContent()) ?? '';
    expect(occurrences(panelText, 'Rooms visited')).toBe(1);
    expect(after.some((line) => line.includes(hubArea.name))).toBe(true);

    // The command was really submitted and echoed in the transcript.
    const lines = await transcript(page);
    expect(lines.some((line) => line.includes('> east'))).toBe(true);
  });
});
