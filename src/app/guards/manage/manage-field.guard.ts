import { CanActivateFn, Router } from '@angular/router';
import { FieldService } from '../../services/field/field.service';
import { inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { catchError, of, switchMap } from 'rxjs';

export const ManageFieldGuard: CanActivateFn = (route, state) => {

  const fieldService = inject(FieldService);
  const userService = inject(UserService);

  const router = inject(Router);

  const id: string = route.params['id'];

  const userInfo = userService.userInfo();

  if (isNaN(Number(id))) {
    router.navigate(['/home']);
    return false;
  }

  return fieldService.getFieldById(Number(id)).pipe(
    switchMap((field) => {

      if (userInfo.role === 'company' && userInfo.id === field.company_id) {
        fieldService.activeField.set(field)
        return of(true);
      } else {
        router.navigate(['/home']);
        return of(false);
      }
    }),
    catchError((error) => {
      router.navigate(['/home']);
      return of(false);
    })
  );
};
