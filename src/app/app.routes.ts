import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', title: 'Home', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
