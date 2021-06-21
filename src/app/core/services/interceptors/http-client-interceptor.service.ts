import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {filter, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {InterceptHandlerService} from './intercept-handler.service';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  'providedIn': 'root'
})
export class HttpClientInterceptorService implements HttpInterceptor {

  readonly errorReport: string;
  private history = [];

  constructor(private readonly interceptHandler: InterceptHandlerService,
              private readonly router: Router) {
    this.errorReport = '/error-reports';
    this.loadRouting();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;
    if (req.url.indexOf('/api/') !== -1 && req.url.indexOf(this.errorReport) === -1) {
      this.interceptHandler.onBeforeServiceCall(req);
    }
    authReq = req.clone();
    return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (req.url.indexOf('/api/') !== -1 && event.url.indexOf(this.errorReport) === -1)) {
          this.interceptHandler.onServiceCallSuccess(event);
        }
      }, (err: any) => {
        // reformat error object for new error response
        if (err.error && !err.error['Detail'] && err.error['application_status_code']) {
          err.error = {
            'TransactionID': '',
            'Detail': {
              'Severity': JSON.stringify(err.error['severity']),
              'Code': err.error['application_status_code'],
              'Message': err.error['message']
            }
          };
        }

        if (err instanceof HttpErrorResponse && err.error && (err.status === 0 || err.status === 401)) {
          const rootUrl = `${environment.rootURL}`;
          if (window.location.href.indexOf('localhost') && rootUrl.indexOf('146.106.72.240') === -1) {
            this.router.navigate(['/login']);
          }
        }
        // Redirect user to previous route when 304 error occurs
        if (err instanceof HttpErrorResponse && err.error && (err.status === 304)) {
          this.router.navigate([this.getPreviousUrl()]);
        }
        if (err instanceof HttpErrorResponse && err.error && err.error['Detail'] &&
          req.url.indexOf('action=unlink-air') === -1 &&
          !(req.method === 'POST' && req.url.includes('impacted-item-service')) &&
          !(err.error['Detail']['Message'].includes('Change Object Not exist with given change object type and change object number')) &&
          !(err.error['Detail']['Code'] === 'RELEASEPACKAGE-ERR-003') &&
          !(err.error['Detail']['Code'] === 'RELEASEPACKAGE-ERR-004') &&
          !(err.error['Detail']['Code'] === 'REVIEW-ERR-010') &&
          !(err.error['Detail']['Code'] === 'REVIEW-ERR-011') &&
          !(err.error['Detail']['Code'] === 'REVIEW-ERR-012') &&
          !(err.error['Detail']['Code'] === 'REVIEW-ERR-009')) {
          this.interceptHandler.onServiceCallError(err);
        }
      })
    );
  }

  userSessionClear() {
    const cookies = document.cookie.split('; ');
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split('.');
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(cookies[c].split(';')[0].split('=')[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        const p = location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
    // Reload site for single sign-in system
    setTimeout(() => {
       window.location.reload();
    }, 1000);
  }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/dashboard';
  }

}
