// Verb and alias tables are engine constants, while item and actor aliases are
// content-owned (application-and-ui.md §5.2; shared-rules.md §10).
import { describe, expect, it } from 'vitest';
import { makeBundle } from '../fixtures/persistence';
import {
  KEY_A,
  loadNameResolver,
  loadParser,
  makeParserBundle,
  makeParserState,
} from '../fixtures/parser';

describe('alias ownership', () => {
  it('P-PARSE-21: verb/direction aliases are engine constants and object aliases come from content', async () => {
    const parser = await loadParser();
    const createResolver = await loadNameResolver();
    const resolver = createResolver();
    const state = makeParserState();
    const bundle = makeParserBundle();
    const emptyBundle = makeBundle({ emptyContent: true });

    // The parser needs no content bundle: these aliases are engine constants.
    expect(parser.parse('get key').verb).toBe('take');
    expect(parser.parse('n').verb).toBe('go');
    expect(parser.parse('pick up key').verb).toBe('take');

    // The same phrase resolves only when the injected content declares the
    // object alias.
    expect(resolver.resolve('brass key', state, bundle)).toBe(KEY_A);
    expect(resolver.resolve('brass key', state, emptyBundle)).toBeUndefined();
  });
});
