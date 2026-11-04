import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadSelect } from '../../shared/bad/bad-select';
import { BadTextField } from '../../shared/bad/bad-text-field';

/**
 * WERSJA Z CELOWYMI BŁĘDAMI DOSTĘPNOŚCI.
 * Numery #1–#9 odpowiadają punktom z listy "Typowe pułapki" (patrz strona Start).
 */
@Component({
  selector: 'app-with-errors',
  imports: [ReactiveFormsModule, RouterLink, BadSelect, BadTextField],
  templateUrl: './with-errors.html',
  styleUrl: './with-errors.css',
})
export class WithErrors {
  private readonly fb = inject(FormBuilder);

  protected readonly sent = signal(false);
  protected readonly result = signal('');

  protected readonly topics = [
    { value: 'audit', label: 'Audyt dostępności' },
    { value: 'training', label: 'Szkolenie' },
    { value: 'support', label: 'Wsparcie' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9 +()-]{9,}$/)]],
    topic: ['', Validators.required],
    city: ['', Validators.required],
    postcode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    // #7: kontrolka wyłączona przez disabled
    customerNo: new FormControl({ value: 'KL-10234', disabled: true }, { nonNullable: true }),
  });

  protected isInvalid(name: 'postcode' | 'city'): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected phoneLength(): number {
    return this.form.controls.phone.value.length;
  }

  protected submit(): void {
    // #1: brak markAllAsTouched() – błędy pól nietkniętych nigdy się nie pokażą
    // #2: brak podsumowania błędów i przeniesienia fokusu
    if (this.form.invalid) {
      return;
    }
    // #7: form.value nie zawiera pola customerNo (jest tylko w getRawValue())
    this.result.set(JSON.stringify(this.form.value, null, 2));
    this.sent.set(true);
  }
}
