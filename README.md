# Błędy dostępności formularzy w Angularze – demo

Aplikacja Angular (SPA z routerem) z trzema stronami:

| Adres             | Zawartość                                                                        |
| ----------------- | -------------------------------------------------------------------------------- |
| `/`               | Start: dwie tabele z mapą błędów, ich miejscem w kodzie i sposobem poprawienia   |
| `/z-bledami`      | Formularz z **celowymi** błędami dostępności (punkty 1–9 z listy pułapek)       |
| `/poprawiona`     | Ten sam formularz po poprawkach                                                  |
| `/cdk-z-bledami`  | Angular CDK A11y z **celowymi** błędami (C1–C11): dialog, menu, aria-live, lista |
| `/cdk-poprawiona` | Te same elementy po poprawkach                                                   |

Punkt 10 z listy formularzy (Angular Material) nie jest zaimplementowany, bo wymaga dodatkowej
biblioteki. Powłoka aplikacji (skip link, tytuły stron, fokus po zmianie trasy, `aria-current`)
jest poprawna we wszystkich wersjach.

## Uruchomienie

```bash
npm install
npm start      # http://localhost:4200
npm test
npm run build
```

Build produkcyjny serwowany statycznie wymaga fallbacku do `index.html` dla nieznanych ścieżek.

## Gdzie szukać kodu

- `src/app/pages/with-errors/` – formularz z błędami (komentarze `#1`…`#9` przy każdym błędzie)
- `src/app/shared/bad/` – celowo zepsute kontrolki (`BadSelect`, `BadTextField`)
- `src/app/pages/fixed/` – formularz poprawiony (komentarze `#1`…`#9` przy poprawkach)
- `src/app/shared/good/` – poprawne kontrolki `TextField` i `SelectField` (`ControlValueAccessor`),
  `ConfirmDialog` (dla `@angular/cdk/dialog`) i `MenuItem` (dla `FocusKeyManager`)
- `src/app/pages/cdk-errors/` i `src/app/pages/cdk-fixed/` – strony CDK (komentarze `C1`…`C11`)
- `src/app/pages/cdk-common.css` – style wspólne dla obu stron CDK

## Uwagi o CDK

- `Dialog` z CDK nie włącza `aria-modal` domyślnie; w wersji poprawionej ustawiono `ariaModal: true`.
- `FocusKeyManager` z sygnałem (`viewChildren`) wymaga podania `Injector` jako drugiego argumentu.
- `LiveAnnouncer` scala ogłoszenia oddalone o mniej niż ok. 100 ms, więc błąd „ogłoszenie na każdy
  znak” widać dopiero przy normalnym tempie pisania.
- Type-ahead w `FocusKeyManager` reaguje po przerwie (tu 300 ms), nie natychmiast.

## Uwaga techniczna

Komponenty `TextField` i `SelectField` subskrybują `control.events`. Bez tego w aplikacji
zoneless dziecko nie odświeża się po `markAllAsTouched()` wywołanym w rodzicu i komunikaty błędów
oraz `aria-invalid` nie pojawiają się.
