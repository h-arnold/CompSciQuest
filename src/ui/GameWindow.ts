// Window chrome and single mount point for all views (application-and-ui.md
// §2, §7.1). Panels are created once and toggled, never destroyed mid-turn.
import type { Clock } from '../application/Clock';
import type { Game } from '../application/Game';
import type { LoadResult } from '../application/SaveDto';
import type { ContentBundle } from '../content/ContentBundle';
import type { EventBus } from '../core/events/EventBus';
import type { GameEvent } from '../core/events/GameEvent';
import type { StorageAdapter } from '../storage/StorageAdapter';
import { appendMarkdownInline } from './appendMarkdown';
import { ConversationPanel } from './ConversationPanel';
import { formatEvent } from './formatEvent';
import { HintPanel } from './HintPanel';
import { loadFailureMessage } from './loadFailureMessage';
import { OutputLog } from './OutputLog';
import { QuizPanel } from './QuizPanel';
import { SaveControls, type SaveActions } from './SaveControls';
import { ScorePanel } from './ScorePanel';
import { Terminal } from './Terminal';
import { DEFAULT_TITLE_COPY, TitleScreen } from './TitleScreen';

export interface GameWindowDependencies {
  readonly game: Game;
  readonly bundle: ContentBundle;
  readonly bus: EventBus;
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly loadResult: LoadResult;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly openSaveFile: () => Promise<string>;
}

export class GameWindow {
  private readonly game: Game;
  private readonly bundle: ContentBundle;
  private readonly loadResult: LoadResult;
  private readonly actions: SaveActions;
  private readonly outputLog = new OutputLog();
  private readonly conversationPanel = new ConversationPanel();
  private readonly quizPanel = new QuizPanel();
  private readonly hintPanel = new HintPanel();
  private readonly scorePanel: ScorePanel;
  private readonly workspace: HTMLElement;
  private readonly statusElement: HTMLElement;
  private readonly titleScreen: TitleScreen;
  private overlayDismissed = false;
  private publishCount = 0;
  readonly element: HTMLElement;

  constructor(dependencies: GameWindowDependencies) {
    this.game = dependencies.game;
    this.bundle = dependencies.bundle;
    this.loadResult = dependencies.loadResult;

    // Batch E1: objective and controls open the transcript before any published
    // batch, so the player never sees an empty log (application-and-ui.md §2).
    this.outputLog.appendPlain([
      DEFAULT_TITLE_COPY.objective,
      DEFAULT_TITLE_COPY.controls,
    ]);

    this.element = document.createElement('div');
    this.element.className = 'window';

    const titlebar = document.createElement('div');
    titlebar.className = 'titlebar';
    const title = document.createElement('span');
    title.textContent = 'CompSciQuest';
    this.statusElement = document.createElement('span');
    this.statusElement.className = 'save-status';
    titlebar.append(title, this.statusElement);

    this.actions = this.makeActions(dependencies.openSaveFile);
    this.scorePanel = new ScorePanel(this.game);
    this.workspace = document.createElement('div');
    this.workspace.className = 'workspace';
    this.workspace.hidden = true;
    this.mountWorkspace();

    this.titleScreen = new TitleScreen(
      this.loadResult.ok,
      () => {
        this.continueGame();
      },
      () => {
        this.game.newGame();
      },
    );
    this.element.append(titlebar, this.workspace, this.titleScreen.element);

    dependencies.bus.subscribe((event) => {
      this.publishCount += 1;
      this.renderBatch([event]);
      this.dismissOverlayAfterFirstBatch();
    });
    this.refreshPanels();
  }

  private mountWorkspace(): void {
    const terminal = new Terminal((raw) => {
      this.handleCommand(raw);
    });
    const main = document.createElement('main');
    main.append(
      this.outputLog.element,
      this.conversationPanel.element,
      this.quizPanel.element,
      this.hintPanel.element,
      terminal.element,
    );
    const aside = document.createElement('aside');
    aside.append(
      this.scorePanel.element,
      new SaveControls(this.actions).element,
    );
    this.workspace.append(main, aside);
  }

  private makeActions(openSaveFile: () => Promise<string>): SaveActions {
    const setStatus = (message: string): void => {
      this.statusElement.textContent = message;
    };
    return {
      setStatus,
      save: () => {
        this.game.submit('save');
      },
      load: () => {
        this.game.submit('load');
      },
      download: () => {
        this.game.submit('download');
      },
      openImport: async (): Promise<void> => {
        try {
          const text = await openSaveFile();
          // The façade's import result is the single source for status copy.
          const result = this.game.importSave(text);
          setStatus(
            result.ok ? 'Game imported.' : loadFailureMessage(result.reason),
          );
        } catch {
          setStatus(loadFailureMessage('invalid-json'));
        }
      },
      restart: () => {
        this.game.restart();
      },
    };
  }

  private continueGame(): void {
    if (this.loadResult.ok) {
      this.game.continueGame(this.loadResult.dto);
    }
  }

  private handleCommand(raw: string): void {
    const lowered = raw.trim().toLowerCase();
    const isImport = lowered === 'import' || lowered.startsWith('import ');
    this.outputLog.appendPlain([`> ${isImport ? 'import' : raw}`]);
    this.outputLog.scrollToLatest();
    if (isImport) {
      void this.actions.openImport();
      return;
    }
    switch (lowered) {
      case 'save': {
        this.actions.save();
        return;
      }
      case 'load': {
        this.actions.load();
        return;
      }
      case 'download': {
        this.actions.download();
        return;
      }
      case 'restart': {
        this.actions.restart();
        return;
      }
      default: {
        break;
      }
    }
    const before = this.publishCount;
    const events = this.game.submit(raw);
    if (this.publishCount === before) {
      this.renderBatch(events);
    }
  }

  private renderBatch(events: readonly GameEvent[]): void {
    for (const event of events) {
      const lines = formatEvent(event, this.bundle);
      if (event.type === 'question-asked') {
        // The prompt is transcript prose (block channel); the numbered options
        // are short inline lines whose literal "1. " prefix is the answer cue
        // (application-and-ui.md §6.1, spec §4.5).
        const prompt = lines[0];
        if (prompt !== undefined) {
          this.outputLog.appendMarkdown([prompt]);
        }
        for (const option of lines.slice(1)) {
          appendMarkdownInline(this.outputLog.element, option);
        }
      } else {
        this.outputLog.appendMarkdown(lines);
      }
    }
    this.refreshPanels();
    this.outputLog.scrollToLatest();
  }

  private refreshPanels(): void {
    const data = this.game.getViewData();
    this.scorePanel.refresh();
    this.conversationPanel.refresh(data);
    this.quizPanel.refresh(data);
    this.hintPanel.refresh(data);
  }

  private dismissOverlayAfterFirstBatch(): void {
    if (this.overlayDismissed) {
      return;
    }
    this.overlayDismissed = true;
    this.titleScreen.element.remove();
    this.workspace.hidden = false;
    this.outputLog.scrollToLatest();
  }
}
