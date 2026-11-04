import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Start',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'z-bledami',
    title: 'Formularz – wersja z błędami',
    loadComponent: () => import('./pages/with-errors/with-errors').then((m) => m.WithErrors),
  },
  {
    path: 'poprawiona',
    title: 'Formularz – wersja poprawiona',
    loadComponent: () => import('./pages/fixed/fixed').then((m) => m.Fixed),
  },
  {
    path: 'cdk-z-bledami',
    title: 'CDK – wersja z błędami',
    loadComponent: () => import('./pages/cdk-errors/cdk-errors').then((m) => m.CdkErrors),
  },
  {
    path: 'cdk-poprawiona',
    title: 'CDK – wersja poprawiona',
    loadComponent: () => import('./pages/cdk-fixed/cdk-fixed').then((m) => m.CdkFixed),
  },
  {
    path: '**',
    title: 'Nie znaleziono strony',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
