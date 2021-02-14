import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {fromEvent, Observable, timer} from 'rxjs';
import {concatMapTo, filter, map, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';

@Injectable()
export class PollingService {
  constructor(private http: HttpClient) {
  }

  poll<T>(url: string, period: number): Observable<T> {
    return this.http.get<T>(url).pipe(
        pollWithPeriod(period),
        whenOnline(),
        whenPageVisible(),
    );
  }
}

const pollWithPeriod = (period: number, initialDelay = 0) => {
  return <T>(source: Observable<T>) => {
    return timer(initialDelay, period).pipe(concatMapTo(source));
  };
};

const whenOnline = () => {
  const offline$ = fromEvent(window, 'offline').pipe(
      shareReplay({refCount: true, bufferSize: 1}),
      map(() => false)
  );
  const online$ = fromEvent(window, 'online').pipe(
      shareReplay({refCount: true, bufferSize: 1}),
      map(() => true)
  );

  return <T>(source: Observable<T>) => {
    return source.pipe(
        takeUntil(offline$),
        repeatWhen(() => online$)
    );
  };
};

const whenPageVisible = () => {
  const visibilityChange$ = fromEvent(document, 'visibilitychange').pipe(
      shareReplay({refCount: true, bufferSize: 1})
  );

  const pageVisible$ = visibilityChange$.pipe(
      filter(() => document.visibilityState === 'visible')
  );

  const pageHidden$ = visibilityChange$.pipe(
      filter(() => document.visibilityState === 'hidden')
  );

  return <T>(source: Observable<T>) => {
    return source.pipe(
        takeUntil(pageHidden$),
        repeatWhen(() => pageVisible$)
    );
  };
};
