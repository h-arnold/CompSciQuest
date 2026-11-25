// Bounded command history and input (application-and-ui.md §7.2). The Terminal
// owns only input and history; echoing, meta interception and batch rendering
// are supplied by GameWindow as one callback.
const HISTORY_LIMIT = 50;

export class Terminal {
  private readonly input: HTMLInputElement;
  private readonly onCommand: (raw: string) => void;
  private readonly history: string[] = [];
  private cursor = 0;
  readonly element: HTMLElement;

  constructor(onCommand: (raw: string) => void) {
    this.onCommand = onCommand;
    this.element = document.createElement('div');
    this.element.className = 'terminal';
    this.input = document.createElement('input');
    this.input.setAttribute('aria-label', 'Command');
    this.input.addEventListener('keydown', (event) => {
      this.handleKey(event);
    });
    this.element.append(this.input);
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const raw = this.input.value;
      this.input.value = '';
      this.history.push(raw);
      if (this.history.length > HISTORY_LIMIT) {
        this.history.shift();
      }
      this.cursor = this.history.length;
      this.onCommand(raw);
      return;
    }
    if (event.key === 'ArrowUp') {
      this.cursor = Math.max(0, this.cursor - 1);
      const entry = this.history[this.cursor];
      if (entry !== undefined) {
        this.input.value = entry;
      }
      return;
    }
    if (event.key !== 'ArrowDown') {
      return;
    }
    this.cursor = Math.min(this.history.length, this.cursor + 1);
    this.input.value = this.history[this.cursor] ?? '';
  }
}
