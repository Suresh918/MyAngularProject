import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import {environment} from '../../environments/environment';
import * as fromAppReducers from './reducers/app.reducer';
import {parallelUpdateReducer} from './reducers/parallel-update.reducer';
import {CaseObjectState, MyChangeState} from '../shared/models/mc-store.model';
import {
  getActionsFromGraph,
  getCaseObjectLayoutState,
  getCaseObjectTabStatus,
  getFavoriteUpdate, getFieldDataState,
  getFieldUpdateState,
  getFileDragState,
  getFileUploadState,
  getFilterUpdate,
  getLayoutState,
  getMediumSeverityNotifications,
  getMediumSeverityNotificationsComplete,
  getNotificationsObject,
  getNotificationsRefreshState,
  getNotificationState,
  getParallelUpdateCaseObject,
  getParallelUpdateState,
  getRefreshLinkedItemsCount, getRefreshNotificationsCount, getRefreshTasksCount,
  getShowFullMenu,
  getShowLoader, getRefreshBackgroundTasks, getUpdatedBackgroundTaskCounts, getUpdatedBackgroundTasksDetails,
  getUserTouched
} from './selectors/app.selectors';
import {notificationReducer} from './reducers/notification.reducer';
import {fileUploadReducer} from './reducers/file-upload.reducer';
import {fieldUpdateReducer, selectAllFields, selectFieldEntities} from './reducers/field-update.reducer';
import * as fromCaseObjectReducer from './reducers/case-object.reducer';
import {caseObjectReducer} from './reducers/case-object.reducer';
import {getCaseActionState, getCaseObject, getCaseObjectType, getReadOnlyFields, getWriteAllowFields} from './selectors/case-object.selectors';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */

