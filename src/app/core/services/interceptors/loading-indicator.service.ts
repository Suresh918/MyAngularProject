import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SharedService} from '../shared.service';
import {tap} from 'rxjs/operators';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {Store} from '@ngrx/store';
import {showLoader} from '../../../store';

@Injectable({
  'providedIn': 'root'
})
export class LoadingIndicatorService implements HttpInterceptor {
  constructor(private readonly sharedService: SharedService,
              private readonly appStore: Store<MyChangeState>) {
  }

  static showLoadingIndicator(req): boolean {
    return ((req.method === 'POST')
      && (req.url.indexOf('user-settings') === -1)
      && (req.url.indexOf('/error-reports') === -1) && (req.url.indexOf('action=import') === -1)
      && (req.url.indexOf('/documents') === -1) && (req.url.indexOf('/decisions') === -1)
      && (req.url.indexOf('/actions') === -1) && (req.url.indexOf('/notes') === -1)
      && (req.url.indexOf('/tags') === -1) && (req.url.indexOf('/favorite') === -1)
      && (req.url.indexOf('/reviewers') === -1) && req.url.indexOf('review-service') === -1)
      && (req.url.indexOf('/states') === -1)
      ||
      (
        req.method === 'PUT'
        && req.url.indexOf('/purpose') === -1
        && req.url.indexOf('/fields') === -1
        && req.url.indexOf('/project') === -1
        && req.url.indexOf('unlink-air') === -1
        && req.url.indexOf('unlink-pbs') === -1
        && req.url.indexOf('action=add-attendees') === -1
        && req.url.indexOf('action=delete-attendees') === -1
        && req.url.indexOf('action=delete-special-invitee') === -1
        && req.url.indexOf('action=DISCUSS') === -1
        && req.url.indexOf('action=POSTPONE') === -1
        && req.url.indexOf('action=APPROVE') === -1
        && req.url.indexOf('action=REJECT') === -1
        && req.url.indexOf('action=SEND-AGENDA') === -1
        && req.url.indexOf('action=import') === -1
        && req.url.indexOf('action=COMPLETE') === -1
        && (req.url.indexOf('/actions') === -1 && req.url.indexOf('/type') === -1)
        && (req.url.indexOf('/notes') === -1 && req.url.indexOf('case-action=save') === -1)
        && req.url.indexOf('/implementation-range') === -1
        && req.urlWithParams.indexOf('action=clone-agenda') === -1
        && req.urlWithParams.indexOf('next-agendaitem-id') === -1
        && req.urlWithParams.indexOf('action=unlink-rp') === -1
        && (req.url.indexOf('/tags') === -1)
        && (req.url.indexOf('/notifications') === -1)
        && (req.url.indexOf('/settings') === -1)
        && (req.url.indexOf('/reviewers') === -1)
        && req.url.indexOf('review-service') === -1
        && req.url.indexOf('/scope') === -1
        && req.url.indexOf('/bulk-permissions') === -1
      )
    ||
      ((req.method === 'PATCH')
      && req.url.indexOf('review-service') === -1
      && req.url.indexOf('reviews') === -1
      && req.url.indexOf('change-request-service') === -1
      && req.url.indexOf('release-package-service') === -1);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any>;
    if (LoadingIndicatorService.showLoadingIndicator(req)) {
      this.appStore.dispatch(showLoader(true));
    }
    authReq = req.clone();
    return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.appStore.dispatch(showLoader(false));
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.appStore.dispatch(showLoader(false));
        }
      })
    );
  }

}
