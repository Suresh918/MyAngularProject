import {createAction, props} from '@ngrx/store';
import {RequestModel, ResponseModel} from '../../models/error-handling.model';
import {ErrorResponseModel} from '../../models/mc-store.model';

export enum ServiceErrorActionTypes {
  RequestSentToService = '[Service Error] Request sent to back end service',
  ResponseFromService = '[Service Error] Response from service',
  HighSeverityStackFromService = '[Service Error] High Severity Stack response from service',
  MediumSeverityStackFromService = '[Service Error] Medium Severity Stack response from service',
  LowSeverityStackFromService = '[Service Error] Low Severity Stack response from service',
  ClearErrorResponse = '[Service Error] Clear error responses from the state',
  ClearMediumSeverityStackResponse = '[Service Error] Clear Medium Severity Stack Response from the state',
  ClearLowSeverityStackResponse = '[Service Error] Clear Low Severity Stack Response from the state',
  ErrorPopupClosed = '[Service Error] Error dialog is in open/close state'
}

export const requestSentToService = createAction(ServiceErrorActionTypes.RequestSentToService, props<RequestModel>());
export const responseFromService = createAction(ServiceErrorActionTypes.ResponseFromService, props<ResponseModel>());
export const highSeverityStackFromService = createAction(ServiceErrorActionTypes.HighSeverityStackFromService, props<ErrorResponseModel>());
export const mediumSeverityStackFromService = createAction(ServiceErrorActionTypes.MediumSeverityStackFromService, props<ErrorResponseModel>());
export const lowSeverityStackFromService = createAction(ServiceErrorActionTypes.LowSeverityStackFromService, props<ErrorResponseModel>());
export const clearErrorResponse = createAction(ServiceErrorActionTypes.ClearErrorResponse);
export const errorPopupClosed = createAction(ServiceErrorActionTypes.ErrorPopupClosed, (popUpClosed: boolean) => ({errorPopupClosed: popUpClosed}));
export const clearMediumSeverityStackResponse = createAction(ServiceErrorActionTypes.ClearMediumSeverityStackResponse);
export const clearLowSeverityStackResponse = createAction(ServiceErrorActionTypes.ClearLowSeverityStackResponse);
