import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRole: number | any;
  userPermissions: string[] = [];
  adminId: any

  is_loggedIn = new BehaviorSubject<boolean>(false);
  apiKey: string = environment.APIKEY;

  constructor(private router: Router, private http: HttpClient) {
    this.adminId = localStorage.getItem('adminId');
  }

  reloadLogin() {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      this.is_loggin_or_not().subscribe((response: any) => {
        const serverToken = response.data ? response.data.token : undefined;
        if (localToken === serverToken) {
          this.is_loggedIn.next(true);
          this.router.navigate(['/admin']);
        } else {
          this.is_loggedIn.next(false);
          this.router.navigate(['/']);
        }
      });
    } else {
      this.is_loggedIn.next(false);
      this.router.navigate(['/']);
    }
  }


  is_loggin_or_not() {
    return this.http.post(environment.APIURL + "/admin_tokens", {}, {
      headers: {
        "api-key": this.apiKey

      },
    });
  }

  getPermissions(body: any) {
    return this.http.post(environment.APIURL + "/get-permission", body, {
      headers: {
        "api-key": this.apiKey
      },
    });
  }

  isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  Login(body: any) {
    return this.http.post(environment.APIURL + "/admin_login", body, {
      headers: {
        "api-key": this.apiKey,
        "content-type": "application/json"
      },
    });
  }

  Logout(token: any, body: any) {
    return this.http.post(environment.APIURL + "/admin_logout", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  Change_Password(token: any, body: any) {
    return this.http.post(environment.APIURL + "/change_password", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }
  

  getPermission() {
    const data = {id: this.adminId};

    return this.http.post(environment.APIURL + '/get-permission', data, {
      headers: {
        'api-key': environment.APIKEY,
      },
    }).pipe(map((response: any) => {
      if (response.code === 200) {
        this.userRole = Number(response.data.role);
        this.userPermissions = response.data.permissions || [];
      }
      return {
        role: this.userRole,
        permissions: this.userPermissions,
      };
    }));
  }


}
