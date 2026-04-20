import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/user/login']);
    return false;
  }

  if (authService.hasAnyRole(['ADMINSTRADOR', 'SUPER_ADMINSTRADOR'])) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
