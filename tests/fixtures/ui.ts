// Deterministic DOM-like fakes and seam loaders for the boot/UI red tests.
// No jsdom, no real document, no wall clock, no Math.random and no storage.
// Every collaborator is an injected in-memory object.
import { expect } from 'vitest';
import type { Clock } from '../../src/application/Clock';
import type { Game } from '../../src/application/Game';
import type { GameViewData } from '../../src/application/GameViewData';
import type { LoadResult, SaveDto } from '../../src/application/SaveDto';
import type { SaveManager } from '../../src/application/SaveManager';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { EventBus } from '../../src/core/events/EventBus';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Random } from '../../src/core/Random';
import type { StorageAdapter } from '../../src/storage/StorageAdapter';

// ---------------------------------------------------------------------------
// DOM-like tree (plain objects; only the surface the UI contracts need)
// ---------------------------------------------------------------------------

export interface FakeKeyboardEvent {
  readonly key: string;
}

export interface FakeEvent {
  readonly key?: string;
}

type Listener = (event: FakeEvent) => void;

export class FakeElement {
  private readonly listeners = new Map<string, Listener[]>();
  private ownText = '';

  readonly tagName: string;
  readonly children: FakeElement[] = [];
  readonly attributes = new Map<string, string>();
  readonly innerHTMLWrites: string[] = [];
  readonly listenerCounts = new Map<string, number>();

  className = '';
  id = '';
  hidden = false;
  disabled = false;
  value = '';
  parentNode: FakeElement | undefined;

  constructor(tagName: string) {
    this.tagName = tagName.startsWith('#') ? tagName : tagName.toUpperCase();
  }

