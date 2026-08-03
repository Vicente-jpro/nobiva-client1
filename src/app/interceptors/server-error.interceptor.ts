import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { publicApiErrors } from '../models/api-error';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0 || error.status === 503) {
        router.navigate(['/server-down']);
      }

      const sanitizedError = new HttpErrorResponse({
        error: { errors: publicApiErrors(error) },
        headers: error.headers,
        status: error.status,
        statusText: error.statusText,
        url: error.url ?? undefined,
      });

      return throwError(() => sanitizedError);
    })
  );
};
