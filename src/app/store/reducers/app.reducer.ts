import * as AppActionTypes from '../actions/app.actions';
import {LayoutState} from '../../shared/models/mc-store.model';
import {McSessionStorageService} from '../../core/services/mc-session-storage.service';
import {Action, createReducer, on} from '@ngrx/store';


const initialState: LayoutState = {
  caseObjectLayout: {
    showActionsPanel: false // to open actions when clicked on action from header actions panel, gets reset when user clicks on any side menu item
  },
  refreshLinkedItemsCount: false,
  refreshNotificationsCount: false,
  loadTasksCount: false,
  showLoader: Boolean(false),
  refreshBackgroundTasks: Boolean(false),
  userTouched: Boolean(false),
  showFullMenu: Boolean(true),
  filterUpdate: Boolean(false),
  favoritesUpdate: Boolean(false),
  actionsFromGraph: {
    fromGraph: false,
    caseObject: ''
  },
  caseObjectTabStatus: {
    caseObject: '',
    currentTab: null
  },
  tasksUpdated: null,
  updatedBackgroundTaskCounts: []
};

const _appLayoutReducer = createReducer(initialState,
  on(AppActionTypes.loadInitialStateFromStore, () => {
    const currentStateFromSession = new McSessionStorageService().getState();
    return currentStateFromSession ? currentStateFromSession : initialState;
  }),
  on(AppActionTypes.setCaseObjectLayout, (state, actionData) => {
    return {
      ...state,
      caseObjectLayout: actionData
    };
  }),
  on(AppActionTypes.changeCaseObjectTabStatus, (state, actionData) => {
    return {
      ...state,
      caseObjectTabStatus: actionData
    };
  }),
  on(AppActionTypes.resetCaseObjectTabStatus, (state) => {
    return {
      ...state,
      caseObjectTabStatus: initialState.caseObjectTabStatus
    };
  }),
  on(AppActionTypes.filterOptionsUpdate, (state, actionData) => {
    return {
      ...state,
      filterUpdate: new Boolean(actionData.filterUpdated)
    };
  }),
  on(AppActionTypes.favoritesUpdate, (state, actionData) => {
    return {
      ...state,
      favoritesUpdate: new Boolean(actionData.favoritesUpdate)
    };
  }),
  on(AppActionTypes.actionsFromGraph, (state, actionData) => {
    return {
      ...state,
      actionsFromGraph: actionData
    };
  }),
  on(AppActionTypes.saveStateInSessionStorage, (state) => {
    new McSessionStorageService().setItem(initialState);
    return {
      ...state,
      caseObjectLayout: initialState.caseObjectLayout
    };
  }),
  on(AppActionTypes.refreshLinkedItemsCount, (state, actionData) => {
    return {
      ...state,
      refreshLinkedItemsCount: new Boolean(actionData.refreshLinkedItemsCount)
    };
  }),
  on(AppActionTypes.showLoader, (state, actionData) => {
    return {
      ...state,
      showLoader: new Boolean(actionData.showLoader)
    };
  }),
  on(AppActionTypes.refreshBackgroundTasks, (state, actionData) => {
    return {
      ...state,
      refreshBackgroundTasks: new Boolean(actionData.refreshBackgroundTasks)
    };
  }),
  on(AppActionTypes.userTouch, (state, actionData) => {
    return {
      ...state,
      userTouched: new Boolean(actionData.userTouched)
    };
  }),
  on(AppActionTypes.showFullMenu, (state, actionData) => {
    return {
      ...state,
      showFullMenu: new Boolean(actionData.showFullMenu)
    };
  }),
  on(AppActionTypes.refreshNotificationsCount, (state, actionData) => {
    return {
      ...state,
      refreshNotificationsCount: new Boolean(actionData.refreshNotificationsCount)
    };
  }),
  on(AppActionTypes.loadBackgroundTaskCounts, (state, actionData) => {
    return {
      ...state,
      loadTasksCount: new Boolean(actionData.loadTasksCount)
    };
  }),
  on(AppActionTypes.backgroundTaskDetailsUpdated, (state, actionData) => {
    return {
      ...state,
      tasksUpdated: actionData.tasksUpdated
    };
  }),
  on(AppActionTypes.backgroundTaskCountsUpdated, (state, actionData) => {
    return {
      ...state,
      updatedBackgroundTaskCounts: actionData.updatedBackgroundTaskCounts
    };
  })
);

export function appLayoutReducer(state: LayoutState, action: Action): LayoutState {
  return _appLayoutReducer(state, action);
}
