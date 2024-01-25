import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../components/auth/login/login.component';

export const AuthGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const modalService = inject(NgbModal);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/home']);
    modalService.open(LoginComponent);

    authService.redirectURL = state.url.split('?')[0];

    const queryParams = route.queryParamMap.get('company');
    if (queryParams) authService.queryParams = queryParams;
    else authService.queryParams = null;

    return false;
  }
};
