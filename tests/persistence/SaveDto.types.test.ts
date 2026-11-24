// Type-shape rows (S-PERSIST-17, S-PERSIST-18). These are the only matrix IDs
// where a type-level assertion is the contract; a runtime check pins the five
// documented reason strings as well.
import { describe, expect, expectTypeOf, it } from 'vitest';
import type {
  LoadFailureReason,
  LoadResult,
  SaveDto,
} from '../../src/application/SaveDto';

describe('save DTO result types', () => {
  it('S-PERSIST-17: LoadResult is exactly ok-with-dto or ok-false-with-reason', () => {
    expectTypeOf<LoadResult>().toEqualTypeOf<
      | { readonly ok: true; readonly dto: SaveDto }
      | { readonly ok: false; readonly reason: LoadFailureReason }
    >();
    expectTypeOf<{
      readonly ok: true;
      readonly dto: SaveDto;
    }>().toMatchTypeOf<LoadResult>();
    expectTypeOf<{
      readonly ok: false;
      readonly reason: LoadFailureReason;
    }>().toMatchTypeOf<LoadResult>();
  });

  it('S-PERSIST-18: LoadFailureReason exposes all five documented variants', () => {
    expectTypeOf<LoadFailureReason>().toEqualTypeOf<
      | 'invalid-json'
      | 'wrong-version'
      | 'newer-version'
      | 'invalid-shape'
      | 'invalid-content'
    >();

    const reasons: readonly LoadFailureReason[] = [
      'invalid-json',
      'wrong-version',
      'newer-version',
      'invalid-shape',
      'invalid-content',
    ];
    expect(reasons).toHaveLength(5);
    expect(new Set(reasons).size).toBe(5);
  });
});
