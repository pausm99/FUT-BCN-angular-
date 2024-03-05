import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { FieldGuard } from './guards/field/field.guard';
import { ManageGuard } from './guards/manage/manage.guard';
import { ManageFieldGuard } from './guards/manage/manage-field.guard';
import { PlayerGuard } from './guards/player/player.guard';
import { EventGuard } from './guards/event/event.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        title: 'Profile',
        loadComponent: () => import('./components/profile/info/profile-info.component').then(c => c.ProfileInfoComponent)
      },
      {
        path: 'my-reservations',
        title: 'My reservations',
        loadComponent: () => import('./components/reservation/user-reservations/user-reservations.component').then(c => c.UserReservationsComponent),
        canActivate: [PlayerGuard]
      }
    ]
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
        canActivate: [ManageFieldGuard],
        children: [
          {
            path: '',
            title: 'Manage field',
            loadComponent: () => import('./components/fields/info/info.component').then(c => c.InfoComponent)
          },
          {
            path: 'schedule',
            title: 'Manage field schedule',
            loadComponent: () => import('./components/reservation/program/program.component').then(c => c.ProgramComponent)
          }
        ]
      }
    ]
  },
  {
    path: 'reservations',
    title: 'Book',
    loadComponent: () => import('./components/reservation/reservation.component').then(c => c.ReservationComponent),
    canActivate: [AuthGuard, PlayerGuard],
    children: [
      {
        path: '',
        title: 'Book',
        loadComponent: () => import('./components/reservation/availability/availability.component').then(c => c.AvailabilityComponent),
      },
      {
        path: ':id',
        title: 'Book this field',
        loadComponent: () => import('./components/reservation/field/reservation-field.component').then(c => c.ReservationFieldComponent),
        canActivate: [FieldGuard]
      },
    ]
  },
  {
    path: 'events',
    title: 'Events',
    loadComponent: () => import('./components/events/events.component').then(c => c.EventsComponent),
    canActivate: [AuthGuard, PlayerGuard],
    children: [
      {
        path: '',
        title: 'Event list',
        loadComponent: () => import('./components/events/event-list/event-list.component').then(c => c.EventListComponent),
      },
      {
        path: ':id',
        title: 'Event info',
        loadComponent: () => import('./components/events/event-info/event-info.component').then(c => c.EventInfoComponent),
        canActivate: [EventGuard]
      },
      {
        path: 'create/:id',
        title: 'Create event',
        loadComponent: () => import('./components/events/event-list/event-list.component').then(c => c.EventListComponent),
        canActivate: [EventGuard]
      }
    ]
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'not-found',
    title: 'Not found',
    loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
