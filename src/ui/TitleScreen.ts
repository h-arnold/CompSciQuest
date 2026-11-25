// Title overlay (application-and-ui.md §2, §7.1). Continue is enabled only for
// a boot-time valid save; the overlay is dismissed by GameWindow after the first
// published batch, not by the click itself.
export class TitleScreen {
  readonly element: HTMLElement;

  constructor(
    canContinue: boolean,
    onContinue: () => void,
    onNewGame: () => void,
  ) {
    this.element = document.createElement('div');
    this.element.className = 'title-overlay';

    const heading = document.createElement('h1');
    heading.textContent = 'CompSciQuest';
    this.element.append(heading);

    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.disabled = !canContinue;
    continueButton.addEventListener('click', onContinue);

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.addEventListener('click', onNewGame);

    this.element.append(continueButton, newGameButton);
  }
}