/**
 * Our state is composed getShowSideNavof a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export * from './actions/app.actions';
export * from './effects/backgroundTasks.effect';
export const reducers: ActionReducerMap<MyChangeState> = {
  router: fromRouter.routerReducer,
  layoutState: fromAppReducers.appLayoutReducer,
  parallelUpdateState: parallelUpdateReducer,
  notificationState: notificationReducer,
  fileUploadState: fileUploadReducer,
  fieldUpdateState: fieldUpdateReducer,
  caseObjectState: caseObjectReducer/*,*/
  /*caseActionState: caseActionReducer*/
};

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export function logger(reducer: ActionReducer<MyChangeState>): ActionReducer<MyChangeState> {
  return function (state: MyChangeState, action: any): MyChangeState {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<MyChangeState>[] = !environment.production
  ? [logger]
  : [];

/**
 * LayoutState Reducers
 */
export const getAppState = (state: MyChangeState) => state;
export const selectLayoutState = createSelector(getAppState, getLayoutState);
export const selectCaseObjectLayoutState = createSelector(selectLayoutState, getCaseObjectLayoutState);
export const selectRefreshLinkedItemsCount = createSelector(selectLayoutState, getRefreshLinkedItemsCount);
export const selectCaseObjectTabStatus = createSelector(selectLayoutState, getCaseObjectTabStatus);
export const selectShowLoader = createSelector(selectLayoutState, getShowLoader);
export const selectUserTouched = createSelector(selectLayoutState, getUserTouched);
export const selectShowFullMenu = createSelector(selectLayoutState, getShowFullMenu);
export const selectParallelUpdateState = createSelector(getAppState, getParallelUpdateState);
export const selectParallelUpdateCaseObject = createSelector(selectParallelUpdateState, getParallelUpdateCaseObject);
export const selectNotificationState = createSelector(getAppState, getNotificationState);
export const selectNotificationsObject = createSelector(selectNotificationState, getNotificationsObject);
export const selectMediumSeverityNotifications = createSelector(selectNotificationsObject, getMediumSeverityNotifications);
export const selectNotificationsRefreshState = createSelector(selectNotificationsObject, getNotificationsRefreshState);
export const selectMediumSeverityNotificationsComplete = createSelector(selectNotificationsObject, getMediumSeverityNotificationsComplete);
export const selectFilterUpdate = createSelector(selectLayoutState, getFilterUpdate);
export const selectFavoritesUpdate = createSelector(selectLayoutState, getFavoriteUpdate);
export const selectActionsFromGraph = createSelector(selectLayoutState, getActionsFromGraph);
export const selectFileUploadState = createSelector(getAppState, getFileUploadState);
export const selectFileDragState = createSelector(selectFileUploadState, getFileDragState);

export const selectFieldUpdateState = createSelector(getAppState, getFieldUpdateState);
export const selectFieldDataState = createSelector(selectFieldUpdateState, getFieldDataState);
export const selectCaseObjectState = createFeatureSelector<CaseObjectState>('caseObjectState');
export const selectCaseActionState = createSelector(selectCaseObjectState, getCaseActionState);
export const selectCaseObject = createSelector(selectCaseObjectState, getCaseObject);
export const selectCaseObjectType = createSelector(selectCaseObjectState, getCaseObjectType);
export const selectReadOnlyState = createSelector(selectCaseObjectState, getReadOnlyFields);
export const selectWriteAllowedState = createSelector(selectCaseObjectState, getWriteAllowFields);

export const selectAllCaseActions = createSelector(
  selectCaseActionState,
  fromCaseObjectReducer.selectCaseActions.selectAll
);

export const selectCaseActionEntities = createSelector(
  selectCaseActionState,
  fromCaseObjectReducer.selectActionEntities
);
export const selectFieldUpdateEntities = createSelector(
  selectFieldDataState,
  selectFieldEntities
);
export const selectAllFieldUpdates = createSelector(
  selectFieldDataState,
  selectAllFields
);
export const selectCaseObjectReadOnlyEntities = createSelector(
  selectReadOnlyState,
  fromCaseObjectReducer.selectReadOnlyEntities
);
export const selectCaseObjectWriteAllowedEntities = createSelector(
  selectWriteAllowedState,
  fromCaseObjectReducer.selectWriteAllowedEntities
);

export const selectCaseAction = createSelector(
  selectCaseActionEntities,
  (actionEntities, {actionData}: { actionData: any }) => {
    const key = actionData.caseObjectId + actionData.revision + actionData.type + actionData.action;
    if (actionEntities[key]) {
      if (actionEntities[key].hasOwnProperty('isAllowed')) {
        return actionEntities[key].isAllowed;
      }
      return true;
    }
    return false;
  });
export const selectMandatoryParameters = createSelector(
  selectCaseActionEntities,
  (actionEntities, {actionData}: { actionData: any }) => {
    const key = actionData.caseObjectId + actionData.revision + actionData.type + actionData.action;
    return actionEntities[key] ? actionEntities[key].mandatoryParameters : [];
  });
export const selectField = createSelector(selectFieldUpdateEntities, (fieldEntities, {fieldData}: { fieldData: any }) => {
  const key = fieldData.fieldId + fieldData.caseObject.ID + fieldData.caseObject.type;
  return fieldEntities[key];
});

export const selectReadOnlyFields = createSelector(
  selectCaseObjectReadOnlyEntities,
  (caseObjectReadOnlyEntities, {readOnlyData}: { readOnlyData: any }) => {
    const key = readOnlyData.caseObjectId + readOnlyData.revision + readOnlyData.type;
    return caseObjectReadOnlyEntities[key] ? caseObjectReadOnlyEntities[key].readOnlyParameters : [];
  });

export const selectWriteAllowFields = createSelector(
  selectCaseObjectWriteAllowedEntities,
  (caseObjectWriteAllowedEntities, {writeAllowedData}: { writeAllowedData: any }) => {
    const key = writeAllowedData.caseObjectId + writeAllowedData.revision + writeAllowedData.type;
    return caseObjectWriteAllowedEntities[key] ? caseObjectWriteAllowedEntities[key].writeAllowParameters : [];
  });

export const selectRefreshNotificationsCount = createSelector(selectLayoutState, getRefreshNotificationsCount);
export const selectRefreshBackgroundTasks = createSelector(selectLayoutState, getRefreshBackgroundTasks);
export const selectBackgroundTasksDetails = createSelector(selectLayoutState, getUpdatedBackgroundTasksDetails);
export const selectBackgroundTaskCounts = createSelector(selectLayoutState, getUpdatedBackgroundTaskCounts);
