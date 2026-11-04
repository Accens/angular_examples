import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SelectField } from '../../shared/good/select-field';
import { TextField } from '../../shared/good/text-field';

interface SummaryItem {
  id: string;
  message: string;
}

/** WERSJA POPRAWIONA – ten sam formularz co na stronie "z błędami". */
@Component({
  selector: 'app-fixed',
  imports: [ReactiveFormsModule, RouterLink, SelectField, TextField],
  templateUrl: './fixed.html',
  styleUrl: './fixed.css',
})
export class Fixed {
  private readonly fb = inject(FormBuilder);

  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly success = viewChild<ElementRef<HTMLElement>>('success');

  protected readonly summaryItems = signal<SummaryItem[]>([]);
  protected readonly succeeded = signal(false);
  protected readonly result = signal('');

  protected readonly topics = [
    { value: 'audit', label: 'Audyt dostępności' },
    { value: 'training', label: 'Szkolenie' },
    { value: 'support', label: 'Wsparcie' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // #3: walidacja dopiero po opuszczeniu pola – bez komunikatu na każdy znak
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9 +()-]{9,}$/)],
      updateOn: 'blur',
    }),
    topic: ['', Validators.required],
    city: ['', Validators.required],
    postcode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    // #7: readonly zamiast disabled – pole jest w kolejności tabulacji i w form.value
    customerNo: ['KL-10234'],
  });

  protected readonly messages: Record<string, Record<string, string>> = {
    fullName: { required: 'Podaj imię i nazwisko.' },
    email: {
      required: 'Podaj adres e-mail.',
      email: 'Podaj adres e-mail w formacie nazwa@domena.pl.',
    },
    phone: {
      required: 'Podaj numer telefonu.',
      pattern: 'Podaj numer telefonu z co najmniej 9 cyframi, np. +48 123 456 789.',
    },
    topic: { required: 'Wybierz temat.' },
    city: { required: 'Podaj miejscowość.' },
    postcode: {
      required: 'Podaj kod pocztowy.',
      pattern: 'Podaj kod pocztowy w formacie 00-000.',
    },
  };

  /** Kolejność = kolejność pól w formularzu. */
  private readonly fieldIds: Record<string, string> = {
    fullName: 'full-name',
    email: 'email',
    phone: 'phone',
    topic: 'topic',
    city: 'city',
    postcode: 'postcode',
  };

  protected submit(): void {
    this.succeeded.set(false);

    if (this.form.invalid) {
      // #1: pokaż błędy wszystkich pól
      this.form.markAllAsTouched();
      // #2: podsumowanie błędów z linkami do pól i przeniesieniem fokusu
      this.summaryItems.set(this.buildSummary());
      setTimeout(() => this.summary()?.nativeElement.focus());
      return;
    }

    this.summaryItems.set([]);
    // #7: getRawValue() zawiera także pola wyłączone
    this.result.set(JSON.stringify(this.form.getRawValue(), null, 2));
    this.succeeded.set(true);
    // #4: komunikat sukcesu dostaje fokus, więc jest odczytany
    setTimeout(() => this.success()?.nativeElement.focus());
  }

  protected focusField(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.focus();
  }

  private buildSummary(): SummaryItem[] {
    const items: SummaryItem[] = [];
    for (const name of Object.keys(this.fieldIds)) {
      const control = this.form.get(name);
      if (control?.invalid) {
        const key = Object.keys(control.errors ?? {})[0];
        items.push({
          id: this.fieldIds[name],
          message: this.messages[name][key] ?? 'Pole jest niepoprawne.',
        });
      }
    }
    return items;
  }
}
