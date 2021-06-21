import {NavBarState, NotificationsObject, NotificationState} from '../../shared/models/mc-store.model';
import * as NotificationActionTypes from '../actions/notification.actions';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: NotificationState = {
  notificationsObject: {
    highSeverityNotifications: {
      notificationList: [],
      isPreview: false,
      notificationCompleted: false
    },
    mediumSeverityNotifications: {
      notificationList: [],
      isPreview: false,
      notificationCompleted: false
    },
    lowSeverityNotifications: {
      notificationList: [],
      isPreview: false,
      notificationCompleted: false
    }
  } as NotificationsObject
} as NotificationState;

const _notificationReducer = createReducer(initialState,
  on(NotificationActionTypes.notificationsRefreshAction, (state, actionData) => {
    return {
      ...state,
      notificationsObject: {
        ...state.notificationsObject,
        notificationsRefreshed: new Boolean(actionData.notificationsRefreshed)
      }
    };
  }),
  on(NotificationActionTypes.sendMediumSeverityNotificationsAction, (state, actionData) => {
    return {
      ...state,
      notificationsObject: {
        ...state.notificationsObject,
        mediumSeverityNotifications: {
          ...state.notificationsObject.mediumSeverityNotifications,
          notificationList: actionData.mediumSeverityNotificationList,
          isPreview: new Boolean(actionData.isPreview),
          showSharePointLink: new Boolean(actionData.showSharePointLink)
        }
      }
    };
  }),
  on(NotificationActionTypes.mediumSeverityNotificationsCompleteAction, (state, actionData) => {
    return {
      ...state,
      notificationsObject: {
        ...state.notificationsObject,
        mediumSeverityNotificationsCompleted: new Boolean(actionData.mediumSeverityNotificationsCompleted)
      }
    };
  }));

export function notificationReducer(state: NotificationState, action: Action): NotificationState {
  return _notificationReducer(state, action);
}
