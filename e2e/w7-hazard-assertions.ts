// Shared W7 hazard-outcome assertions. ENG8-LOGID-01 suppresses the internal
// `hazard-triggered` transcript line; the authored message and life-loss line
// are the player-facing outcome that replaces it.
import { expect } from 'playwright/test';
import { hazards } from '../src/content/authored/hazards';

export function hazardAnnouncement(hazardId: string): string {
  const hazard = hazards.find((entry) => entry.id === hazardId);
  if (hazard === undefined) {
    throw new Error(`Unknown authored hazard ${hazardId}`);
  }
  const message = hazard.effects.find((effect) => effect.kind === 'message');
  if (message === undefined || message.kind !== 'message') {
    throw new Error(`Authored hazard ${hazardId} has no message effect`);
  }
  return message.text;
}

interface HazardStep {
  readonly hazard?: string;
  readonly position?: readonly [roomId: string, lives: number];
}

export function expectHazardOutcome(
  lines: readonly string[],
  step: HazardStep,
): void {
  const hazardId = step.hazard;
  if (hazardId === undefined) return;
  const announcement = hazardAnnouncement(hazardId);
  expect(lines.some((line) => line.startsWith(`Hazard ${hazardId}:`))).toBe(
    false,
  );
  expect(lines.some((line) => line.startsWith('Hazard '))).toBe(false);
  expect(lines).toContain(announcement);
  const lives = step.position?.[1];
  if (lives === undefined) {
    throw new Error(`No lives for hazard step ${hazardId}`);
  }
  expect(lines).toContain(`Lives: ${lives}.`);
}
