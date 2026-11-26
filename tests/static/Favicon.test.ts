// ENG6-FAVICON-01 — static site / first page load.
// Canonical decision: ENGINE_ISSUES.md §"Decisions settled with the user"
// (Batch E2, issue 6) and §"Issues in scope" (issue #6). Part (c) of the row
// (no 404 in a real browser) belongs to the browser tester; these guards cover
// the authored SVG asset and the icon declaration in the entry document only.
// Both files are read from disk with node:fs — no fixture supplies the asset.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const FAVICON_ASSET = 'src/assets/favicon.svg';
const SVG_MIME = 'image/svg+xml';
const ICON_REL = 'icon';
const FAVICON_PATH = fileURLToPath(
  new URL(`../../${FAVICON_ASSET}`, import.meta.url),
);
const INDEX_PATH = fileURLToPath(new URL('../../index.html', import.meta.url));

const LINK_PATTERN = /<link\b[^>]*>/giu;
const EQUALS_VALUE_PATTERN = /=(?:"([^"]*)"|'([^']*)')/gu;
const SVG_ROOT_PATTERN =
  /^<svg\b[^>]*\bxmlns\s*=\s*(["'])http:\/\/www\.w3\.org\/2000\/svg\1[^>]*>/iu;
const SVG_CLOSE_PATTERN = /<\/svg>\s*$/iu;
const HREF_PREFIX_PATTERN = /^\.?\//u;
const WHITESPACE_PATTERN = /\s+/u;

// Values are captured with the `=` sign so the attribute name can be read
// backwards to the previous whitespace; this keeps attribute order and
// whitespace irrelevant to the assertion.
function attributes(tag: string): Map<string, string> {
  const parsed = new Map<string, string>();
  for (const match of tag.matchAll(EQUALS_VALUE_PATTERN)) {
    const equalsAt = match.index ?? 0;
    let nameStart = equalsAt;
    while (
      nameStart > 0 &&
      !WHITESPACE_PATTERN.test(tag.charAt(nameStart - 1))
    ) {
      nameStart -= 1;
    }
    const name = tag.slice(nameStart, equalsAt).trim().toLowerCase();
    if (!name) continue;
    parsed.set(name, match[1] ?? match[2] ?? '');
  }
  return parsed;
}

function linkElements(html: string): string[] {
  return html.match(LINK_PATTERN) ?? [];
}

// An XML declaration, when present, is not part of the SVG document element.
function documentElement(svg: string): string {
  const trimmed = svg.trim();
  if (!trimmed.startsWith('<?xml')) return trimmed;
  const declarationEnd = trimmed.indexOf('?>');
  return declarationEnd === -1
    ? trimmed
    : trimmed.slice(declarationEnd + 2).trim();
}

function iconLinks(html: string): string[] {
  return linkElements(html).filter(
    (tag) =>
      attributes(tag)
        .get('rel')
        ?.toLowerCase()
        .split(WHITESPACE_PATTERN)
        .includes(ICON_REL) === true,
  );
}

function normalisedHref(href: string): string {
  return href.trim().replace(HREF_PREFIX_PATTERN, '');
}

describe('static site favicon (ENG6-FAVICON-01)', () => {
  it('ENG6-FAVICON-01: engine-authored SVG asset exists and parses as SVG', () => {
    const assetExists = existsSync(FAVICON_PATH);
    expect(
      assetExists,
      `${FAVICON_ASSET} must be authored under src/assets as the page icon`,
    ).toBe(true);
    if (!assetExists) return;

    const svg = readFileSync(FAVICON_PATH, 'utf8');
    expect(
      svg.trim().length,
      `${FAVICON_ASSET} must not be empty`,
    ).toBeGreaterThan(0);

    const document = documentElement(svg);
    expect(
      document,
      `${FAVICON_ASSET} must have a root <svg> element declaring the SVG namespace`,
    ).toMatch(SVG_ROOT_PATTERN);
    expect(
      document,
      `${FAVICON_ASSET} must have a matching </svg> close`,
    ).toMatch(SVG_CLOSE_PATTERN);
  });

  it('ENG6-FAVICON-01: index.html declares the SVG asset as the page icon', () => {
    const html = readFileSync(INDEX_PATH, 'utf8');
    const declaredIcons = iconLinks(html);
    expect(
      declaredIcons.length,
      'index.html must declare an icon <link> element',
    ).toBeGreaterThan(0);
    if (declaredIcons.length === 0) return;

    const svgIcons = declaredIcons.filter(
      (tag) => attributes(tag).get('type')?.toLowerCase() === SVG_MIME,
    );
    expect(
      svgIcons.length,
      `the icon <link> must declare type="${SVG_MIME}"`,
    ).toBeGreaterThan(0);
    if (svgIcons.length === 0) return;

    const targets = svgIcons.map((tag) =>
      normalisedHref(attributes(tag).get('href') ?? ''),
    );
    expect(
      targets,
      `the icon <link> must point at ${FAVICON_ASSET} (relative or root-absolute)`,
    ).toContain(FAVICON_ASSET);
  });
});
