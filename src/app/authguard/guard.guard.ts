import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const guardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    return router.createUrlTree(['/login']);
  }

  return authService.getPermission().pipe(
    map((response) => {
      const userRole = Number(response.role);
      const userPermissions = response.permissions || [];
      if (userRole === 1) {
        return true;
      }
      if (userRole === 2) {
        const requiredPermission = route.data?.['permission'];
        if (requiredPermission && !userPermissions.includes(requiredPermission)) {
          return router.createUrlTree(['/access-denied']);
        }
      }
      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['/']));
    })
  );

};
