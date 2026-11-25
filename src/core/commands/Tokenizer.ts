// Canonical responsibility from architecture.md §5: lowercase, strip
// punctuation, then tokenise. Pure and deterministic; no game content here.
function tokenise(raw: string): readonly string[] {
  const cleaned = raw.toLowerCase().replaceAll(/[^\p{L}\p{N}\s]/gu, ' ');
  return cleaned.split(/\s+/u).filter((token) => token.length > 0);
}

// The seam loader verifies the export is callable and invokes its named method,
// so the exported function also carries that method.
export const tokenize = Object.assign(tokenise, { tokenize: tokenise });
