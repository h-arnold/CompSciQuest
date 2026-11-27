// Shared deterministic boot setup for the UI red tests. Keeps each test file
// focused on observable contracts rather than fixture plumbing.
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { GameViewData } from '../../src/application/GameViewData';
import type { LoadResult, SaveDto } from '../../src/application/SaveDto';
import type { SaveManager } from '../../src/application/SaveManager';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  FakeRandom,
  FixedClock,
  MemoryStorage,
  SAVE_KEY,
  makeBundle,
  makeEnvelope,
  makeRuntimeState,
} from './persistence';
import {
  FakeBus,
  RecordingGame,
  installFakeDocument,
  makeFakeDocument,
  makeViewData,
  type BootstrapDependencies,
  type FakeDocument,
} from './ui';

export interface BootSetupOptions {
  readonly loadResult?: LoadResult;
  readonly validateResult?: LoadResult;
  readonly storageEntries?: Readonly<Record<string, string>>;
  readonly importText?: string;
  readonly viewData?: GameViewData;
  readonly submitResult?: readonly GameEvent[];
  // Opt-in: mirror the real façade by publishing submitResult on the bus when
  // submit() is called. Off by default so inherited boot tests keep their
  // returned-batch rendering path.
  readonly publishOnSubmit?: boolean;
  readonly onNewGame?: () => void;
  readonly onRestart?: () => void;
  readonly appPresent?: boolean;
  readonly validate?: (bundle: ContentBundle) => readonly string[];
}

export class FakeSaveManager implements SaveManager {
  private readonly storage: MemoryStorage;

  loadResult: LoadResult;
  validateResult: LoadResult;
  readonly loadCalls: number[] = [];
  readonly validateTexts: string[] = [];

  constructor(storage: MemoryStorage, options: BootSetupOptions) {
    this.storage = storage;
    this.loadResult = options.loadResult ?? {
      ok: false,
      reason: 'invalid-json',
    };
    this.validateResult = options.validateResult ?? {
      ok: false,
      reason: 'invalid-json',
    };
  }

  buildDto(state: GameStateDto): SaveDto {
    return makeEnvelope(state);
  }

  save(state: GameStateDto): void {
    this.storage.write(SAVE_KEY, JSON.stringify(this.buildDto(state)));
  }

  load(): LoadResult {
    this.loadCalls.push(this.loadCalls.length + 1);
    return this.loadResult;
  }

  validate(text: string): LoadResult {
    this.validateTexts.push(text);
    return this.validateResult;
  }

  restore(dto: SaveDto): GameState {
    return makeRuntimeState(dto.state);
  }
}

export interface DownloadCall {
  readonly filename: string;
  readonly text: string;
}

export interface BootSetup {
  readonly page: FakeDocument;
  readonly bus: FakeBus;
  readonly storage: MemoryStorage;
  readonly saveManager: FakeSaveManager;
  readonly game: RecordingGame;
  readonly bundle: ContentBundle;
  readonly downloads: DownloadCall[];
  readonly openFileCalls: number[];
  readonly dependencies: BootstrapDependencies;
}

export function makeBootSetup(options: BootSetupOptions = {}): BootSetup {
  const page = installFakeDocument(
    makeFakeDocument(options.appPresent ?? true),
  );
  const bus = new FakeBus();
  bus.overlayPresent = () => Boolean(page.body.querySelector('.title-overlay'));
  const storage = new MemoryStorage(options.storageEntries ?? {});
  const clock = new FixedClock();
  const bundle = makeBundle();
  const saveManager = new FakeSaveManager(storage, options);
  const game = new RecordingGame({
    viewData: options.viewData ?? makeViewData(),
    submitResult: options.submitResult ?? [],
    ...(options.publishOnSubmit && {
      onSubmit: (_raw: string, events: readonly GameEvent[]): void => {
        bus.publish(events);
      },
    }),
    // Game owns import interception (application-and-ui.md §4): the facade's
    // importSave result is the single source of the status message, so the
    // configured failure must be the same one the save-manager fake returns.
    ...(options.validateResult && { importResult: options.validateResult }),
    ...(options.onNewGame && { onNewGame: options.onNewGame }),
    ...(options.onRestart && { onRestart: options.onRestart }),
  });
  const downloads: DownloadCall[] = [];
  const openFileCalls: number[] = [];

  const dependencies: BootstrapDependencies = {
    clock,
    storage,
    saveManager,
    bus,
    bundle,
    random: new FakeRandom(),
    game,
    downloadFile(filename: string, text: string): void {
      downloads.push({ filename, text });
    },
    async openSaveFile(): Promise<string> {
      openFileCalls.push(openFileCalls.length + 1);
      return options.importText ?? '{}';
    },
  };
  if (options.validate !== undefined) {
    return {
      page,
      bus,
      storage,
      saveManager,
      game,
      bundle,
      downloads,
      openFileCalls,
      dependencies: { ...dependencies, validate: options.validate },
    };
  }
  return {
    page,
    bus,
    storage,
    saveManager,
    game,
    bundle,
    downloads,
    openFileCalls,
    dependencies,
  };
}
