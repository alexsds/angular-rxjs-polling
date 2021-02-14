import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {concatMapTo} from 'rxjs/operators';

@Injectable()
export class PollingService {
  constructor(private http: HttpClient) {
  }

  poll<T>(url: string, period: number): Observable<T> {
    return this.http.get<T>(url).pipe(
        pollWithPeriod(period)
    );
  }
}

const pollWithPeriod = (period: number, initialDelay = 0) => {
  return <T>(source: Observable<T>) => {
    return timer(initialDelay, period).pipe(concatMapTo(source));
  };
};
