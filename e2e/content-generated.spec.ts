// Browser checks for the committed, generated authored content bundle.
// The shared Playwright config owns test-time server startup and baseURL.
// No YAML is fetched at runtime: the catalogues are TS modules.
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from 'playwright/test';
import { actorStates } from '../src/content/authored/actor-states';
import { actors } from '../src/content/authored/actors';
import { areas } from '../src/content/authored/areas';
import { conversationTopics } from '../src/content/authored/conversation-topics';
import { hazards } from '../src/content/authored/hazards';
import { hints } from '../src/content/authored/hints';
import { items } from '../src/content/authored/items';
import { nodes } from '../src/content/authored/nodes';
import { puzzles } from '../src/content/authored/puzzles';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import { rooms } from '../src/content/authored/rooms';
import { specTopics } from '../src/content/authored/spec-topics';
import { worlds } from '../src/content/authored/worlds';

// Canonical storage keys from docs/developer/storage-schema.md §2 and §9.
const SAVE_KEY = 'compsciquest:save:v1';
const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';

const world = worlds[0];
// The boot area is the world's startAreaId (walkthrough.md §2), not areas[0].
const area = areas.find((entry) => entry.id === world?.startAreaId);
const startRoom = rooms.find((room) => room.id === area?.startRoomId);
if (startRoom === undefined) throw new Error('Generated start room is missing');

const START_POSITION = {
  worldId: world?.id,
  areaId: area?.id,
  roomId: startRoom.id,
};

async function clearStorage(page: Page): Promise<void> {
  await page.addInitScript(
    ({ saveKey, quarantineKey }) => {
      localStorage.removeItem(saveKey);
      localStorage.removeItem(quarantineKey);
    },
    { saveKey: SAVE_KEY, quarantineKey: QUARANTINE_KEY },
  );
}

async function enterGeneratedGame(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

async function transcript(page: Page): Promise<string[]> {
  return page.locator('.output-log > div').allTextContents();
}

async function submitCommand(page: Page, raw: string): Promise<void> {
  const input = page.getByRole('textbox', { name: 'Command' });
  await input.fill(raw);
  await input.press('Enter');
}

// The DOM-only renderer consumes Markdown emphasis markers and concatenates
// paragraph nodes without a separator, so derive the expected transcript text
// from the authored description in the same way before comparing.
function renderedDescription(description: string): string {
  return description
    .replaceAll(/\*{1,3}/gu, '')
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.replaceAll(/\n+/gu, ' ').trim())
    .join('');
}

