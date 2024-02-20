import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NEVER, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
      }
    }),
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/home']);
        authService.logOut();
      }
      return NEVER;
    })
  );

};
