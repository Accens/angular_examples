import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h1>Nie znaleziono strony</h1>
    <p><a routerLink="/">Wróć na stronę startową</a></p>
  `,
})
export class NotFound {}
