import { AfterViewInit, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/**
 * Poprawiona lista wyboru: natywny <select> w środku, więc rola, nazwa, stan
 * i obsługa klawiatury pochodzą z przeglądarki (#8). Etykieta wskazuje na
 * wewnętrzny element, id jest unikalne (#9).
 */
@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.html',
})
export class SelectField implements ControlValueAccessor, AfterViewInit {
  label = input.required<string>();
  options = input.required<{ value: string; label: string }[]>();
  inputId = input<string>();
  errors = input<Record<string, string>>({});

  private readonly autoId = `select-field-${nextId++}`;
  protected get id(): string {
    return this.inputId() ?? this.autoId;
  }

  protected readonly value = signal('');
  protected readonly disabled = signal(false);

  private readonly ngControl = inject(NgControl, { self: true });
  private onChangeFn: (v: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private readonly controlTick = signal(0);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  ngAfterViewInit(): void {
    // Odświeża widok, gdy rodzic wywoła markAllAsTouched() (zoneless).
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

  protected onSelect(e: Event): void {
    const v = (e.target as HTMLSelectElement).value;
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
}
