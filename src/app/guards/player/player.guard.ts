import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

export const PlayerGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);

  const role = userService.userInfo().role;

  if (role !== 'player') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
