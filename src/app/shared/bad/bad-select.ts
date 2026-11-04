import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * CELOWE BŁĘDY (nie kopiuj):
 *  - #8: "select" zbudowany z <div>-ów: brak roli, nazwy, stanu (aria-expanded),
 *        brak fokusu i obsługi klawiatury. Zewnętrzny <label for="topic">
 *        wskazuje na element hosta, który nie jest kontrolką formularza.
 *  - brak setDisabledState.
 */
@Component({
  selector: 'app-bad-select',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BadSelect), multi: true },
  ],
  template: `
    <div class="fake-select" (click)="toggle()">{{ currentLabel() }} ▾</div>
    @if (open()) {
      <div class="fake-options">
        @for (o of options(); track o.value) {
          <div class="fake-option" (click)="choose(o.value)">{{ o.label }}</div>
        }
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: block; max-width: 32rem; }
    .fake-select { padding: 0.5rem 0.6rem; background: #fff; border: 2px solid #5b6572; border-radius: 4px; cursor: pointer; }
    .fake-options { position: absolute; z-index: 5; left: 0; right: 0; background: #fff; border: 2px solid #5b6572; border-top: none; }
    .fake-option { padding: 0.5rem 0.6rem; cursor: pointer; }
    .fake-option:hover { background: #e6eaf0; }
  `,
})
export class BadSelect implements ControlValueAccessor {
  options = input.required<{ value: string; label: string }[]>();

  protected value = signal('');
  protected open = signal(false);
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected currentLabel(): string {
    return this.options().find((o) => o.value === this.value())?.label ?? 'Wybierz';
  }

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  protected choose(v: string): void {
    this.value.set(v);
    this.onChange(v);
    this.onTouched();
    this.open.set(false);
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
