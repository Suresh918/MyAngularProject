import {
  CaseObjectLayout,
  FieldUpdateState,
  FileUploadState,
  LayoutState,
  MyChangeState,
  NotificationsObject,
  NotificationState,
  ParallelUpdateState
} from '../../shared/models/mc-store.model';

export const getLayoutState = (myChangeState: MyChangeState) => myChangeState.layoutState;
export const getCaseObjectLayoutState = (layoutState: LayoutState) => layoutState.caseObjectLayout;
export const getRefreshLinkedItemsCount = (caseObjectLayout: CaseObjectLayout) => caseObjectLayout.refreshLinkedItemsCount;
export const getShowLoader = (layoutState: LayoutState) => layoutState.showLoader;
export const getFilterUpdate = (layoutState: LayoutState) => layoutState.filterUpdate;
export const getFavoriteUpdate = (layoutState: LayoutState) => layoutState.favoritesUpdate;
export const getActionsFromGraph = (layoutState: LayoutState) => layoutState.actionsFromGraph;
export const getUserTouched = (layoutState: LayoutState) => layoutState.userTouched;
export const getParallelUpdateState = (myChangeState: MyChangeState) => myChangeState.parallelUpdateState;
export const getParallelUpdateCaseObject = (parallelUpdateState: ParallelUpdateState) => parallelUpdateState.parallelUpdateCaseObject;
export const getShowFullMenu = (layoutState: LayoutState) => layoutState.showFullMenu;
export const getNotificationState = (myChangeState: MyChangeState) => myChangeState.notificationState;
export const getNotificationsObject = (notificationState: NotificationState) => notificationState.notificationsObject;
export const getMediumSeverityNotifications = (notificationsObject: NotificationsObject) => notificationsObject.mediumSeverityNotifications;
export const getMediumSeverityNotificationsComplete = (notificationsObject: NotificationsObject) => notificationsObject.mediumSeverityNotificationsCompleted;
export const getNotificationsRefreshState = (notificationsObject: NotificationsObject) => notificationsObject.notificationsRefreshed;
export const getFileUploadState = (myChangeState: MyChangeState) => myChangeState.fileUploadState;
export const getFileDragState = (fileUploadState: FileUploadState) => fileUploadState.fileDragData;
export const getFieldUpdateState = (myChangeState: MyChangeState) => myChangeState.fieldUpdateState;
export const getFieldDataState = (fieldUpdateState: FieldUpdateState) => fieldUpdateState.fieldDataState;
export const getCaseObjectTabStatus = (layoutState: LayoutState) => layoutState.caseObjectTabStatus;
export const getRefreshNotificationsCount = (layoutState: LayoutState) => layoutState.refreshNotificationsCount;


export const getRefreshTasksCount = (layoutState: LayoutState) => layoutState.loadTasksCount;

export const getRefreshBackgroundTasks = (layoutState: LayoutState) => layoutState.refreshBackgroundTasks;
export const getUpdatedBackgroundTasksDetails = (layoutState: LayoutState) => layoutState.tasksUpdated;
export const getUpdatedBackgroundTaskCounts = (layoutState: LayoutState) => layoutState.updatedBackgroundTaskCounts;
