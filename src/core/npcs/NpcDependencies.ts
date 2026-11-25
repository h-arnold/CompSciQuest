// Shared injected ports for the phase-3 and phase-4 NPC seams
// (application-and-ui.md §8). One canonical shape, reused by both factories.
import type { ContentBundle } from '../../content/ContentBundle';
import type { EffectApplier } from '../effects/EffectApplier';
import type { Random } from '../Random';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';

export interface NpcDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
  readonly applier: EffectApplier;
}
