import {createAction} from '@ngrx/store';
import {Announcement} from '../../shared/models/mc-presentation.model';


enum NotificationActionTypes {
  SendMediumSeverityNotifications = '[Notification] send medium severity notification',
  MediumSeverityNotificationsComplete = '[Notification] medium severity notifications complete',
  RefreshNotifications = '[Notification] notifications refresh'
}

export const notificationsRefreshAction = createAction(NotificationActionTypes.RefreshNotifications, (doRefresh) => {
  return {notificationsRefreshed: doRefresh};
});
export const sendMediumSeverityNotificationsAction = createAction(NotificationActionTypes.SendMediumSeverityNotifications,
  (notificationList: Announcement[], isPreview: boolean, showSharePointLink: boolean) => {
    return {mediumSeverityNotificationList: notificationList, isPreview: isPreview, showSharePointLink: showSharePointLink};
  });
export const mediumSeverityNotificationsCompleteAction = createAction(NotificationActionTypes.MediumSeverityNotificationsComplete,
  (isCompleted: boolean) => {
    return {mediumSeverityNotificationsCompleted: isCompleted};
  });
