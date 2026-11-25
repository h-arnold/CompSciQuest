// Friendly copy for every canonical LoadFailureReason (application-and-ui.md
// §7.2, storage-schema.md §8.2). This table is UI copy only; it never changes
// state and no other reason message may be invented.
import type { LoadFailureReason } from '../application/SaveDto';

const MESSAGES: Readonly<Record<LoadFailureReason, string>> = {
  'invalid-json': 'That save file is not valid JSON.',
  'wrong-version': 'That save is from an older version of the game.',
  'newer-version': 'That save is from a newer version of the game.',
  'invalid-shape': 'That save file does not have the expected structure.',
  'invalid-content': 'That save refers to content this version does not know.',
};

export function loadFailureMessage(reason: LoadFailureReason): string {
  return MESSAGES[reason];
}
