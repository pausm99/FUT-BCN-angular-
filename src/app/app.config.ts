import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authRequestInterceptor } from './interceptors/request.interceptor';
import { authResponseInterceptor } from './interceptors/response.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { connectionInterceptor } from './interceptors/connection.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authRequestInterceptor, authResponseInterceptor, authInterceptor, connectionInterceptor])
    )
  ]
};
