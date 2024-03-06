import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FieldService } from '../../services/field/field.service';
import { catchError, of, switchMap } from 'rxjs';

export const FieldPublicGuard: CanActivateFn = (route, state) => {

  const fieldService = inject(FieldService);
  const router = inject(Router);
  const id: string = route.params['id'];

  if (isNaN(Number(id))) {
    router.navigate(['/not-found']);
    return false;
  }

  return fieldService.getFieldById(Number(id)).pipe(
    switchMap((field) => {

        if (field && field.public) {
          fieldService.activeField.set(field);
          return of(true);
        }
        else {
          router.navigate(['/home']);
          return of(false);
        }
    }),
    catchError((error) => {
      router.navigate(['/not-found']);
      return of(false);
    })
  );
};
