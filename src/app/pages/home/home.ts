import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Row {
  no: number | string;
  problem: string;
  wcag: string;
  where: string;
  fix: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly cdkRows: Row[] = [
    {
      no: 'C1',
      problem: 'Dialog zrobiony samym cdkTrapFocus: brak roli, aria-modal, nazwy i obsługi Escape',
      wcag: '4.1.2, 2.1.2, 1.3.1',
      where: 'Sekcja 1: panel „Usunąć plik?”. Escape nic nie robi, tło jest nadal dostępne dla czytnika.',
      fix: 'Dialog z @angular/cdk/dialog: role="alertdialog", ariaLabelledBy/ariaDescribedBy, jawne ariaModal: true (domyślnie wyłączone), pułapka fokusu i Escape z CDK; fokus początkowy na „Anuluj” (cdkFocusInitial).',
    },
    {
      no: 'C2',
      problem: 'Fokus nie wraca po zamknięciu, gdy element otwierający zniknął',
      wcag: '2.4.3',
      where: 'Sekcja 1: po potwierdzeniu usunięcia pliku fokus ląduje na <body>.',
      fix: 'restoreFocus: false i ręczne ustawienie fokusu (następny wiersz lub nagłówek) przez afterNextRender; komunikat „Plik został usunięty”.',
    },
    {
      no: 'C3',
      problem: 'Menu: niepoprawna struktura ról, brak aria-expanded, Tab i Escape nie zamykają menu',
      wcag: '4.1.2, 2.1.1, 2.4.3',
      where: 'Sekcja 2: role="menu" z <li> i <button> bez ról; menu zostaje otwarte po Tab i Escape.',
      fix: 'aria-haspopup/aria-expanded/aria-controls, role="none" na <li>, role="menuitem", obsługa tabOut i Escape.',
    },
    {
      no: 'C4',
      problem: 'Po wyborze pozycji menu fokus ginie',
      wcag: '2.4.3',
      where: 'Sekcja 2: wybór pozycji usuwa menu razem z elementem, który miał fokus.',
      fix: 'Po wyborze fokus wraca na przycisk otwierający menu.',
    },
    {
      no: 'C5',
      problem: 'Fokus ustawiany przed wyrenderowaniem listy; brak roving tabindex i type-ahead',
      wcag: '2.1.1, 2.4.3',
      where: 'Sekcja 2: po otwarciu menu fokus nie przechodzi do pierwszej pozycji; wszystkie pozycje są w tab order.',
      fix: 'afterNextRender + setFirstItemActive(); tabindex="-1" na pozycjach; getLabel() dla type-ahead.',
    },
    {
      no: 'C6',
      problem: 'Region live wstawiany razem z treścią',
      wcag: '4.1.3',
      where: 'Sekcja 3: „Zapisz zmiany” i toast tworzą cały kontener role="status" razem z tekstem.',
      fix: 'Kontener jest stale w DOM, a zmienia się tylko jego zawartość.',
    },
    {
      no: 'C7',
      problem: 'Podwójne ogłoszenie: live region i LiveAnnouncer z tym samym tekstem',
      wcag: '4.1.3',
      where: 'Sekcja 3: „Dodaj do koszyka”.',
      fix: 'Jeden mechanizm ogłaszania.',
    },
    {
      no: 'C8',
      problem: 'Ogłoszenie na każdy znak, assertive, bez debouncingu',
      wcag: '4.1.3',
      where: 'Sekcja 3: wyszukiwarka owoców ogłasza liczbę wyników po każdym naciśnięciu klawisza (LiveAnnouncer scala tylko ogłoszenia oddalone o mniej niż ok. 100 ms, więc przy normalnym tempie pisania każde zostaje odczytane).',
      fix: 'Ogłoszenie po 500 ms przerwy w pisaniu, politeness „polite”.',
    },
    {
      no: 'C9',
      problem: 'Toast znika sam po 3 sekundach, bez możliwości zamknięcia lub wstrzymania',
      wcag: '2.2.1',
      where: 'Sekcja 3: „Zapisz szkic”.',
      fix: 'Toast zostaje do czasu zamknięcia przyciskiem „Zamknij”.',
    },
    {
      no: 'C10',
      problem: '@for z track po tożsamości obiektu: element jest tworzony od nowa i fokus przepada',
      wcag: '2.4.3, 3.2.2',
      where: 'Sekcja 4: Enter na zadaniu przenosi fokus na <body>.',
      fix: 'track t.id: DOM jest zachowany, a fokus pozostaje na przycisku.',
    },
    {
      no: 'C11',
      problem: 'Ukryty panel nadal dostępny z klawiatury',
      wcag: '2.4.3, 2.4.7, 1.3.2',
      where: 'Sekcja 5: zwinięty panel (wysokość 0, opacity 0) zawiera link, do którego da się dojść Tab.',
      fix: 'Atrybut hidden (display: none) bez CSS, który go nadpisuje.',
    },
  ];

  protected readonly rows: Row[] = [
    {
      no: 1,
      problem: 'Błędy pojawiają się tylko po touched; submit nie wywołuje markAllAsTouched()',
      wcag: '3.3.1',
      where: 'Kliknij „Wyślij” na pustym formularzu: nic się nie dzieje.',
      fix: 'submit() wywołuje markAllAsTouched(), więc błędy pokazują się we wszystkich polach.',
    },
    {
      no: 2,
      problem: 'Brak ogłoszenia błędów po submicie',
      wcag: '3.3.1, 2.4.3',
      where: 'Po nieudanym submicie fokus zostaje na przycisku, brak podsumowania.',
      fix: 'Podsumowanie błędów (tabindex="-1", aria-labelledby) dostaje fokus, a linki przenoszą do pól.',
    },
    {
      no: 3,
      problem: 'role="alert" na inline błędzie przy walidacji „na żywo”',
      wcag: '4.1.3',
      where: 'Pole Telefon: komunikat z licznikiem znaków jest ogłaszany przy każdym znaku.',
      fix: 'updateOn: \'blur\' + komunikat powiązany przez aria-describedby, bez role="alert".',
    },
    {
      no: 4,
      problem: 'Komunikat dodany do DOM bez live region i bez powiązania z polem',
      wcag: '4.1.2, 4.1.3, 3.3.1',
      where: 'Pole E-mail (błąd bez aria-invalid i aria-describedby) oraz komunikat sukcesu po wysłaniu.',
      fix: 'aria-invalid + aria-describedby na polu; komunikat sukcesu dostaje fokus.',
    },
    {
      no: 5,
      problem: 'Błąd przekazany tylko kolorem ramki',
      wcag: '1.4.1, 3.3.1',
      where: 'Pola Miejscowość i Kod pocztowy: czerwona ramka bez tekstu.',
      fix: 'Tekst błędu z ikoną ⚠ i ukrytym prefiksem „Błąd:”.',
    },
    {
      no: 6,
      problem: 'Placeholder zamiast etykiety',
      wcag: '3.3.2, 1.3.1, 1.4.3',
      where: 'Pole Imię i nazwisko: tylko jasny placeholder.',
      fix: 'Widoczna etykieta <label for> powiązana z polem.',
    },
    {
      no: 7,
      problem: 'Wyłączanie pól przez disabled',
      wcag: '2.1.1, 1.3.1',
      where: 'Numer klienta: pole poza tabulacją, a wartość znika z form.value.',
      fix: 'Atrybut readonly (pole jest fokusowalne) i getRawValue() przy wysyłce.',
    },
    {
      no: 8,
      problem: 'Własne kontrolki z ControlValueAccessor bez semantyki',
      wcag: '4.1.2, 2.1.1, 1.3.1',
      where: 'Temat: select z <div>-ów, bez roli i klawiatury; label for wskazuje na host.',
      fix: 'Natywny <select> w środku komponentu, etykieta wskazuje na wewnętrzny element, setDisabledState.',
    },
    {
      no: 9,
      problem: 'Powtarzane komponenty ze stałym id',
      wcag: '4.1.1 (historycznie), 1.3.1, 4.1.2',
      where: 'Miejscowość i Kod pocztowy mają to samo id="field-input"; etykieta kodu wskazuje na pole miejscowości.',
      fix: 'Unikalne id: z wejścia inputId albo z licznika.',
    },
  ];
}
