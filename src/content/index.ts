// STUB — replace with authored content
// Canonical entry point from application-and-ui.md §3.3. The real registry is
// authored later; this slice only wires the deterministic stub fixture.
import type { ContentBundle } from './ContentBundle';
import { stubBundle } from './stub';

export function loadContent(): ContentBundle {
  return stubBundle;
}
