import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';

export const PlayerGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);
  const toastService = inject(ToastService)

  const role = userService.userInfo().role;

  if (role !== 'player') {
    router.navigate(['/home']);
    toastService.showDanger(`Company profiles aren't allowed to book fields or participate in events`)
    return false;
  }

  return true;
};
