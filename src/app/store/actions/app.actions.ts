import {Action, createAction, props} from '@ngrx/store';
import {CaseObjectLayout, CaseObjectTabStatus, Payload} from '../../shared/models/mc-store.model';
import {ActionsGraphForm, Categories, Category} from '../../shared/models/mc-presentation.model';

enum AppActionTypes {
  LoadInitialStateFromStore = '[App] Load initial App state from Store',
  setCaseObjectLayout = '[App] Set Case object layout',
  SaveStateInSessionStorage = '[APP] Save State In Session Storage',
  ShowLoader = '[APP] Show/Hide loader',
  UserTouch = '[APP] User touched the form',
  ShowFullMenu = '[APP] Main Menu visibility handler',
  FilterOptionsUpdate = '[APP] Filter options update',
  FavoritesUpdate = '[APP] Favorites update',
  ActionsFromGraph = '[APP] Actions from graph',
  RefreshLinkedItemsCount = '[APP] Refresh linked items count',
  ChangeCaseObjectTabStatus = '[APP] save state of current tab',
  ResetCaseObjectTabStatus =  '[APP] reset state of current tab',
  GetAttendeesForAgendaItem = '[APP] Fetch attendees of agenda item',
  RefreshNotificationsCount = '[APP] Refresh Notifications in header',
  LoadBackgroundTasks = '[APP] Refresh Tasks in header',
  BackgroundTasksUpdate = '[APP] Update background tasks',
  BackgroundTaskCountsUpdate = '[APP] Update background task counts',
  RefreshBackgroundTasks = '[APP] Show task loader'
}

export const loadInitialStateFromStore = createAction(AppActionTypes.LoadInitialStateFromStore);
export const saveStateInSessionStorage = createAction(AppActionTypes.SaveStateInSessionStorage);
export const setCaseObjectLayout = createAction(AppActionTypes.setCaseObjectLayout, props<CaseObjectLayout>());
export const changeCaseObjectTabStatus = createAction(AppActionTypes.ChangeCaseObjectTabStatus, props<CaseObjectTabStatus>());
export const resetCaseObjectTabStatus = createAction(AppActionTypes.ResetCaseObjectTabStatus);
export const showLoader = createAction(AppActionTypes.ShowLoader, (value: boolean) => ({showLoader: value}));
export const userTouch = createAction(AppActionTypes.UserTouch, (value: boolean) => ({userTouched: value}));
export const showFullMenu = createAction(AppActionTypes.ShowFullMenu, (value: boolean) => ({showFullMenu: value}));
export const filterOptionsUpdate = createAction(AppActionTypes.FilterOptionsUpdate, (value: boolean) => ({filterUpdated: value}));
export const favoritesUpdate = createAction(AppActionTypes.FavoritesUpdate, (value: boolean) => ({favoritesUpdate: value}));
export const actionsFromGraph = createAction(AppActionTypes.ActionsFromGraph, props<ActionsGraphForm>());
export const refreshLinkedItemsCount = createAction(AppActionTypes.RefreshLinkedItemsCount, (value: boolean) => ({refreshLinkedItemsCount: value}));
export const refreshNotificationsCount = createAction(AppActionTypes.RefreshNotificationsCount, (value: boolean) => ({refreshNotificationsCount: value}));
// action to trigger background task counts
export const refreshBackgroundTasks = createAction(AppActionTypes.RefreshBackgroundTasks, (value: boolean) => ({refreshBackgroundTasks: value}));
//  action to fetch background task counts
export const loadBackgroundTaskCounts = createAction(AppActionTypes.LoadBackgroundTasks, (value: boolean) => ({loadTasksCount: value}));
// action to fetch the background task details
export const backgroundTaskDetailsUpdated = createAction(AppActionTypes.BackgroundTasksUpdate, (value: Categories) => ({tasksUpdated: value}));
export const backgroundTaskCountsUpdated = createAction(AppActionTypes.BackgroundTaskCountsUpdate, (value: Categories[]) => ({updatedBackgroundTaskCounts: value}));