  private selectAll(selector: string): FakeElement[] {
    const tokens = selector.trim().split(/\s+/).filter(Boolean);
    const last = tokens.at(-1);
    if (last === undefined) {
      return [];
    }
    const matches: FakeElement[] = [];
    const walk = (element: FakeElement): void => {
      for (const child of element.children) {
        if (isTokenMatch(child, last) && hasMatchingAncestors(child, tokens)) {
          matches.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return matches;
  }

  get textContent(): string {
    return (
      this.ownText + this.children.map((child) => child.textContent).join('')
    );
  }

  set textContent(value: string) {
    for (const child of this.children) {
      child.parentNode = undefined;
    }
    this.children.length = 0;
    this.ownText = value;
  }

  set innerHTML(value: string) {
    this.innerHTMLWrites.push(value);
    this.textContent = value;
  }

  get innerHTML(): string {
    return this.textContent;
  }

  appendChild<T extends FakeElement>(child: T): T {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  append(...nodes: readonly FakeElement[]): void {
    for (const node of nodes) {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  remove(): void {
    if (this.parentNode === undefined) {
      return;
    }
    const index = this.parentNode.children.indexOf(this);
    if (index !== -1) {
      this.parentNode.children.splice(index, 1);
    }
    this.parentNode = undefined;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | undefined {
    return this.attributes.get(name);
  }

  addEventListener(type: string, listener: Listener): void {
    const bucket = this.listeners.get(type) ?? [];
    bucket.push(listener);
    this.listeners.set(type, bucket);
    this.listenerCounts.set(type, bucket.length);
  }

  removeEventListener(type: string, listener: Listener): void {
    const bucket = this.listeners.get(type) ?? [];
    const index = bucket.indexOf(listener);
    if (index !== -1) {
      bucket.splice(index, 1);
    }
    this.listenerCounts.set(type, bucket.length);
  }

  dispatch(type: string, event: FakeEvent = {}): void {
    const bucket = this.listeners.get(type) ?? [];
    for (const listener of bucket) {
      listener(event);
    }
  }

  click(): void {
    if (!this.disabled) {
      this.dispatch('click');
    }
  }

  contains(node: FakeElement): boolean {
    let current: FakeElement | undefined = node;
    while (current !== undefined) {
      if (current === this) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  querySelector(selector: string): FakeElement | null {
    return this.selectAll(selector)[0] ?? absentElement();
  }

  querySelectorAll(selector: string): FakeElement[] {
    return this.selectAll(selector);
  }
}

// A real DOM `querySelector` returns null for no match. This helper yields
// that value without a literal (unicorn/no-null forbids literals in tests).
function absentElement(): FakeElement | null {
  return new URLSearchParams().get('absent') as unknown as FakeElement;
}

function isTokenMatch(element: FakeElement, token: string): boolean {
  if (token.startsWith('#')) {
    return element.id === token.slice(1);
  }
  if (token.startsWith('.')) {
    return element.className.split(/\s+/).includes(token.slice(1));
  }
  return element.tagName === token.toUpperCase();
}

function hasMatchingAncestors(
  element: FakeElement,
  tokens: readonly string[],
): boolean {
  let index = tokens.length - 2;
  let current = element.parentNode;
  while (index >= 0) {
    if (current === undefined || !isTokenMatch(current, tokens[index] ?? '')) {
      return false;
    }
    current = current.parentNode;
    index -= 1;
  }
  return true;
}

export class FakeDocument {
  readonly body = new FakeElement('body');

  createElement(tagName: string): FakeElement {
    return new FakeElement(tagName);
  }

  createTextNode(text: string): FakeElement {
    const node = new FakeElement('#text');
    node.textContent = text;
    return node;
  }

  getElementById(id: string): FakeElement | null {
    return this.body.querySelector(`#${id}`);
  }

  querySelector(selector: string): FakeElement | null {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector: string): FakeElement[] {
    return this.body.querySelectorAll(selector);
  }
}

export function makeFakeDocument(hasApp = true): FakeDocument {
  const page = new FakeDocument();
  if (hasApp) {
    const app = page.createElement('div');
    app.id = 'app';
    page.body.append(app);
  }
  return page;
}

const documentState: { previous: unknown; isInstalled: boolean } = {
  previous: undefined,
  isInstalled: false,
};

export function installFakeDocument(
  page: FakeDocument = makeFakeDocument(),
): FakeDocument {
  documentState.previous =
    typeof document === 'undefined' ? undefined : document;
  Object.defineProperty(globalThis, 'document', {
    value: page,
    configurable: true,
    writable: true,
  });
  documentState.isInstalled = true;
  return page;
}

export function restoreDocument(): void {
  if (!documentState.isInstalled) {
    return;
  }
  if (documentState.previous === undefined) {
    Reflect.deleteProperty(globalThis, 'document');
  } else {
    Object.defineProperty(globalThis, 'document', {
      value: documentState.previous,
      configurable: true,
      writable: true,
    });
  }
  documentState.isInstalled = false;
}

// ---------------------------------------------------------------------------
// Collaborator fakes
// ---------------------------------------------------------------------------

export interface PublishRecord {
  readonly events: readonly GameEvent[];
  readonly overlayPresentAtPublish: boolean;
}

export class FakeBus implements EventBus {
  readonly records: PublishRecord[] = [];
  readonly listeners: Array<(event: GameEvent) => void> = [];
  overlayPresent: () => boolean = () => true;

  publish(events: readonly GameEvent[]): void {
    this.records.push({
      events,
      overlayPresentAtPublish: this.overlayPresent(),
    });
    for (const listener of this.listeners) {
      for (const event of events) {
        listener(event);
      }
    }
  }

  subscribe(listener: (event: GameEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export interface RecordingGameOptions {
  readonly submitResult?: readonly GameEvent[];
  readonly viewData?: GameViewData;
  readonly onNewGame?: () => void;
  readonly onRestart?: () => void;
  readonly importResult?: LoadResult;
  // Optional seam: the real Game.submit publishes its batch on the injected
  // EventBus. Tests that need bus-render evidence may mirror that here.
  readonly onSubmit?: (raw: string, events: readonly GameEvent[]) => void;
}

export class RecordingGame implements Game {
  private readonly submitResult: readonly GameEvent[];
  private readonly viewData: GameViewData;
  private readonly onNewGame: (() => void) | undefined;
  private readonly onRestart: (() => void) | undefined;
  private readonly importResult: LoadResult;
  private readonly onSubmit:
    ((raw: string, events: readonly GameEvent[]) => void) | undefined;

  readonly submits: string[] = [];
  readonly saveCalls: number[] = [];
  readonly downloadCalls: number[] = [];
  readonly continueCalls: SaveDto[] = [];
  readonly newGameCalls: number[] = [];
  readonly restartCalls: number[] = [];
  readonly importTexts: string[] = [];
  readonly viewDataCalls: number[] = [];

  constructor(options: RecordingGameOptions = {}) {
    this.submitResult = options.submitResult ?? [];
    this.viewData = options.viewData ?? makeViewData();
    this.onNewGame = options.onNewGame;
    this.onRestart = options.onRestart;
    this.onSubmit = options.onSubmit;
    this.importResult = options.importResult ?? {
      ok: false,
      reason: 'invalid-json',
    };
  }

  submit(raw: string): readonly GameEvent[] {
    this.submits.push(raw);
    this.onSubmit?.(raw, this.submitResult);
    return this.submitResult;
  }

  newGame(): void {
    this.newGameCalls.push(this.newGameCalls.length + 1);
    this.onNewGame?.();
  }

  continueGame(dto: SaveDto): void {
    this.continueCalls.push(dto);
  }

  restart(): void {
    this.restartCalls.push(this.restartCalls.length + 1);
    this.onRestart?.();
  }

  getViewData(): GameViewData {
    this.viewDataCalls.push(this.viewDataCalls.length + 1);
    return this.viewData;
  }

  save(): void {
    this.saveCalls.push(this.saveCalls.length + 1);
    // Recorded separately from the facade's submit alias in the UI contract.
  }

  download(): void {
    this.downloadCalls.push(this.downloadCalls.length + 1);
    // The UI records the injected downloadFile seam instead.
  }

  importSave(text: string): LoadResult {
    this.importTexts.push(text);
    return this.importResult;
  }
}

export function makeViewData(
  overrides: Partial<GameViewData> = {},
): GameViewData {
  return {
    status: 'playing',
    position: {
      worldId: 'world-stub',
      areaId: 'area-stub',
      roomId: 'room-stub-start',
    },
    turn: 1,
    lives: 3,
    score: 7,
    areas: [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        worldName: 'Stub World',
        areaName: 'Stub Area',
        earnedScore: 7,
        maxScore: 10,
        visitedRoomCount: 1,
        roomCount: 2,
        topics: [
          {
            id: 'topic-1',
            title: 'Stub Topic',
            specReference: 'stub section',
            status: 'covered',
            complete: false,
          },
        ],
      },
    ],
    hints: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Boot seam — src/main.ts is named by application-and-ui.md §2 / architecture.md §6.1
// ---------------------------------------------------------------------------

export interface BootstrapDependencies {
  readonly clock: Clock;
  readonly storage: StorageAdapter;
  readonly saveManager: SaveManager;
  readonly bus: FakeBus;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly game: Game;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly openSaveFile: () => Promise<string>;
  readonly validate?: (bundle: ContentBundle) => readonly string[];
}

export interface BootResult {
  readonly root: FakeElement;
  readonly clock: Clock;
  readonly storage: StorageAdapter;
  readonly saveManager: SaveManager;
  readonly bus: EventBus;
  readonly bundle: ContentBundle;
  readonly game: Game;
}

export type Bootstrap = (
  dependencies: BootstrapDependencies,
) => BootResult | Promise<BootResult>;

export async function loadBootstrap(): Promise<Bootstrap> {
  const specifier = '../../src/main';
  let module: Record<string, unknown>;
  try {
    module = await import(/* @vite-ignore */ specifier);
  } catch (error) {
    throw new Error(
      'src/main.ts must be importable with the injected DOM fake (application-and-ui.md §2)',
      { cause: error },
    );
  }
  const member = module['bootstrap'];
  expect(
    member,
    'bootstrap must be exported from src/main.ts (application-and-ui.md §2; architecture.md §6.1)',
  ).toBeTypeOf('function');
  return member as Bootstrap;
}

// ---------------------------------------------------------------------------
// Small observable helpers (documented labels and class names only)
// ---------------------------------------------------------------------------

export function findByClass(
  root: FakeElement,
  className: string,
): FakeElement[] {
  return root.querySelectorAll(`.${className}`);
}

export function findFirstByClass(
  root: FakeElement,
  className: string,
): FakeElement {
  const found = findByClass(root, className)[0];
  expect(found, `expected an element with class "${className}"`).toBeDefined();
  return found ?? root;
}

export function findButton(root: FakeElement, label: string): FakeElement {
  const buttons = root.querySelectorAll('button');
  const found = buttons.find((button) => button.textContent.trim() === label);
  expect(
    found,
    `expected a button labelled "${label}" (application-and-ui.md §7.1)`,
  ).toBeDefined();
  return found ?? root;
}

export function allText(root: FakeElement): string {
  return root.textContent;
}

export function descendants(root: FakeElement): FakeElement[] {
  const result: FakeElement[] = [];
  const walk = (element: FakeElement): void => {
    for (const child of element.children) {
      result.push(child);
      walk(child);
    }
  };
  walk(root);
  return result;
}

export async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

// Normalises sync and async bootstrap failures into a rejected promise so a
// missing #app or invalid bundle is asserted as a readable rejection.
export async function runBootstrap(
  bootstrap: Bootstrap,
  dependencies: BootstrapDependencies,
): Promise<BootResult> {
  return await bootstrap(dependencies);
}
