import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';

export const connectionInterceptor: HttpInterceptorFn = (req, next) => {

  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 0) {
        router.navigate(['/home'])
        toastService.showDanger('Connection error');
      }
      return throwError(() => error);
    })
  );
};
