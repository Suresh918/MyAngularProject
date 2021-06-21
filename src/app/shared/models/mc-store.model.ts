import * as fromRouter from '@ngrx/router-store';
import {RequestModel, ResponseModel} from './error-handling.model';
import {Agenda, AgendaItem, ChangeNotice, ChangeRequest, ReleasePackage, Review} from './mc.model';
import {ActionsGraphForm, Announcement, Categories} from './mc-presentation.model';
import {CaseActionState, CaseObjectReadOnlyState, CaseObjectWriteAllowedState} from './case-action.model';
import {FieldDataState} from './mc-field-update.model';

export interface MyChangeState {
  layoutState?: LayoutState;
  changeRequestState?: ChangeRequestState;
  changeNoticeState?: ChangeNoticeState;
  router?: fromRouter.RouterReducerState;
  sidePanelState?: SidePanelState;
  errorState?: ErrorState;
  actionState?: ActionState;
  reviewState?: ReviewState;
  releasePackageState?: ReleasePackageState;
  agendaState?: AgendaState;
  decisionLogState?: DecisionLogState;
  parallelUpdateState?: ParallelUpdateState;
  notificationState: NotificationState;
  fileUploadState?: FileUploadState;
  fieldUpdateState?: FieldUpdateState;
  caseObjectState?: CaseObjectState;
}

export interface LayoutState {
  caseObjectLayout?: CaseObjectLayout;
  refreshLinkedItemsCount?: Boolean;
  refreshNotificationsCount?: Boolean;
  loadTasksCount?: Boolean;
  showLoader?: Boolean;
  refreshBackgroundTasks?: Boolean;
  userTouched?: Boolean;
  showFullMenu?: Boolean;
  filterUpdate?: Boolean;
  favoritesUpdate?: Boolean;
  actionsFromGraph?: ActionsGraphForm;
  caseObjectTabStatus?: CaseObjectTabStatus;
  tasksUpdated?: Categories;
  updatedBackgroundTaskCounts?: Categories[];
}

export interface CaseObjectState {
  caseObject?: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem | Review;
  caseActionState?: CaseActionState;
  caseObjectReadOnlyState?: CaseObjectReadOnlyState;
  caseObjectWriteAllowedState?: CaseObjectWriteAllowedState;
  caseObjectType?: string;
}

export interface FieldUpdateState {
  fieldDataState: FieldDataState;
}

export interface ChangeRequestState {
  changeRequestListState?: ChangeRequestListState;
}

export interface ChangeNoticeState {
  changeNoticeListState?: ChangeNoticeListState;
}

export interface CaseObjectLayout {
  showActionsPanel?: boolean;
  refreshLinkedItemsCount?: Boolean;
}

export interface Payload {
  page: string;
  caseObjectFormGroup: any;
  preDefinedActionFilter: string;
  showRightPanel: boolean;
  createAction: boolean;
  showNotes: boolean;
}

export interface ReviewState {
  reviewListState?: ReviewListState;
  reviewEntryListState?: ReviewEntryListState;
}

export interface ReviewPayload {
  reviewStatus: string;
  caseActions: string[];
  reviewEntryMandatoryFields: string[];
  reviewer: any;
}

export interface SidePanelReviewState {
  reviewPayload: ReviewPayload;
  currentReviewId?: number;
  reviewEntryStatusChanged?: Boolean;
}

export interface NavBarPayload {
  isOpen: Boolean;
  panelMode: string;
  isPanelFormDirty: Boolean;
}

export interface NavBarState {
  leftNavBarState: NavBarPayload;
  rightNavBarState: NavBarPayload;
}

export interface SidePanelState {
  leftSidePanelState: LeftSidePanelState;
  rightSidePanelState: RightSidePanelState;
  navBarState: NavBarState;
}

export interface LeftSidePanelState {
  sidePanelReviewState: SidePanelReviewState;
}

export interface RightSidePanelState {
  rightSidePanelReviewState: RightSidePanelReviewState;
  rightSidePanelReviewerState: RightSidePanelReviewerState;
}

export interface RightSidePanelReviewState {
  updateReviewerList: Boolean;
}

export interface RightSidePanelReviewerState {
  updateReviewCaseActions: Boolean;
}

export interface ErrorState {
  serviceError: ServiceError;
}

export interface NotificationState {
  notificationsObject: NotificationsObject;
}

export interface ServiceError {
  transactionIDs: string[];
  requestStack: RequestModel[];
  responseStack: ResponseModel[];
  highSeverityStack?: ErrorResponseModel[];
  mediumSeverityStack?: ErrorResponseModel[];
  lowSeverityStack?: ErrorResponseModel[];
  errorPopupClosed?: Boolean;
}

export interface ActionState {
  actionListState: ActionListState;
}

export interface ReleasePackageState {
  releasePackageListState: ReleasePackageListState;
}

export interface AgendaState {
  agendaListState?: AgendaListState;
  agendaDetailsState?: AgendaDetailsState;
  agendaItemDetailsState?: AgendaItemDetailsState;
}

export interface DecisionLogState {
  decisionLogListState?: DecisionLogListState;
}

export interface ErrorResponseModel {
  transactionID?: string;
  statusCode?: any;
  errorMessage?: string;
  linkUrl?: string;
  disableOverlay?: boolean;
}

export interface ErrorResponse {
  TransactionID?: string;
  Detail?: ErrorDetail;
}

export interface ErrorDetail {
  Severity?: string;
  Code?: string;
  Message?: string;
}

export interface ChangeNoticeListState {
  changeNoticeListPaginatorValue?: number;
  myTeamListValue?: any[];
}

export interface ChangeRequestListState {
  changeRequestListPaginatorValue?: number;
  myTeamListValue?: any[];
}

export interface ActionListState {
  actionListPaginatorValue?: number;
}

export interface ReleasePackageListState {
  releasePackageListPaginatorValue?: number;
}

export interface ReviewListState {
  reviewListPaginatorValue?: number;
}

export interface ReviewEntryListState {
  reviewEntryListPaginatorValue?: number;
  reviewTasksValue?: any[];
}

export interface AgendaListState {
  agendaListPaginatorValue?: number;
}

export interface AgendaDetailsState {
  agendaItemDurationChange: AgendaItemDurationChange;
}

export interface AgendaItemDurationChange {
  agendaItemID?: string;
  agendaSequence?: number;
  changeInDurationOfAgendaItem?: string;
}


export interface DecisionLogListState {
  decisionLogListPaginatorValue?: number;
}

export interface ParallelUpdateState {
  parallelUpdateCaseObject: ParallelUpdateCaseObject;
}

export interface ParallelUpdateCaseObject {
  currentObject: any;
  objectType: string;
  caseAction: string;
  saveObject: boolean;
  controlConfiguration?: any;
  agendaItemListSummary: any;
  meetingBody: any;
}

export interface NotificationsObject {
  highSeverityNotifications?: NotificationDetail;
  mediumSeverityNotifications?: NotificationDetail;
  lowSeverityNotifications?: NotificationDetail;
  notificationsRefreshed?: Boolean;
  mediumSeverityNotificationsCompleted?: Boolean;
}

export interface NotificationDetail {
  notificationList?: Announcement[];
  isPreview?: Boolean;
  showSharePointLink?: Boolean;
}

export interface FileUploadState {
  fileDragData: FileDragData;
}

export interface FileDragData {
  action?: string;
  fileData?: File [];
  dropAreaHighlighted?: Boolean;
}

export interface CaseObjectTabStatus {
  caseObject: string;
  currentTab: number;
}

export interface AgendaItemDetailsState {
  attendeesUpdated: string;
}
