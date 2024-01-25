import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

export const ManageGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);

  const role = userService.userInfo().role;

  if (role !== 'company') {
    router.navigate(['/home']);
    return false;
  }
  else {
    const actualUrl = state.url.split('/')[1];

    if (actualUrl === 'manage') {
      if (route.paramMap.get('company')) {
        return true;
      }
      else {
        router.navigate(['/home']);
        return false;
      }
    }
    return true;
  }
};
