import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * CELOWE BŁĘDY (nie kopiuj):
 *  - #9: stałe id="field-input" – każde wystąpienie komponentu duplikuje id,
 *        więc <label for> drugiego pola wskazuje na pierwsze pole.
 *  - #8: brak setDisabledState, brak powiązania z komunikatem błędu.
 *  - #5: błąd jest sygnalizowany wyłącznie kolorem ramki (klasa .invalid).
 */
@Component({
  selector: 'app-bad-text-field',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BadTextField), multi: true },
  ],
  host: { '[class.invalid]': 'invalid()' },
  template: `
    <label for="field-input">{{ label() }}</label>
    <input id="field-input" type="text" [value]="value()" (input)="onInput($event)" (blur)="onTouched()" />
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 0.3rem; max-width: 32rem; margin-bottom: 1.1rem; }
    label { font-weight: 600; }
    :host(.invalid) input { border-color: #b00020; }
  `,
})
export class BadTextField implements ControlValueAccessor {
  label = input.required<string>();
  invalid = input(false);

  protected value = signal('');
  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }
}
