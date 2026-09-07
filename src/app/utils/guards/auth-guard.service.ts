import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { BaseComponent } from '../components/base/base.component';

@Injectable()
export class AuthGuard extends BaseComponent implements CanActivate {

  constructor( injector: Injector,) {
    super(injector);
  }

  canActivate(): Observable<boolean> | boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }

    this.router.navigate([this.CONSTANTS.login]);
    return false;
  }

}
