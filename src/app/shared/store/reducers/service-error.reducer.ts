import * as serviceActions from '../actions/service-error.actions';
import {RequestModel, ResponseModel} from '../../models/error-handling.model';
import {ErrorResponseModel, ServiceError} from '../../models/mc-store.model';
import {Action, createReducer, on} from '@ngrx/store';

const errorStackCapacity = 10;
const initialState: ServiceError = {
  transactionIDs: [],
  requestStack: [],
  responseStack: [],
  highSeverityStack: [],
  mediumSeverityStack: [],
  lowSeverityStack: [],
  errorPopupClosed: Boolean(false),
} as ServiceError;

const _serviceErrorReducer = createReducer(initialState,
  on(serviceActions.requestSentToService, (state, actionData) => (
    {
      ...state,
      requestStack: addRequestStack(actionData, state)
    })
  ),
  on(serviceActions.responseFromService, (state, actionData) => (
    {
      ...state,
      responseStack: addResponseStack(actionData, state)
    })
  ),
  on(serviceActions.highSeverityStackFromService, (state, actionData) => updateHighSeverityStackErrorResponse(actionData, state)),
  on(serviceActions.mediumSeverityStackFromService, (state, actionData) => updateMediumSeverityStackErrorResponse(actionData, state)),
  on(serviceActions.lowSeverityStackFromService, (state, actionData) => updateLowSeverityStackErrorResponse(actionData, state)),
  on(serviceActions.clearErrorResponse, (state) => (
    {
      ...state,
      transactionIDs: [],
      highSeverityStack: []
    })
  ),
  on(serviceActions.clearMediumSeverityStackResponse, (state) => (
    {
      ...state,
      mediumSeverityStack: []
    })
  ),
  on(serviceActions.clearLowSeverityStackResponse, (state) => (
    {
      ...state,
      lowSeverityStack: []
    })
  ),
  on(serviceActions.errorPopupClosed, (state, action) => (
    {
      ...state,
      errorPopupClosed: new Boolean(action.errorPopupClosed)
    })
  )
);

export function serviceErrorReducer(state: ServiceError, action: Action): ServiceError {
  return _serviceErrorReducer(state, action);
}

export function addRequestStack(requestStack: RequestModel, serviceError: ServiceError): RequestModel[] {
  const requests = [...serviceError.requestStack];
  if (serviceError.requestStack.length >= errorStackCapacity) {
    requests.pop();
  }
  requests.unshift(requestStack);
  return requests;
}

export function addResponseStack(responseStack: ResponseModel, serviceError: ServiceError): ResponseModel[] {
  const requests = [...serviceError.responseStack];
  if (serviceError.responseStack.length >= errorStackCapacity) {
    requests.pop();
  }
  requests.unshift(responseStack);
  return requests;
}

export function updateHighSeverityStackErrorResponse(errorResponseStack: ErrorResponseModel, serviceError: ServiceError): ServiceError {
  const requests = {...serviceError};
  if (errorResponseStack.transactionID) {
    requests.transactionIDs.unshift(errorResponseStack.transactionID);
  }
  requests.highSeverityStack.unshift(errorResponseStack);
  return {
    ...requests,
    transactionIDs: [...requests.transactionIDs],
    highSeverityStack: [...requests.highSeverityStack]
  };
}

export function updateMediumSeverityStackErrorResponse(errorResponseStack: ErrorResponseModel, serviceError: ServiceError): ServiceError {
  const requests = {...serviceError};
  if (errorResponseStack.transactionID) {
    requests.transactionIDs.unshift(errorResponseStack.transactionID);
  }
  requests.mediumSeverityStack.unshift(errorResponseStack);
  return {
    ...requests,
    transactionIDs: [...requests.transactionIDs],
    mediumSeverityStack: [...requests.mediumSeverityStack]
  };
}

export function updateLowSeverityStackErrorResponse(errorResponseStack: ErrorResponseModel, serviceError: ServiceError): ServiceError {
  const requests = {...serviceError};
  if (errorResponseStack.transactionID) {
    requests.transactionIDs.unshift(errorResponseStack.transactionID);
  }
  requests.lowSeverityStack.unshift(errorResponseStack);
  return {
    ...requests,
    transactionIDs: [...requests.transactionIDs],
    lowSeverityStack: [...requests.lowSeverityStack]
  };
}

