// Red tests for ENG11-SIDEBAR-STATE-01 (engine-issue-11).
// Settled authority: ENGINE_ISSUES.md L63-64 ("render only the current progress
// state in the sidebar and reconcile the totals"), issue row #11 (L80), Batch
// E2 Group D (L135-139) and Stream 3 (L157). Player evidence only:
// PLAYTEST_ISSUES.md §11 (L121-129). Canonical UI contract:
// docs/developer/application-and-ui.md §7.1 (ScorePanel in the sidebar aside)
// and §7.2 (ScorePanel reads GameViewData only and never computes scores).
import { afterEach, expect, it } from 'vitest';
import type { GameViewData } from '../../src/application/GameViewData';
import { ScorePanel } from '../../src/ui/ScorePanel';
import {
  installFakeDocument,
  makeViewData,
  RecordingGame,
  restoreDocument,
} from '../fixtures/ui';

const CURRENT_WORLD = 'Current World';
const CURRENT_AREA = 'Current Mill';
const OLD_WORLD = 'Old World';
const OLD_AREA = 'Old Quarry';
const EARLIER_WORLD = 'Earlier World';
const EARLIER_AREA = 'Earlier Shore';

const CURRENT_EARNED = 12;
const CURRENT_MAX = 19;
const CURRENT_VISITED = 2;
const CURRENT_ROOMS = 8;
const HEADLINE_SCORE = 41;
const HEADLINE_LIVES = 2;

const TOPIC_TITLE = 'Graph Search Methods';
const TOPIC_STATUS = 'in progress' as const;
const TOPIC_REFERENCE = 'PDF §4.2 page 17 / CURRENT-CITATION-SENTINEL';
const STALE_TOPIC_TITLE = 'Old Sorting Methods';
const STALE_TOPIC_REFERENCE = 'PDF §2.1 page 3 / OLD-CITATION-SENTINEL';

// One current area plus two previously visited areas, mirroring the player
// evidence in PLAYTEST_ISSUES.md §11. All values are injected through
// GameViewData; the panel must present them rather than recompute them.
function makeMultiAreaViewData(): GameViewData {
  return makeViewData({
    position: {
      worldId: 'world-current',
      areaId: 'area-current',
      roomId: 'room-current-1',
    },
    score: HEADLINE_SCORE,
    lives: HEADLINE_LIVES,
    areas: [
      {
        worldId: 'world-old',
        areaId: 'area-old',
        worldName: OLD_WORLD,
        areaName: OLD_AREA,
        earnedScore: 3,
        maxScore: 99,
        visitedRoomCount: 4,
        roomCount: 5,
        topics: [
          {
            id: 'topic-old',
            title: STALE_TOPIC_TITLE,
            specReference: STALE_TOPIC_REFERENCE,
            status: 'covered',
            complete: true,
          },
        ],
      },
      {
        worldId: 'world-earlier',
        areaId: 'area-earlier',
        worldName: EARLIER_WORLD,
        areaName: EARLIER_AREA,
        earnedScore: 6,
        maxScore: 40,
        visitedRoomCount: 7,
        roomCount: 9,
        topics: [],
      },
      {
        worldId: 'world-current',
        areaId: 'area-current',
        worldName: CURRENT_WORLD,
        areaName: CURRENT_AREA,
        earnedScore: CURRENT_EARNED,
        maxScore: CURRENT_MAX,
        visitedRoomCount: CURRENT_VISITED,
        roomCount: CURRENT_ROOMS,
        topics: [
          {
            id: 'topic-current',
            title: TOPIC_TITLE,
            specReference: TOPIC_REFERENCE,
            status: TOPIC_STATUS,
            complete: false,
          },
        ],
      },
    ],
  });
}

// appendLine writes one div per visible line, so the panel's child elements
// expose the rendered output without reaching into private state.
function renderedLines(panel: ScorePanel): string[] {
  return Array.from(panel.element.children, (child) => child.textContent ?? '');
}

afterEach(() => {
  restoreDocument();
});

it('ENG11-SIDEBAR-STATE-01: renders exactly one area card — the one matching the current position', () => {
  installFakeDocument();
  const game = new RecordingGame({ viewData: makeMultiAreaViewData() });

  const panel = new ScorePanel(game);
  panel.refresh();

  const currentHeading = `${CURRENT_WORLD} — ${CURRENT_AREA}`;
  const areaNames = new Set([
    `${OLD_WORLD} — ${OLD_AREA}`,
    `${EARLIER_WORLD} — ${EARLIER_AREA}`,
    currentHeading,
  ]);
  const areaHeadings = renderedLines(panel).filter((line) =>
    areaNames.has(line),
  );

  expect(areaHeadings).toEqual([currentHeading]);
  expect(game.viewDataCalls).toHaveLength(1);
});

it('ENG11-SIDEBAR-STATE-01: reconciles the current card totals with the headline score and lives', () => {
  installFakeDocument();
  const game = new RecordingGame({ viewData: makeMultiAreaViewData() });

  const panel = new ScorePanel(game);
  panel.refresh();

  const lines = renderedLines(panel);
  expect(lines).toContain(`Score: ${CURRENT_EARNED} / ${CURRENT_MAX}`);
  expect(lines).toContain(
    `Rooms visited: ${CURRENT_VISITED} / ${CURRENT_ROOMS}`,
  );
  expect(lines).toContain(`Score: ${HEADLINE_SCORE}`);
  expect(lines).toContain(`Lives: ${HEADLINE_LIVES}`);

  // No stale per-area totals may remain alongside the current card.
  expect(lines).not.toContain('Score: 3 / 99');
  expect(lines).not.toContain('Rooms visited: 4 / 5');
  expect(lines).not.toContain('Score: 6 / 40');
  expect(lines).not.toContain('Rooms visited: 7 / 9');
});

it('ENG11-SIDEBAR-STATE-01: preserves the issue-25 topic title and status without the specification citation', () => {
  installFakeDocument();
  const game = new RecordingGame({ viewData: makeMultiAreaViewData() });

  const panel = new ScorePanel(game);
  panel.refresh();

  const panelText = panel.element.textContent ?? '';
  expect(panelText).toContain(TOPIC_TITLE);
  expect(panelText).toContain(TOPIC_STATUS);
  expect(panelText).not.toContain(TOPIC_REFERENCE);

  // A stale card would also bring its own topic line into the panel.
  expect(panelText).not.toContain(STALE_TOPIC_TITLE);
  expect(panelText).not.toContain(STALE_TOPIC_REFERENCE);
});
