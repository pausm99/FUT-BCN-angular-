import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'reservation',
    title: 'Reservation',
    loadComponent: () => import('./components/reservation/reservation.component').then(c => c.ReservationComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        title: 'Fields list',
        loadComponent: () => import('./components/reservation/list/list.component').then(c => c.ListComponent)
      },
      {
        path: 'map',
        title: "Map",
        loadComponent: () => import('./components/reservation/map-list/map-list.component').then(c => c.MapListComponent),
      }
    ]
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage',
    title: 'Manage',
    loadComponent: () => import('./components/manage/manage.component').then(c => c.ManageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
