// Deterministic TypeScript emission for generated content catalogues
// (content-toolchain.md §5). No timestamps and no card-specific ordering.

export interface CatalogueEmit {
  readonly name: string;
  readonly typeName: string;
  readonly importPath: string;
  readonly entries: readonly Record<string, unknown>[];
}

function stripAuthoring(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => stripAuthoring(item));
  if (typeof value !== 'object' || !(value instanceof Object)) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'authoring')
      .map(([key, child]) => [key, stripAuthoring(child)]),
  );
}

export function cleanEntry(
  data: Record<string, unknown>,
  ...drop: readonly string[]
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => key !== 'authoring' && !drop.includes(key))
      .map(([key, value]) => [key, stripAuthoring(value)]),
  );
}

function indentJson(value: unknown, spaces: number): string {
  const prefix = ' '.repeat(spaces);
  return JSON.stringify(value, undefined, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${prefix}${line}`))
    .join('\n');
}

export function emitCatalogue(spec: CatalogueEmit): string {
  const entries = spec.entries.map((entry) => indentJson(entry, 2));
  const indented = entries.map((entry) => `  ${entry}`).join(',\n');
  const body = entries.length === 0 ? '[]' : `[\n${indented}\n]`;
  return [
    '// GENERATED FILE — do not edit. Regenerate with npm run content:generate.',
    `import type { ${spec.typeName} } from '${spec.importPath}';`,
    '',
    `export const ${spec.name}: readonly ${spec.typeName}[] = ${body};`,
    '',
  ].join('\n');
}
