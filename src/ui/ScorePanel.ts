// Aggregate state panel (application-and-ui.md §7.2). It reads GameViewData
// only: it never recomputes a score, resolves an alias or decides a game rule.
import type { Game } from '../application/Game';
import type {
  AreaProgressView,
  GameViewData,
  SpecTopicView,
} from '../application/GameViewData';
import { appendLine } from './appendLine';

function renderTopic(parent: HTMLElement, topic: SpecTopicView): void {
  appendLine(parent, `${topic.title} — ${topic.status}`);
}

function renderArea(parent: HTMLElement, area: AreaProgressView): void {
  appendLine(parent, `${area.worldName} — ${area.areaName}`);
  appendLine(parent, `Score: ${area.earnedScore} / ${area.maxScore}`);
  appendLine(
    parent,
    `Rooms visited: ${area.visitedRoomCount} / ${area.roomCount}`,
  );
  for (const topic of area.topics) {
    renderTopic(parent, topic);
  }
}

export class ScorePanel {
  private readonly game: Game;
  readonly element: HTMLElement;

  constructor(game: Game) {
    this.game = game;
    this.element = document.createElement('div');
    this.element.className = 'score-panel';
  }

  refresh(): void {
    const data: GameViewData = this.game.getViewData();
    this.element.textContent = '';
    appendLine(this.element, `Score: ${data.score}`);
    appendLine(this.element, `Lives: ${data.lives}`);
    const currentArea = data.areas.find(
      (area) =>
        area.worldId === data.position.worldId &&
        area.areaId === data.position.areaId,
    );
    if (currentArea !== undefined) {
      renderArea(this.element, currentArea);
    }
  }
}
