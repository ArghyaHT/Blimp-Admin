import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = environment.APIURL;
  constructor(private http: HttpClient) { }

  getData(requrl: string, params?: any): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.get<any>(url, { params });
  }

 
  postData(requrl: string, payload: any): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.post<any>(url, payload);
  }

 
  putData(requrl: string, payload: any): Observable<any> {
    const url = `${this.apiUrl + requrl}`;
    return this.http.put<any>(url, payload);
  }


  deleteData(requrl: string): Observable<any> {
    const url = `${this.apiUrl}${requrl}`;
    return this.http.delete<any>(url);
  }

}
