import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

// Login page: an admin who is already logged in (token saved) goes straight to the dashboard instead of seeing the form.
// The dashboard's own guard (guardGuard) still checks the session with the server and logs out if it was rejected.
export const loginGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn() ? router.createUrlTree(['/admin']) : true;
};
