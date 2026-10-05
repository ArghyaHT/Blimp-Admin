import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, retry, timeout } from 'rxjs/operators';

export const guardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  // Role 1 (super admin) can open everything; role 2 needs the route's permission
  const checkAccess = (access: { role: number; permissions: string[] }): boolean | UrlTree => {
    if (Number(access.role) === 2) {
      const requiredPermission = route.data?.['permission'];
      if (requiredPermission && !(access.permissions || []).includes(requiredPermission)) {
        return router.createUrlTree(['/access-denied']);
      }
    }
    return true;
  };

  const endSession = (): UrlTree => {
    authService.clearSession();
    return router.createUrlTree(['/']);
  };

  // Session restoration on page reload: the saved token is kept unless the server explicitly rejects it
  const serverCheck = authService.getPermission().pipe(
    timeout(10000),
    retry({ count: 1, delay: 1500 }),
    map((response) => {
      if (response.code === 401) {
        return endSession();
      }
      if (response.code === 200) {
        return checkAccess(response);
      }
      // Unexpected answer: fall back to the last known access
      const cached = authService.getCachedAccess();
      return cached ? checkAccess(cached) : true;
    }),
    catchError((error) => {
      if (error?.status === 401 || error?.status === 403) {
        return of(endSession());
      }
      // Server slow or unreachable: don't log the user out, restore access from the last successful check
      const cached = authService.getCachedAccess();
      return of(cached ? checkAccess(cached) : true);
    })
  );

  // Fast path: open the page immediately with the last confirmed access and re-check with the server
  // in the background; if access was revoked or the session ended, redirect then.
  const cachedAccess = authService.getCachedAccess();
  if (cachedAccess) {
    serverCheck.subscribe((result) => {
      if (result instanceof UrlTree) {
        router.navigateByUrl(result);
      }
    });
    return checkAccess(cachedAccess);
  }
  return serverCheck;

};