test.describe('generated zone-1 content', () => {
  let yamlRequests: string[] = [];
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    yamlRequests = [];
    consoleErrors = [];
    page.on('request', (request) => {
      // The compiled site must never ask the network for a YAML source card.
      if (/\.ya?ml(?:$|\?)/iu.test(request.url())) {
        yamlRequests.push(request.url());
      }
    });
    page.on('console', (message) => {
      // A missing favicon is a static-asset issue owned by the UI slice; it is
      // reported separately and is not caused by the content toolchain.
      if (
        message.type() !== 'error' ||
        message.location().url.includes('favicon.ico')
      ) {
        return;
      }
      consoleErrors.push(`${message.text()} @ ${message.location().url}`);
    });
    page.on('pageerror', (error) => {
      consoleErrors.push(String(error));
    });
    await clearStorage(page);
  });

  test.afterEach(() => {
    expect(yamlRequests, 'no YAML or YML request').toEqual([]);
    expect(consoleErrors, 'no application console error').toEqual([]);
  });

  test('E2E-CONTENT-01 — committed generated catalogues have the zone-1 counts and start room', async () => {
    // Counts come from the committed generated authored bundle after the
    // Assistance Ward and round-2 regeneration; every value below was checked
    // against the exported array length.
    expect(worlds).toHaveLength(1);
    expect(areas).toHaveLength(6);
    expect(rooms).toHaveLength(23);
    expect(items).toHaveLength(64);
    expect(actors).toHaveLength(20);
    expect(actorStates).toHaveLength(22);
    expect(conversationTopics).toHaveLength(123);
    expect(nodes).toHaveLength(7);
    expect(quizzes).toHaveLength(15);
    expect(questions).toHaveLength(60);
    expect(puzzles).toHaveLength(24);
    expect(hazards).toHaveLength(8);
    expect(hints).toHaveLength(16);
    expect(specTopics).toHaveLength(11);

    expect(world?.id).toBe('world-wjec-gcse-computer-science-2025-spec');
    expect(world?.startAreaId).toBe('area-entry-interface');
    expect(area?.id).toBe('area-entry-interface');
    expect(area?.startRoomId).toBe('room-arrival');
    expect(area?.lives).toBe(3);
    expect(rooms.some((room) => room.id === 'room-stub-start')).toBe(false);
    expect(startRoom.title).toBe('The Arrival Bay');
  });

  test('E2E-CONTENT-02 — boot and the first game view use the bundled generated text', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.locator('.title-overlay h1')).toHaveText('CompSciQuest');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();

    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    const output = (await page.locator('.output-log').textContent()) ?? '';
    const lines = await transcript(page);
    expect(lines).toContain(startRoom.title);
    expect(output).toContain(renderedDescription(startRoom.description));
    expect(output).toContain('Exits:');
    // Authored arrival prose, not a stub string.
    expect(output).toContain('attention not satisfied');
    await expect(page.locator('.score-panel')).toContainText('Score: 0');
    await expect(page.locator('.score-panel')).toContainText('Lives: 3');
    await expect(page.locator('.score-panel')).toContainText(
      'Rooms visited: 1 / 1',
    );
    expect(yamlRequests).toEqual([]);
  });

  test('E2E-CONTENT-03 — a command is echoed, advances the turn and keeps the generated view', async ({
    page,
  }) => {
    await enterGeneratedGame(page);

    await submitCommand(page, 'look');
    expect(await transcript(page)).toContain('> look');
    expect((await page.locator('.output-log').textContent()) ?? '').toContain(
      renderedDescription(startRoom.description),
    );

    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const raw = await page.evaluate(
      (key) => localStorage.getItem(key),
      SAVE_KEY,
    );
    expect(raw).not.toBeNull();
    const envelope = JSON.parse(raw as string) as {
      state: { turn: number };
    };
    expect(envelope.state.turn).toBe(1);
    await expect(page.locator('.score-panel')).toContainText('Score: 0');
    await expect(page.locator('.score-panel')).toContainText('Lives: 3');
  });

  test('E2E-CONTENT-04 — export carries the generated start position and import restores it', async ({
    page,
  }) => {
    await enterGeneratedGame(page);

    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const download = await pending;
    const path = await download.path();
    expect(path, 'download has a local path').not.toBeNull();
    const text = await readFile(path as string, 'utf8');
    const envelope = JSON.parse(text) as {
      version: number;
      savedAt: string;
      state: {
        turn: number;
        player: { position: typeof START_POSITION; lives: number };
      };
    };
    expect(envelope.version).toBe(1);
    expect(envelope.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/u);
    expect(envelope.state.turn).toBe(0);
    expect(envelope.state.player.lives).toBe(3);
    expect(envelope.state.player.position).toEqual(START_POSITION);

    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    const fileChooser = await chooser;
    await fileChooser.setFiles({
      name: 'generated-save.json',
      mimeType: 'application/json',
      buffer: Buffer.from(text),
    });
    await expect(page.locator('.save-status')).toHaveText('Game imported.');
    expect(await transcript(page)).toContain('Game imported.');
    const restored = (await page.locator('.output-log').textContent()) ?? '';
    expect(restored).toContain(startRoom.title);
    expect(restored).toContain(renderedDescription(startRoom.description));
    await expect(page.locator('.score-panel')).toContainText('Score: 0');
    await expect(page.locator('.score-panel')).toContainText('Lives: 3');
  });
});
