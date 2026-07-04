import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  // During SSR there is no localStorage — let the server render the shell
  // and allow the client-side router to re-run the guard with the real token.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page if not authenticated
  router.navigate(['/user/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};

/**
 * Role Guard Factory - Creates a guard that checks for specific roles
 */
export const createRoleGuard = (requiredRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/user/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    if (authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    // Redirect to unauthorized page or home
    router.navigate(['/home']);
    return false;
  };
};
