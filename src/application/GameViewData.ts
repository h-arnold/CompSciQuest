// Canonical view-model from application-and-ui.md §7.2.
// The UI presents these values; it never computes scores or resolves rules.
import type { Position } from '../types/domain';
import type { SpecStatus } from '../core/scoring/SpecTopic';
import type { SessionStatus } from '../core/SessionStatus';

export interface SpecTopicView {
  readonly id: string;
  readonly title: string;
  readonly specReference: string;
  readonly status: SpecStatus;
  readonly complete: boolean;
}

export interface AreaProgressView {
  readonly worldId: string;
  readonly areaId: string;
  readonly worldName: string;
  readonly areaName: string;
  readonly earnedScore: number;
  readonly maxScore: number;
  readonly visitedRoomCount: number;
  readonly roomCount: number;
  readonly topics: readonly SpecTopicView[];
}

export interface QuizView {
  readonly quizId: string;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly questionNumber: number;
  readonly questionCount: number;
}

export interface ConversationView {
  readonly actorId: string;
  readonly actorName: string;
  readonly prompt?: string; // omitted when there is no suggestion
}

export interface HintView {
  readonly hintId: string;
  readonly level: number;
  readonly text: string;
}

export interface GameViewData {
  readonly status: SessionStatus;
  readonly position: Position;
  readonly turn: number;
  readonly lives: number;
  readonly score: number;
  readonly areas: readonly AreaProgressView[];
  readonly activeQuiz?: QuizView;
  readonly conversation?: ConversationView;
  readonly hints: readonly HintView[];
}
