// Shared text-only line writer (architecture.md §8). Every visible string is
// assigned through textContent; no HTML is ever built from game data.
export function appendLine(parent: HTMLElement, text: string): void {
  const line = document.createElement('div');
  line.textContent = text;
  parent.append(line);
}
