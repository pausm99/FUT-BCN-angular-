import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { FieldGuard } from './guards/field/field.guard';
import { ManageGuard } from './guards/manage/manage.guard';
import { ManageFieldGuard } from './guards/manage/manage-field.guard';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'fields',
    title: 'Fields',
    loadComponent: () => import('./components/fields/fields.component').then(c => c.FieldsComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        title: 'Field list',
        loadComponent: () => import('./components/fields/list/list.component').then(c => c.ListComponent)
      },
      {
        path: 'map',
        title: 'Fields map',
        loadComponent: () => import('./components/map/map-list/map-list.component').then(c => c.MapListComponent)
      },
      {
        path: ':id',
        title: 'Field',
        loadComponent: () => import('./components/fields/field-view/field-view.component').then(c => c.FieldViewComponent),
        canActivate: [FieldGuard]
      },
    ]
  },
  {
    path: 'manage',
    title: 'Manage',
    loadComponent: () => import('./components/manage/manage.component').then(c => c.ManageComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        title: 'Manage your fields',
        loadComponent: () => import('./components/fields/list/list.component').then(c => c.ListComponent),
        canActivate: [ManageGuard]
      },
      {
        path: 'field/:id',
        title: 'Manage field',
        loadComponent: () => import('./components/fields/manage-field/manage-field.component').then(c => c.ManageFieldComponent),
        canActivate: [ManageFieldGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
