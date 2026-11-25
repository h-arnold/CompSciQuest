// Deterministic loaders for not-yet-implemented seams. A missing module or
// export gives an explicit message naming both, never a raw import error.
import { expect } from 'vitest';

export async function loadSeam<T>(
  specifier: string,
  exportName: string,
  reason: string,
): Promise<T> {
  let module: Record<string, unknown>;
  try {
    module = await import(/* @vite-ignore */ specifier);
  } catch (error) {
    throw new Error(`Missing module ${specifier} — ${reason}`, {
      cause: error,
    });
  }
  const member = module[exportName];
  expect(
    member,
    `${exportName} must be exported from ${specifier} (${reason})`,
  ).toBeTypeOf('function');
  return member as T;
}
