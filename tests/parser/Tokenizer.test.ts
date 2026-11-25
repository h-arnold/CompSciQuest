// Tokenizer contract from architecture.md §5 (also §4 folder layout).
import { describe, expect, it } from 'vitest';
import { loadTokenizer } from '../fixtures/parser';

describe('tokenizer contracts', () => {
  it('P-PARSE-01: mixed case and punctuation are lowercased, stripped and tokenised', async () => {
    const tokenizer = await loadTokenizer();

    expect(tokenizer.tokenize('  PICK   Up the Key!!  ')).toEqual([
      'pick',
      'up',
      'the',
      'key',
    ]);
    expect(tokenizer.tokenize('GO, North!')).toEqual(['go', 'north']);
  });
});
