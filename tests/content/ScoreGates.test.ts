// Red tests for the score-content gate (content-rules.md §7,
// application-and-ui.md §10). Score budgets are per topic; invalid scores and
// missing level starts must be reported without mutating the bundle.
import { describe, expect, it } from 'vitest';
import {
  COVERAGE_TOPIC_IDS,
  MISSING_ID,
  bundleWithTopic,
  loadValidator,
  makeArea,
  makeSpecTopic,
  scoredRooms,
  snapshot,
  withAreas,
  withRooms,
} from '../fixtures/content';
import { makeBundle } from '../fixtures/persistence';

describe('score-content validation gate', () => {
  it('C-CONTENT-10: a topic over its score budget is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(
      bundleWithTopic(makeSpecTopic({ maxScore: 5 })),
      scoredRooms(10),
    );
    const before = snapshot(bundle);

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-10: a topic exactly at its score budget passes', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(
      bundleWithTopic(makeSpecTopic({ maxScore: 10 })),
      scoredRooms(10),
    );

    expect(validate(bundle, COVERAGE_TOPIC_IDS)).toEqual([]);
  });

  it('C-CONTENT-10: a topic below its score budget passes', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(
      bundleWithTopic(makeSpecTopic({ maxScore: 20 })),
      scoredRooms(10),
    );

    expect(validate(bundle, COVERAGE_TOPIC_IDS)).toEqual([]);
  });

  it('C-CONTENT-16: a negative score is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), scoredRooms(-1));
    const before = snapshot(bundle);

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ').toLowerCase()).toContain('score');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-16: a fractional score is reported', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), scoredRooms(1.5));
    const before = snapshot(bundle);

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ').toLowerCase()).toContain('score');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-16: an area without a valid startRoomId is reported', async () => {
    const validate = await loadValidator();
    const bundle = withAreas(makeBundle(), [
      makeArea({ startRoomId: MISSING_ID }),
    ]);
    const before = snapshot(bundle);

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain(MISSING_ID);
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-16: integer scores and valid starts pass', async () => {
    const validate = await loadValidator();
    const bundle = withRooms(makeBundle(), scoredRooms(0));

    expect(validate(bundle, COVERAGE_TOPIC_IDS)).toEqual([]);
  });
});
