// Meta-action buttons (application-and-ui.md §4.1, §7.1, §7.2). All buttons
// share the same action object as typed meta aliases, so button and terminal
// behave identically. The copy table lives in loadFailureMessage.ts.
export interface SaveActions {
  save(): void;
  load(): void;
  download(): void;
  openImport(): Promise<void>;
  restart(): void;
  downloadQuarantine(): void;
  setStatus(message: string): void;
}

export class SaveControls {
  readonly element: HTMLElement;

  constructor(actions: SaveActions) {
    this.element = document.createElement('div');
    this.element.className = 'save-controls';
    this.addButton('Save', () => {
      actions.save();
    });
    this.addButton('Load', () => {
      actions.load();
    });
    this.addButton('Download', () => {
      actions.download();
    });
    this.addButton('Import', () => {
      void actions.openImport();
    });
    this.addButton('Restart', () => {
      actions.restart();
    });
    this.addButton('Download quarantined save', () => {
      actions.downloadQuarantine();
    });
  }

  private addButton(label: string, handler: () => void): void {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', handler);
    this.element.append(button);
  }
}
