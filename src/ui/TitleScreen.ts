// Title overlay (application-and-ui.md §2, §7.1). Continue is enabled only for
// a boot-time valid save; the overlay is dismissed by GameWindow after the first
// published batch, not by the click itself.
export interface TitleCopy {
  readonly objective: string;
  readonly controls: string;
}

// Code-owned orientation copy (PLAYTEST-assistance-ward.md finding 10).
// GameWindow shares these exact strings to seed the boot transcript.
export const DEFAULT_TITLE_COPY: TitleCopy = {
  objective:
    'The register marks your attention not satisfied. Pass the Assistance Ward orientation and the mark can be cleared.',
  controls:
    'Use plain commands: look, examine, take and a direction such as east. Ask someone about what you can see, or type help for the full list.',
};

export class TitleScreen {
  readonly element: HTMLElement;

  constructor(
    canContinue: boolean,
    onContinue: () => void,
    onNewGame: () => void,
    copy: TitleCopy = DEFAULT_TITLE_COPY,
  ) {
    this.element = document.createElement('div');
    this.element.className = 'title-overlay';

    const heading = document.createElement('h1');
    heading.textContent = 'CompSciQuest';
    this.element.append(heading);

    const objective = document.createElement('p');
    objective.className = 'title-objective';
    objective.textContent = copy.objective;

    const controls = document.createElement('p');
    controls.className = 'title-controls';
    controls.textContent = copy.controls;

    const helpPrompt = document.createElement('p');
    helpPrompt.className = 'title-help-prompt';
    helpPrompt.textContent = 'Type help to see available commands.';

    this.element.append(objective, controls, helpPrompt);

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
