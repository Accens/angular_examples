import { AfterViewInit, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/**
 * Poprawiona kontrolka tekstowa (ControlValueAccessor):
 *  - unikalne id (#9), natywny <input> w środku (#8),
 *  - <label for> wskazuje na wewnętrzny input, a nie na host (#8),
 *  - aria-invalid + aria-describedby powiązane z podpowiedzią i błędem (#4),
 *  - błąd jako tekst z ikoną, nie tylko kolor (#5),
 *  - obsługa setDisabledState (#8) i readonly (#7).
 */
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.html',
})
export class TextField implements ControlValueAccessor, AfterViewInit {
  label = input.required<string>();
  inputId = input<string>();
  type = input<'text' | 'email' | 'tel'>('text');
  autocomplete = input<string>();
  hint = input<string>();
  readonly = input(false);
  errors = input<Record<string, string>>({});

  private readonly autoId = `text-field-${nextId++}`;
  protected get id(): string {
    return this.inputId() ?? this.autoId;
  }

  protected readonly value = signal('');
  protected readonly disabled = signal(false);

  private readonly ngControl = inject(NgControl, { self: true });
  private onChangeFn: (v: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  /** Zmienia się przy każdym zdarzeniu kontrolki (touched, status, wartość), co odświeża widok. */
  private readonly controlTick = signal(0);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    // Bez tego komponent nie wie, że rodzic wywołał markAllAsTouched() (zoneless).
    this.ngControl.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlTick.update((n) => n + 1));
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }

  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChangeFn(v);
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  protected showError(): boolean {
    this.controlTick();
    const c = this.ngControl.control;
    return !!c && c.invalid && c.touched;
  }

  protected errorText(): string {
    const keys = Object.keys(this.ngControl.control?.errors ?? {});
    return keys.length ? (this.errors()[keys[0]] ?? 'Pole jest niepoprawne.') : '';
  }

  protected describedBy(): string | null {
    const ids: string[] = [];
    if (this.hint()) {
      ids.push(`${this.id}-hint`);
    }
    if (this.showError()) {
      ids.push(`${this.id}-error`);
    }
    return ids.length ? ids.join(' ') : null;
  }
}
