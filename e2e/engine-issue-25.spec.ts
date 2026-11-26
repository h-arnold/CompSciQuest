// Browser coverage for ENG25-CITATION-01: the sidebar progress panel shows
// each authored topic's title and status, but never its spec citation.
// Playwright's configured baseURL is used by default; CSQ_E2E_URL may point a
// local repro at another server.
import { expect, test } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { specTopics } from '../src/content/authored/spec-topics';
import { worlds } from '../src/content/authored/worlds';

const csqUrl = process.env['CSQ_E2E_URL'];
if (csqUrl !== undefined) test.use({ baseURL: csqUrl });

const SAVE_KEY = 'compsciquest:save:v1';
const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';

function topicBearingArea() {
  const area = areas.find((candidate) =>
    specTopics.some((topic) =>
      topic.roomIds.some((roomId) => candidate.roomIds.includes(roomId)),
    ),
  );
  if (area === undefined) throw new Error('No authored topic-bearing area');
  return area;
}

function consoleErrors(page: import('playwright/test').Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(String(error));
  });
  return errors;
}

test('ENG25-CITATION-01: authored topic titles and status render without a spec citation', async ({
  page,
}) => {
  const errors = consoleErrors(page);
  const area = topicBearingArea();
  const worldId = worlds[0]?.id;
  if (worldId === undefined) throw new Error('No authored world');
  const topics = specTopics.filter((topic) =>
    topic.roomIds.some((roomId) => area.roomIds.includes(roomId)),
  );
  expect(topics.length).toBeGreaterThan(0);
  const chosen = topics.slice(0, 3);
  const roomId = area.roomIds[0];
  if (roomId === undefined) throw new Error('Topic-bearing area has no room');

  const save = JSON.stringify({
    version: 1,
    savedAt: '2026-11-24T12:06:00.000Z',
    state: {
      player: {
        position: { worldId, areaId: area.id, roomId },
        inventory: [],
        lives: 3,
      },
      rooms: Object.fromEntries(
        area.roomIds.map((id) => [id, { inventory: [] }]),
      ),
      npcs: {},
      hazards: {},
      puzzles: {},
      hints: {},
      quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
      quizAttempts: {},
      flags: {},
      progress: [
        {
          worldId,
          areaId: area.id,
          visitedRooms: [roomId],
          completedTopics: chosen.map((topic) => topic.id),
          earnedScore: 0,
          maxScore: 0,
        },
      ],
      turn: 0,
      status: 'playing',
      schedule: [],
      rngSeed: 1,
      counters: {},
    },
  });

  // Fresh storage for every test; one seeded valid v1 save restores the
  // authored topic progress deterministically without inventing content IDs.
  await page.addInitScript(
    ({ saveKey, quarantineKey, seeded }) => {
      localStorage.removeItem(saveKey);
      localStorage.removeItem(quarantineKey);
      localStorage.setItem(saveKey, seeded);
    },
    { saveKey: SAVE_KEY, quarantineKey: QUARANTINE_KEY, seeded: save },
  );

  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();

  const panel = page.locator('.score-panel');
  const lines = await panel.locator('div').allTextContents();
  for (const topic of chosen) {
    expect(lines).toContain(`${topic.title} — ${topic.status}`);
    expect(topic.specReference.length).toBeGreaterThan(0);
  }
  const panelText = lines.join('\n');
  for (const topic of chosen) {
    expect(panelText).not.toContain(topic.specReference);
  }
  expect(panelText).not.toMatch(/wjec-unit1\.md/iu);
  expect(panelText).not.toMatch(/\bL\d{2,}\b/u);
  expect(panelText).not.toMatch(/\b1\.\d\.\d\b/u);
  expect(panelText).not.toContain('(');

  expect(errors).toEqual([]);
});

test('ENG25-CITATION-01: New Game boots cleanly with a labelled command and live transcript', async ({
  page,
}) => {
  const errors = consoleErrors(page);
  await page.addInitScript(
    ({ saveKey, quarantineKey }) => {
      localStorage.removeItem(saveKey);
      localStorage.removeItem(quarantineKey);
    },
    { saveKey: SAVE_KEY, quarantineKey: QUARANTINE_KEY },
  );

  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
  await expect(page.locator('.score-panel')).toBeVisible();
  await expect(page.locator('.output-log')).toHaveAttribute(
    'aria-live',
    'polite',
  );

  const command = page.getByRole('textbox', { name: 'Command' });
  await command.fill('look');
  await command.press('Enter');
  await expect(
    page.locator('.output-log > div', { hasText: '> look' }),
  ).toBeVisible();
  await command.press('ArrowUp');
  await expect(command).toHaveValue('look');

  const panelText = (await page.locator('.score-panel').textContent()) ?? '';
  expect(panelText).not.toMatch(/wjec-unit1\.md/iu);
  expect(panelText).not.toMatch(/\bL\d{2,}\b/u);
  expect(panelText).not.toMatch(/\b1\.\d\.\d\b/u);
  expect(errors).toEqual([]);
});
