import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestModel, ResponseModel } from '../../../shared/models/error-handling.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceStackRecorderService implements HttpInterceptor {

  readonly inputServiceStack: RequestModel[];
  readonly outputServiceStack: ResponseModel[];

  constructor() {
    this.inputServiceStack = [];
    this.outputServiceStack = [];
  }

  populateResponseStack(event: any) {
    const responseStack: ResponseModel = {
      'url': event.url,
      'http-code': event.status
    };
    if (event.body) {
      responseStack['response'] = JSON.stringify({
        'transactionID': event.body.transactionID ? event.body.transactionID : '',
        'detail': ''
      });
    }

    this.outputServiceStack.unshift(responseStack);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq;
    const request: RequestModel = { 'url': req.urlWithParams, 'method': req.method, 'request': req.body };
    this.inputServiceStack.unshift(request);
    if (this.inputServiceStack && this.inputServiceStack.length > 10) {
      this.inputServiceStack.splice(10, 1);
    }
    authReq = req.clone();
    return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.populateResponseStack(event);
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          this.populateResponseStack(error);
        }
      })
    );
  }
}
