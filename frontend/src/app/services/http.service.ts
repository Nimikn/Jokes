import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private client: HttpClient) {

  }
  get<T>(url: string): Observable<T>{
    return this.client.get<T>(url);
  }
  
  post<T>(url: string, body: any): Observable<T> {
    return this.client.post<T>(url, body);
  }
  
  put<T>(url: string, body: any): Observable<T> {
    return this.client.put<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.client.delete<T>(url);
  }
}
