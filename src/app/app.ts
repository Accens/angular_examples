import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  protected readonly navItems = [
    { path: '/', label: 'Start' },
    { path: '/z-bledami', label: 'Formularz – błędy' },
    { path: '/poprawiona', label: 'Formularz – poprawki' },
    { path: '/cdk-z-bledami', label: 'CDK – błędy' },
    { path: '/cdk-poprawiona', label: 'CDK – poprawki' },
  ];

  protected readonly routeAnnouncement = signal('');
  private firstNavigation = true;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.routeAnnouncement.set(`Przejście do strony: ${this.titleService.getTitle()}`);
          if (this.firstNavigation) {
            this.firstNavigation = false;
            return;
          }
          this.main().nativeElement.focus();
        });
      });
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
