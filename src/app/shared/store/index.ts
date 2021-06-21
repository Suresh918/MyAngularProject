import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {serviceErrorReducer} from './reducers/service-error.reducer';
import {getErrorPopupClosed, getHighSeverityStackState, getLowSeverityStackState, getMediumSeverityStackState, getServiceError} from './selectors/service-error.selectors';
import {ErrorState} from '../models/mc-store.model';

export * from './actions/service-error.actions';
export const errorStoreReducers: ActionReducerMap<ErrorState> = {
  serviceError: serviceErrorReducer
};

export const selectErrorState = createFeatureSelector('errorStore');
export const selectServiceError = createSelector(selectErrorState, getServiceError);
export const selectHighSeverityStackState = createSelector(selectServiceError, getHighSeverityStackState);
export const selectMediumSeverityStackState = createSelector(selectServiceError, getMediumSeverityStackState);
export const selectLowSeverityStackState = createSelector(selectServiceError, getLowSeverityStackState);
export const selectErrorPopupClose = createSelector(selectServiceError, getErrorPopupClosed);

