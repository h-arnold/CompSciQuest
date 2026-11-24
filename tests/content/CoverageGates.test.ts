// Boot/test validation parity, coverage-topic ID checks and the declaration of
// deferred mechanics gates (application-and-ui.md §3.3, §12; content-rules.md §7,
// V3). Coverage headings are injected as data — the static runtime never reads
// COVERAGE.md from disk.
import { describe, expect, it } from 'vitest';
import { loadContent } from '../../src/content/index';
import { stubBundle } from '../../src/content/stub/index';
import {
  COVERAGE_TOPIC_IDS,
  bundleWithTopic,
  loadValidator,
  makeSpecTopic,
  snapshot,
} from '../fixtures/content';

describe('shared boot/test validation', () => {
  it('C-CONTENT-11: validateContent accepts the stub fixture', async () => {
    const validate = await loadValidator();

    expect(validate(stubBundle, COVERAGE_TOPIC_IDS)).toEqual([]);
  });

  it('C-CONTENT-12: boot catalogues and Vitest use the same result', async () => {
    const validate = await loadValidator();
    const bootBundle = loadContent();

    const problems = validate(bootBundle, COVERAGE_TOPIC_IDS);

    expect(problems).toEqual([]);
    expect(problems).toEqual(validate(stubBundle, COVERAGE_TOPIC_IDS));
  });
});

describe('coverage topic IDs (content-rules.md §5, §7, V3)', () => {
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

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-15: a topic without an evidence note is reported', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic({ evidence: '' }));
    const before = snapshot(bundle);

    const problems = validate(bundle, COVERAGE_TOPIC_IDS);

    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join(' ')).toContain('topic-1');
    expect(snapshot(bundle)).toBe(before);
  });

  it('C-CONTENT-15: a matched topic with reference and evidence passes', async () => {
    const validate = await loadValidator();
    const bundle = bundleWithTopic(makeSpecTopic());

    expect(validate(bundle, ['topic-1'])).toEqual([]);
  });
});

describe('deferred mechanics gates (content-rules.md §7)', () => {
  it('C-CONTENT-17: deferred gates do not reject the empty stub', async () => {
    const validate = await loadValidator();

    // quiz-content, puzzle-graph, hint-content, hazard-content and npc-content
    // are declared but have no behaviour yet, so empty mechanics catalogues
    // must pass the one shared validator used by boot and Vitest.
    expect(validate(stubBundle, COVERAGE_TOPIC_IDS)).toEqual([]);
    expect(validate(loadContent(), COVERAGE_TOPIC_IDS)).toEqual([]);
  });
});
