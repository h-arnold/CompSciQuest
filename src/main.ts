// Boot sequence from application-and-ui.md §2 / architecture.md §6.1. Every
// collaborator is injected; the module itself performs no work at import time.
import './ui/style.css';
import type { Clock } from './application/Clock';
import { createGame } from './application/Game';
import type { Game } from './application/Game';
import { createSaveManager } from './application/SaveManager';
import type { SaveManager } from './application/SaveManager';
import type { ContentBundle } from './content/ContentBundle';
import { loadContent } from './content/index';
import { validateContent } from './content/validateContent';
import { createEventBus } from './core/events/EventBus';
import type { EventBus } from './core/events/EventBus';
import type { Random } from './core/Random';
import { BrowserStorage } from './storage/BrowserStorage';
import type { StorageAdapter } from './storage/StorageAdapter';
import { GameWindow } from './ui/GameWindow';

interface BootstrapDependencies {
  readonly clock: Clock;
  readonly storage: StorageAdapter;
  readonly saveManager: SaveManager;
  readonly bus: EventBus;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly game: Game;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly openSaveFile: () => Promise<string>;
  readonly validate?: (bundle: ContentBundle) => readonly string[];
}

interface BootResult {
  readonly root: HTMLElement;
  readonly clock: Clock;
  readonly storage: StorageAdapter;
  readonly saveManager: SaveManager;
  readonly bus: EventBus;
  readonly bundle: ContentBundle;
  readonly game: Game;
}

export function bootstrap(dependencies: BootstrapDependencies): BootResult {
  const root = document.querySelector<HTMLElement>('#app') ?? undefined;
  if (root === undefined) {
    throw new Error('Missing #app element (application-and-ui.md §2)');
  }

  const validate: (bundle: ContentBundle) => readonly string[] =
    dependencies.validate ?? validateContent;
  const problems = validate(dependencies.bundle);
  if (problems.length > 0) {
    throw new Error(`Invalid content bundle:\n${problems.join('\n')}`);
  }

  const loadResult = dependencies.saveManager.load();
  const windowElement = new GameWindow({
    game: dependencies.game,
    bundle: dependencies.bundle,
    bus: dependencies.bus,
    storage: dependencies.storage,
    clock: dependencies.clock,
    loadResult,
    downloadFile: dependencies.downloadFile,
    openSaveFile: dependencies.openSaveFile,
  });
  root.append(windowElement.element);

  return {
    root,
    clock: dependencies.clock,
    storage: dependencies.storage,
    saveManager: dependencies.saveManager,
    bus: dependencies.bus,
    bundle: dependencies.bundle,
    game: dependencies.game,
  };
}

// Concrete ports for the shipped static site. All browser APIs are reached
// through these seams; no top-level work happens until the guard below runs.
function systemClock(): Clock {
  return {
    now(): string {
      return new Date().toISOString();
    },
  };
}

// Deterministic PRNG (shared-rules.md §7 keeps randomness outside core). It is
// seeded from a fixed constant, never Math.random or the wall clock.
function seededRandom(): Random {
  let state = 2_654_435_769;
  return {
    nextInt(maxExclusive: number): number {
      if (maxExclusive <= 0) {
        return 0;
      }
      state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
      return state % maxExclusive;
    },
  };
}

function browserDownload(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function browserOpenSaveFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file === undefined) {
        reject(new Error('No save file was selected.'));
        return;
      }
      void file.text().then(resolve).catch(reject);
    });
    input.click();
  });
}

// Composition root: §6.1 names src/main.ts as bootstrap, so the real wiring
// lives here and index.html keeps pointing at this module. The guard keeps the
// exported seam importable in Node/Vitest, where no browser window exists.
function startBrowserApp(): void {
  const clock = systemClock();
  const storage = new BrowserStorage();
  const bundle = loadContent();
  const saveManager = createSaveManager({ storage, clock, bundle });
  const bus = createEventBus();
  const random = seededRandom();
  const game = createGame({
    saveManager,
    storage,
    clock,
    bundle,
    random,
    bus,
    downloadFile: browserDownload,
  });
  bootstrap({
    clock,
    storage,
    saveManager,
    bus,
    bundle,
    random,
    game,
    downloadFile: browserDownload,
    openSaveFile: browserOpenSaveFile,
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  startBrowserApp();
}
