import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  currentUrl$ = new BehaviorSubject<string>(undefined);

  constructor(private readonly  router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentUrl$.next(event.urlAfterRedirects);
    });
  }
}
