// Boot/test validation parity, coverage-topic ID checks and the declaration of
// deferred mechanics gates. Coverage headings are injected as data — the
// static runtime never reads them from disk.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../../src/content/index';
import { localBundle } from '../fixtures/localBundle';
import { ZONE1_SPEC_TOPIC_IDS } from '../fixtures/zone1';
import {
  COVERAGE_TOPIC_IDS,
  LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
  bundleWithTopic,
  loadValidator,
  makeSpecTopic,
  snapshot,
} from '../fixtures/content';

describe('shared boot/test validation', () => {
  it('C-CONTENT-11: validateContent accepts the stub fixture', async () => {
    const validate = await loadValidator();

    expect(validate(localBundle, COVERAGE_TOPIC_IDS)).toEqual([]);
  });

  it('C-CONTENT-12: boot catalogues and Vitest use the same result', async () => {
    const validate = await loadValidator();
    const bootBundle = loadContent();

    const problems = validate(bootBundle, COVERAGE_TOPIC_IDS);

    expect(problems).toEqual([]);
    expect(problems).toEqual(validate(localBundle, COVERAGE_TOPIC_IDS));
  });
});

describe('coverage topic IDs', () => {
  it('C-CONTENT-15: a topic ID absent from the coverage headings is reported', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic());
    const before = snapshot(bundle);

    const problems = validate(bundle, ['stub-topic']);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-15: a topic without a spec reference is reported', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic({ specReference: '' }));
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-15: a topic without an evidence note is reported', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic({ evidence: '' }));
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-15: a matched topic with reference and evidence passes', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic());

    expect(validate(bundle, ['topic-1'])).toEqual([]);
  });

  it('C-CONTENT-12: a stale placeholder coverage index is still rejected after generation', async () => {
    const validate = await loadValidator();
    const bundle = loadContent();
    const before = snapshot(bundle);

    const problems = validate(bundle, ['stub-topic']);

    expect(problems.length).toBeGreaterThan(0);
    for (const id of ZONE1_SPEC_TOPIC_IDS) {
      expect(
        problems.some((problem) => problem.includes(`'${id}'`)),
        `stale index must report generated topic '${id}' as absent`,
      ).toBe(true);
    }
    expect(
      snapshot(bundle),
      'validation must not mutate the generated bundle',
    ).toBe(before);
  });
});

describe('deferred mechanics gates', () => {
  it('C-CONTENT-17: deferred gates do not reject the local or generated bundle', async () => {
    const validate = await loadValidator();

    // quiz-content, puzzle-graph, hint-content, hazard-content and npc-content
    // are declared but have no behaviour yet, so the local fixture and the real
    // generated bundle must both pass the one shared boot/Vitest validator when
    // the canonical eleven-heading coverage index is injected.
    expect(validate(localBundle, COVERAGE_TOPIC_IDS)).toEqual([]);
    expect(validate(loadContent(), COVERAGE_TOPIC_IDS)).toEqual([]);
  });
});
