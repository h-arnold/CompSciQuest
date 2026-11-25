// Runtime mirror of the authoring `hazard-content` gate (content-rules.md §7,
// hazards.md §3/§6). It reads only the injected bundle and never edits content.
import type { ContentBundle } from '../../content/ContentBundle';

export function hazardContentFindings(
  bundle: ContentBundle,
): readonly string[] {
  const problems: string[] = [];
  for (const hazard of bundle.hazards.all) {
    // Adapted authoring cards still carry their `authoring` block, while the
    // generated bundle keeps only the player-facing message effect.
    const authoring = (
      hazard as unknown as {
        readonly authoring?: { readonly telegraph?: unknown };
      }
    ).authoring;
    const hasAuthoredTelegraph =
      typeof authoring?.telegraph === 'string' &&
      authoring.telegraph.trim().length > 0;
    const telegraph =
      hasAuthoredTelegraph ||
      hazard.effects.some(
        (effect) => effect.kind === 'message' && effect.text.trim().length > 0,
      );
    if (!telegraph) {
      problems.push(
        `Hazard '${hazard.id}' has no player-facing telegraph message`,
      );
    }
    if (
      hazard.effects.some((effect) => effect.kind.startsWith('set-puzzle-'))
    ) {
      problems.push(`Hazard '${hazard.id}' declares a set-puzzle effect`);
    }
    if (hazard.schedule !== undefined && hazard.schedule.remainingTurns < 1) {
      problems.push(
        `Hazard '${hazard.id}' schedules '${hazard.schedule.id}' with a non-positive fuse`,
      );
    }
  }
  return problems;
}
