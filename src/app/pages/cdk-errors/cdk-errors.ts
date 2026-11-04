import { Component, computed, inject, Injector, signal, viewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkTrapFocus, FocusKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { FocusableItem } from '../../shared/bad/focusable-item';
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
 * WERSJA Z CELOWYMI BŁĘDAMI – Angular CDK A11y.
 * Oznaczenia C1–C11 odpowiadają tabeli na stronie Start.
 */
@Component({
  selector: 'app-cdk-errors',
  imports: [RouterLink, CdkTrapFocus, FocusableItem],
  templateUrl: './cdk-errors.html',
  styleUrls: ['../cdk-common.css', './cdk-errors.css'],
})
export class CdkErrors {
  private readonly announcer = inject(LiveAnnouncer);

  /* ---------- 1. Dialog ---------- */
  protected readonly files = signal<FileItem[]>([...INITIAL_FILES]);
  protected readonly fileToDelete = signal<FileItem | null>(null);

  protected confirmDelete(): void {
    const f = this.fileToDelete();
    if (!f) {
      return;
    }
    this.files.update((list) => list.filter((x) => x.id !== f.id));
    // C2: dialog znika razem z wierszem; cdkTrapFocus próbuje oddać fokus
    // przyciskowi, którego już nie ma, więc fokus ląduje na <body>.
    this.fileToDelete.set(null);
  }

  protected resetFiles(): void {
    this.files.set([...INITIAL_FILES]);
  }

  /* ---------- 2. Menu ---------- */
  protected readonly menuItems = ['Edytuj', 'Duplikuj', 'Archiwizuj', 'Usuń'];
  protected readonly menuOpen = signal(false);
  protected readonly menuChoice = signal('');

  private readonly items = viewChildren(FocusableItem);
  private readonly km = new FocusKeyManager(this.items, inject(Injector)).withWrap();

  protected toggleMenu(): void {
    this.menuOpen.update((o) => !o);
    // C5: menedżer wywołany, zanim lista została wyrenderowana – fokus nigdzie nie trafia
    this.km.setFirstItemActive();
  }

  protected onMenuKey(e: KeyboardEvent): void {
    // C3: nie obsługujemy tabOut ani Escape; menu zostaje otwarte
    this.km.onKeydown(e);
  }

  protected chooseItem(item: string): void {
    this.menuChoice.set(`Wybrano: ${item}`);
    // C4: menu znika razem z elementem, który miał fokus; fokus ląduje na <body>
    this.menuOpen.set(false);
  }

  /* ---------- 3. Regiony aria-live ---------- */
  // C6: kontener role="status" jest wstawiany razem z tekstem
  protected readonly statusText = signal('');
  protected saveChanges(): void {
    this.statusText.set('Zmiany zostały zapisane.');
  }
  protected clearStatus(): void {
    this.statusText.set('');
  }

  // C7: ta sama informacja trafia do live region i do LiveAnnouncer
  protected readonly cartCount = signal(0);
  protected readonly cartText = signal('');
  protected addToCart(): void {
    this.cartCount.update((n) => n + 1);
    const text = `Dodano do koszyka. Liczba pozycji: ${this.cartCount()}.`;
    this.cartText.set(text);
    this.announcer.announce(text, 'polite');
  }

  // C8: ogłoszenie na każdy znak, assertive, bez debouncingu
  protected readonly query = signal('');
  protected readonly results = computed(() => {
    const q = this.query().trim().toLowerCase();
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  });
  protected onSearch(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.announcer.announce(`Znaleziono ${resultsLabel(this.results().length)}`, 'assertive');
  }

  // C9: toast znika sam po 3 sekundach, nie można go zatrzymać
  protected readonly toast = signal('');
  protected showToast(): void {
    this.toast.set('Szkic został zapisany.');
    setTimeout(() => this.toast.set(''), 3000);
  }

  /* ---------- 4. Lista z @for ---------- */
  protected readonly tasks = signal<Task[]>([
    { id: 1, title: 'Przygotować audyt', done: false },
    { id: 2, title: 'Zrobić testy z czytnikiem', done: false },
    { id: 3, title: 'Opisać wyniki', done: false },
  ]);

  protected toggleTask(id: number): void {
    // Niemutowalna aktualizacja tworzy NOWY obiekt dla zmienionego zadania
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  /* ---------- 5. Ukryty panel ---------- */
  protected readonly panelOpen = signal(false);
  protected togglePanel(): void {
    this.panelOpen.update((o) => !o);
  }
}
