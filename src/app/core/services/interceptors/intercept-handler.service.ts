import {Injectable, OnDestroy} from '@angular/core';
import {ErrorHandlerService} from '../error-handler.service';
import {highSeverityStackFromService, lowSeverityStackFromService, mediumSeverityStackFromService, requestSentToService, responseFromService} from '../../../shared/store';
import {RequestModel, ResponseModel} from '../../../shared/models/error-handling.model';
import {ErrorResponseModel, ErrorState} from '../../../shared/models/mc-store.model';
import {Store} from '@ngrx/store';
import {Subject, Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import {HttpErrorResponse, HttpRequest, HttpResponse} from '@angular/common/http';
import {SharedService} from '../shared.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LowSeveritySnackBarComponent} from '../../../shared/components/low-severity-snack-bar/low-severity-snack-bar.component';

@Injectable({
  'providedIn': 'root'
})
export class InterceptHandlerService implements OnDestroy {
  readonly delayPeriod: number;
  private timeDelayPerMessage: number;
  readonly subscription: Subscription;
  readonly messageList: Subject<any> = new Subject<any>();
  readonly errorReport: string;

  constructor(private readonly sharedService: SharedService,
              private readonly customAlert: MatSnackBar,
              private readonly router: Router,
              private readonly errorHandlerService: ErrorHandlerService,
              private readonly errorStore: Store<ErrorState>) {
    this.timeDelayPerMessage = 0;
    this.delayPeriod = 10000;
    this.errorReport = '/error-reports';
    this.subscribeToErrorState();
    /*subscribing error message que to show the snack bar synchronously*/
    this.subscription = this.messageList.pipe(delay(this.timeDelayPerMessage)).subscribe(message => {
      this.timeDelayPerMessage = this.timeDelayPerMessage - this.delayPeriod;
      this.customAlert.openFromComponent(LowSeveritySnackBarComponent, {data: message});
    });
  }

  subscribeToErrorState(): void {
    this.errorHandlerService.subscribeServiceErrorStateStore();
    this.errorHandlerService.subscribeErrorStore();
    this.errorHandlerService.subscribeMediumSeverity();
    this.errorHandlerService.subscribeHighSeverity();
    this.errorHandlerService.subscribeLowSeverity();
  }

  onBeforeServiceCall(req: HttpRequest<any>): void {
    this.dispatchRequestSentToServiceAction(req);
  }

  onServiceCallSuccess(event: HttpResponse<any>) {
    this.dispatchServerResponse(event, false);
    this.dispatchBannerAction(event);
  }

  onServiceCallError(err: HttpErrorResponse) {
    this.handleErrorResponse(err);
  }

  dispatchRequestSentToServiceAction(req: HttpRequest<any>): void {
    this.errorStore.dispatch(requestSentToService({
      'url': req.urlWithParams ? req.urlWithParams.replace(/^.*\/\/[^\/]+/, '') : req.url.replace(/^.*\/\/[^\/]+/, ''),
      'method': req.method,
      'request': JSON.stringify(req.body),
    } as RequestModel));
  }

  handleErrorResponse(err) {
    if (err.url.indexOf(this.errorReport) > -1) {
      return;
    }
    this.dispatchServerResponse(err, true);
    if (err.error['Detail']['Code'] === '403') {
      this.router.navigate(['/dashbaord']);
    }
    this.replaceTransactionIdInError(err.error);
    if (err.error['Detail']['Severity'] === '1') {
      this.dispatchHighSeverityAction(err);
    } else if (err.error['Detail']['Severity'] === '2') {
      if (err.error.Detail.Code !== 'MYCHANGE-ANNOUNCEMENT-999' && err.error.Detail.Code !== 'BPM-CASE-002') {
        this.dispatchBannerAction(err);
      }
    } else if (err.error['Detail']['Severity'] === '3') {
        this.dispatchLowSeverityAction(err);
        this.timeDelayPerMessage = this.timeDelayPerMessage + this.delayPeriod;
      if (err.error['Detail']['Severity'] !== -1) {
        this.messageList.next(err.error['Detail']['Message']);
      }
    }
  }

  dispatchLowSeverityAction(event: any): void {
    if (event.error) {
      this.errorStore.dispatch(lowSeverityStackFromService({
          'transactionID': event.error.TransactionID ? event.error.TransactionID : '',
          'statusCode': event.error.Detail ? (event.error.Detail.Code ? event.error.Detail.Code : '') : '',
          'errorMessage': event.error.Detail ? (event.error.Detail.Message ? event.error.Detail.Message : '') : ''
        } as ErrorResponseModel
      ));
    }
  }

  dispatchHighSeverityAction(event: any): void {
    if (event.error) {
      this.errorStore.dispatch(highSeverityStackFromService({
          'transactionID': event.error.TransactionID ? event.error.TransactionID : '',
          'statusCode': event.error.Detail ? (event.error.Detail.Code ? event.error.Detail.Code : '') : '',
          'errorMessage': event.error.Detail ? (event.error.Detail.Message ? event.error.Detail.Message : '') : ''
        } as ErrorResponseModel
      ));
    }
  }

  replaceTransactionIdInError(errorObj) {
    const messageToReplace = errorObj.TransactionID ? errorObj.TransactionID : '';
    errorObj.Detail.Message = errorObj.Detail.Message.replace('@TxId@', messageToReplace);
  }

  dispatchServerResponse(event: any, isErrorResponse: boolean): void {
    this.errorStore.dispatch(responseFromService({
        'url': event.url.replace(/^.*\/\/[^\/]+/, ''),
        'http-code': event.status,
        'response': isErrorResponse ? JSON.stringify(event.error) : JSON.stringify(event.body) || ''
      } as ResponseModel
    ));
  }

  dispatchBannerAction(event: any): void {
    if (event.error) {
      this.errorStore.dispatch(mediumSeverityStackFromService({
          'transactionID': event.error.TransactionID ? event.error.TransactionID : '',
          'statusCode': event.error.Detail ? (event.error.Detail.Code ? event.error.Detail.Code : '') : '',
          'errorMessage': event.error.Detail ? (event.error.Detail.Message ? event.error.Detail.Message : '') : ''
        } as ErrorResponseModel
      ));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
