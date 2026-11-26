// Red test for ENG25-CITATION-01 (engine-issue-25).
// Settled decision: ENGINE_ISSUES.md Batch E2 row `25 (sidebar)` (L51) and
// issue row `#25` (L86) — "Remove the specification citation from the progress
// panel; keep the topic title and status." Canonical UI contract:
// docs/developer/application-and-ui.md §7.1 (ScorePanel lives in the sidebar
// `aside`) and §7.2 (SpecTopicView has title/specReference/status; ScorePanel
// reads GameViewData only).
import { afterEach, expect, it } from 'vitest';
import { ScorePanel } from '../../src/ui/ScorePanel';
import {
  installFakeDocument,
  makeViewData,
  RecordingGame,
  restoreDocument,
} from '../fixtures/ui';

const TOPIC_TITLE = 'Graph Search Methods';
const TOPIC_STATUS = 'in progress' as const;
const CITATION = 'PDF §4.2 page 17 / ENGINE-CITATION-SENTINEL';

afterEach(() => {
  restoreDocument();
});

it('ENG25-CITATION-01: progress panel omits the specification citation but keeps the topic title and status', () => {
  installFakeDocument();
  const viewData = makeViewData({
    areas: [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        worldName: 'Stub World',
        areaName: 'Stub Area',
        earnedScore: 7,
        maxScore: 10,
        visitedRoomCount: 1,
        roomCount: 2,
        topics: [
          {
            id: 'topic-1',
            title: TOPIC_TITLE,
            specReference: CITATION,
            status: TOPIC_STATUS,
            complete: false,
          },
        ],
      },
    ],
  });
  const game = new RecordingGame({ viewData });

  const panel = new ScorePanel(game);
  panel.refresh();

  // The fake element's textContent aggregates the element and all descendants,
  // so this covers the whole rendered progress panel.
  const panelText = panel.element.textContent ?? '';

  // The two values the settled decision says to keep.
  expect(panelText).toContain(TOPIC_TITLE);
  expect(panelText).toContain(TOPIC_STATUS);

  // The citation must not be visible anywhere in the rendered panel.
  expect(panelText).not.toContain(CITATION);
});
