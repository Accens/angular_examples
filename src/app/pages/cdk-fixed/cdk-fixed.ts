import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FocusKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialog } from '../../shared/good/confirm-dialog';
import { MenuItem } from '../../shared/good/menu-item';
import { FRUITS, resultsLabel } from '../../shared/plural';

interface FileItem {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  done: boolean;
}

const INITIAL_FILES: FileItem[] = [
  { id: 1, name: 'raport.pdf' },
  { id: 2, name: 'budzet.xlsx' },
  { id: 3, name: 'notatki.txt' },
];

/**
 * WERSJA POPRAWIONA – Angular CDK A11y.
 * Oznaczenia C1–C11 odpowiadają poprawkom błędów ze strony "CDK – błędy".
 */
@Component({
  selector: 'app-cdk-fixed',
  imports: [RouterLink, MenuItem],
  templateUrl: './cdk-fixed.html',
  styleUrls: ['../cdk-common.css'],
})
export class CdkFixed {
  private readonly injector = inject(Injector);
  private readonly dialog = inject(Dialog);
  private readonly announcer = inject(LiveAnnouncer);

  /* ---------- 1. Dialog ---------- */
  protected readonly files = signal<FileItem[]>([...INITIAL_FILES]);
  private readonly filesHeading = viewChild.required<ElementRef<HTMLElement>>('filesHeading');

  protected openDeleteDialog(file: FileItem, trigger: HTMLElement): void {
    // C1: Dialog z @angular/cdk/dialog: rola, aria-modal, nazwa/opis, pułapka fokusu, Escape
    const ref = this.dialog.open<boolean>(ConfirmDialog, {
      role: 'alertdialog',
      // aria-modal nie jest domyślnie włączony w CDK Dialog, więc ustawiamy go jawnie
      ariaModal: true,
      ariaLabelledBy: 'confirm-title',
      ariaDescribedBy: 'confirm-desc',
      // C2: fokus oddajemy sami, bo przycisk otwierający może zniknąć razem z wierszem
      restoreFocus: false,
      data: {
        title: `Usunąć plik „${file.name}”?`,
        description: 'Tej operacji nie można cofnąć. To jest demonstracja, więc plik wróci po odświeżeniu listy.',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (!confirmed) {
        trigger.focus();
        return;
      }
      const index = this.files().findIndex((f) => f.id === file.id);
      this.files.update((list) => list.filter((f) => f.id !== file.id));
      this.announcer.announce(`Plik ${file.name} został usunięty.`, 'polite');
      // C2: po usunięciu fokus przechodzi na kolejny wiersz albo na nagłówek listy
      afterNextRender(
        () => {
          const buttons = document.querySelectorAll<HTMLElement>('[data-delete-button]');
          const target = buttons[Math.min(index, buttons.length - 1)] ?? this.filesHeading().nativeElement;
          target.focus();
        },
        { injector: this.injector },
      );
    });
  }

  protected resetFiles(): void {
    this.files.set([...INITIAL_FILES]);
  }

  /* ---------- 2. Menu ---------- */
  protected readonly menuItems = ['Edytuj', 'Duplikuj', 'Archiwizuj', 'Usuń'];
  protected readonly menuOpen = signal(false);
  protected readonly menuChoice = signal('');

  private readonly menuTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('menuTrigger');
  private readonly items = viewChildren(MenuItem);
  private readonly km = new FocusKeyManager(this.items, this.injector)
    .withWrap()
    .withVerticalOrientation()
    .withHomeAndEnd()
    .withTypeAhead(300);

  constructor() {
    // C3: Tab zamyka menu i oddaje fokus przyciskowi, więc kolejny Tab przechodzi dalej
    this.km.tabOut.pipe(takeUntilDestroyed()).subscribe(() => this.closeMenu(true));
  }

  protected toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu(true);
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.menuOpen.set(true);
    // C5: fokus przenosimy dopiero po wyrenderowaniu listy
    afterNextRender(() => this.km.setFirstItemActive(), { injector: this.injector });
  }

  private closeMenu(returnFocus: boolean): void {
    this.menuOpen.set(false);
    if (returnFocus) {
      this.menuTrigger().nativeElement.focus();
    }
  }

  protected onTriggerKey(e: KeyboardEvent): void {
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !this.menuOpen()) {
      e.preventDefault();
      this.openMenu();
    }
  }

  protected onMenuKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeMenu(true);
      return;
    }
    this.km.onKeydown(e);
  }

  protected onMenuFocusOut(e: FocusEvent): void {
    const next = e.relatedTarget as Node | null;
    const wrap = e.currentTarget as HTMLElement;
    if (this.menuOpen() && next && !wrap.contains(next)) {
      this.closeMenu(false);
    }
  }

  protected chooseItem(item: string): void {
    this.menuChoice.set(`Wybrano: ${item}`);
    // C4: po wyborze fokus wraca do przycisku otwierającego menu
    this.closeMenu(true);
  }

  /* ---------- 3. Regiony aria-live ---------- */
  // C6: kontener role="status" istnieje stale, a zmienia się tylko jego zawartość
  protected readonly statusText = signal('');
  protected saveChanges(): void {
    this.statusText.set('Zmiany zostały zapisane.');
  }
  protected clearStatus(): void {
    this.statusText.set('');
  }

  // C7: jeden mechanizm ogłaszania: stały region (bez LiveAnnouncer dla tego samego tekstu)
  protected readonly cartCount = signal(0);
  protected readonly cartText = signal('');
  protected addToCart(): void {
    this.cartCount.update((n) => n + 1);
    this.cartText.set(`Dodano do koszyka. Liczba pozycji: ${this.cartCount()}.`);
  }

  // C8: ogłoszenie po 500 ms przerwy w pisaniu, politeness "polite"
  protected readonly query = signal('');
  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  });
  private searchTimer?: ReturnType<typeof setTimeout>;
  protected onSearch(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.announcer.announce(`Znaleziono ${resultsLabel(this.results().length)}`, 'polite');
    }, 500);
  }

  // C6 + C9: stały region; toast zostaje do ręcznego zamknięcia
  protected readonly toastVisible = signal(false);
  protected showToast(): void {
    this.toastVisible.set(true);
  }
  protected dismissToast(): void {
    this.toastVisible.set(false);
  }

  /* ---------- 4. Lista z @for ---------- */
  protected readonly tasks = signal<Task[]>([
    { id: 1, title: 'Przygotować audyt', done: false },
    { id: 2, title: 'Zrobić testy z czytnikiem', done: false },
    { id: 3, title: 'Opisać wyniki', done: false },
  ]);

  protected toggleTask(id: number): void {
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  /* ---------- 5. Ukryty panel ---------- */
  protected readonly panelOpen = signal(false);
  protected togglePanel(): void {
    this.panelOpen.update((o) => !o);
  }
}
