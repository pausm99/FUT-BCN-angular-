import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export function authResponseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const authService = inject(AuthService);

  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      const token = event.headers.get('Authorization')?.split(' ')[1];
      if (token) authService.setUserInfo(token);
    }
  }));
}
