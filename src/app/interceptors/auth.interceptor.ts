import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor that adds the authentication token to all requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authHeader = authService.getAuthorizationHeader();

  // Clone the request and add the authorization header if token exists
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  if (authHeader && isApiRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(req);
};
