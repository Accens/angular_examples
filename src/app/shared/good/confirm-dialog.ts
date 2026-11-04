import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmData {
  title: string;
  description: string;
}

/**
 * Zawartość dialogu otwieranego przez Dialog z @angular/cdk/dialog.
 * Kontener CDK dostarcza pułapkę fokusu, role/aria-modal i zamknięcie klawiszem Escape.
 * Nazwę i opis dialogu przekazujemy w konfiguracji (ariaLabelledBy / ariaDescribedBy).
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 id="confirm-title">{{ data.title }}</h2>
    <p id="confirm-desc">{{ data.description }}</p>
    <div class="btn-row">
      <!-- Fokus początkowy na bezpiecznej akcji, a nie na przycisku destrukcyjnym -->
      <button type="button" class="btn btn-secondary" cdkFocusInitial (click)="ref.close(false)">
        Anuluj
      </button>
      <button type="button" class="btn" (click)="ref.close(true)">Usuń</button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: min(26rem, 90vw);
      padding: 1.25rem 1.5rem;
      background: #fff;
      border: 2px solid var(--color-header-bg);
      border-radius: 8px;
    }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; }
    p { margin: 0 0 0.5rem; }
  `,
})
export class ConfirmDialog {
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
  protected readonly data = inject<ConfirmData>(DIALOG_DATA);
}
