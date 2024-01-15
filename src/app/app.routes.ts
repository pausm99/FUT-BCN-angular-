import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', title: 'Home', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
  { path: 'reservation', title: 'Reservation', loadComponent: () => import('./components/reservation/reservation.component').then(c => c.ReservationComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
