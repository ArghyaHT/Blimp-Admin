import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';

const ACCESS_CACHE_KEY = 'adminAccess';

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
      this.is_loggin_or_not().subscribe({
        next: (response: any) => {
          const serverToken = response.data ? response.data.token : undefined;
          if (localToken === serverToken) {
            this.is_loggedIn.next(true);
            this.router.navigate(['/admin']);
          } else {
            this.is_loggedIn.next(false);
            this.router.navigate(['/']);
          }
        },
        // Server unreachable: keep the saved session and let the route guard restore it
        error: () => this.router.navigate(['/admin']),
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
    const adminId = localStorage.getItem('adminId');
    const data = { id: adminId };

    return this.http.post(environment.APIURL + '/get-permission', data, {
      headers: {
        'api-key': environment.APIKEY,
      },
    }).pipe(map((response: any) => {
      if (response.code === 200) {
        this.userRole = Number(response.data.role);
        this.userPermissions = response.data.permissions || [];
        this.cacheAccess();
      }
      return {
        code: response.code,
        role: this.userRole,
        permissions: this.userPermissions,
      };
    }));
  }

  // Last known role/permissions, so a page reload can restore the session when the server is slow or unreachable
  private cacheAccess() {
    localStorage.setItem(ACCESS_CACHE_KEY, JSON.stringify({ role: this.userRole, permissions: this.userPermissions }));
  }

  getCachedAccess(): { role: number; permissions: string[] } | null {
    try {
      const cached = JSON.parse(localStorage.getItem(ACCESS_CACHE_KEY) || 'null');
      return cached && typeof cached.role === 'number' ? { role: cached.role, permissions: cached.permissions || [] } : null;
    } catch {
      return null;
    }
  }

  // Used when the server reports the session as invalid
  clearSession() {
    ['token', 'adminId', 'name', 'email', 'profile', ACCESS_CACHE_KEY].forEach((key) => localStorage.removeItem(key));
    this.is_loggedIn.next(false);
  }


}
