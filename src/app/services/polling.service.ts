import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class PollingService {
  constructor(private http: HttpClient) {
  }

  poll<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
