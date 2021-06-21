import {Sort} from '@angular/material/sort';
import {McFiltersModel} from './mc-filters.model';
import {ActionHistoryModel, HistoryModel} from './mc-history-model';
import {DashboardWidgetConfigurationState} from '../../dashboard/dashboard.model';

export type CaseObjectState =
  CommonState
  | NavBarState
  | LinkedItemState
  | ChangeRequestState
  | ChangeNoticeState
  | ReleasePackageState
  | AgendaState
  | AgendaItemState
  | ActionState
  | ReviewState
  | ReviewEntryState
  | TrackerBoardState
  | DecisionLogState
  | MyTeamState
  | MyTeamManagementState
  | DashboardWidgetState
  | DashboardActionWidgetState
  | UpcomingMeetingsWidgetState;

export class McStatesModel {
  commonState?: CommonState;
  navBarState?: NavBarState;
  linkedItemState?: LinkedItemState;
  changeRequestState?: ChangeRequestState;
  changeNoticeState?: ChangeNoticeState;
  releasePackageState?: ReleasePackageState;
  agendaState?: AgendaState;
  agendaItemState?: AgendaItemState;
  actionState?: ActionState;
  reviewState?: ReviewState;
  reviewEntryState?: ReviewEntryState;
  trackerBoardState?: TrackerBoardState;
  decisionLogState?: DecisionLogState;
  myTeamState?: MyTeamState;
  myTeamManagementState?: MyTeamManagementState;
  dashboardWidgetState?: DashboardWidgetState;
  dashboardActionWidgetState?: DashboardActionWidgetState;
  upcomingMeetingsWidgetState?: UpcomingMeetingsWidgetState;
  announcementState?: AnnouncementState;
  notificationState?: NotificationState;
  adminState?: AdminState;
  caseObjectHistory?: CaseObjectHistory;
  readNotificationState?: NotificationState;
  unreadNotificationState?: NotificationState;
  dashboardNotificationWidgetState?: NotificationState;
  dashboardWidgetConfigurationState?: DashboardWidgetConfigurationState;

  constructor(stateModel?: McStatesModel) {
    stateModel = stateModel || {} as McStatesModel;
    stateModel.navBarState = new NavBarState(stateModel.navBarState);
    stateModel.commonState = new CommonState(stateModel.commonState);
    if (!(stateModel.linkedItemState && stateModel.linkedItemState.releasePackageSort && stateModel.linkedItemState.releasePackageSort.active)) {
      delete stateModel.linkedItemState;
    }
    stateModel.linkedItemState = new LinkedItemState(stateModel.linkedItemState);
    stateModel.changeRequestState = new ChangeRequestState(stateModel.changeRequestState);
    stateModel.changeNoticeState = new ChangeNoticeState(stateModel.changeNoticeState);
    stateModel.releasePackageState = new ReleasePackageState(stateModel.releasePackageState);
    stateModel.agendaState = new AgendaState(stateModel.agendaState);
    stateModel.agendaItemState = new AgendaItemState(stateModel.agendaItemState);
    stateModel.actionState = new ActionState(stateModel.actionState);
    stateModel.reviewState = new ReviewState(stateModel.reviewState);
    stateModel.reviewEntryState = new ReviewEntryState(stateModel.reviewEntryState);
    stateModel.trackerBoardState = new TrackerBoardState(stateModel.trackerBoardState);
    stateModel.decisionLogState = new DecisionLogState(stateModel.decisionLogState);
    stateModel.myTeamState = new MyTeamState(stateModel.myTeamState);
    stateModel.myTeamManagementState = new MyTeamManagementState(stateModel.myTeamManagementState);
    stateModel.dashboardWidgetState = new DashboardWidgetState(stateModel.dashboardWidgetState);
    stateModel.dashboardActionWidgetState = new DashboardActionWidgetState(stateModel.dashboardActionWidgetState);
    stateModel.upcomingMeetingsWidgetState = new UpcomingMeetingsWidgetState(stateModel.upcomingMeetingsWidgetState);
    stateModel.announcementState = new AnnouncementState(stateModel.announcementState);
    stateModel.notificationState = new NotificationState(stateModel.notificationState);
    stateModel.readNotificationState = new NotificationState(stateModel.readNotificationState);
    stateModel.unreadNotificationState = new NotificationState(stateModel.unreadNotificationState);
    stateModel.dashboardNotificationWidgetState = new NotificationState(stateModel.dashboardNotificationWidgetState);
    stateModel.adminState = new AdminState(stateModel.adminState);
    stateModel.caseObjectHistory = new CaseObjectHistory(stateModel.caseObjectHistory);
    stateModel.dashboardWidgetConfigurationState = new DashboardWidgetConfigurationState(stateModel.dashboardWidgetConfigurationState);
    return stateModel;
  }
}

export class CaseObjectHistory {
  actionHistory?: ActionHistoryModel;

// We can add other case object histories here if needed

  constructor(caseObjectHistory: CaseObjectHistory) {
    caseObjectHistory = caseObjectHistory || {} as CaseObjectHistory;
    caseObjectHistory.actionHistory = new ActionHistoryModel(caseObjectHistory.actionHistory);
    return caseObjectHistory;
  }
}

export class NavBarState {
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  leftPanelMode: string;
  rightPanelMode: string;
  caseObjectNavBarState: SidePanelState[];

  constructor(navBarState: NavBarState) {
    navBarState = navBarState || {} as NavBarState;
    navBarState.isLeftPanelOpen = navBarState.isLeftPanelOpen || false;
    navBarState.isRightPanelOpen = navBarState.isRightPanelOpen || false;
    navBarState.rightPanelMode = navBarState.rightPanelMode || '';
    navBarState.leftPanelMode = navBarState.leftPanelMode || '';
    navBarState.caseObjectNavBarState = navBarState.caseObjectNavBarState || [];
    return navBarState;
  }
}

export class SidePanelState {
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  leftPanelMode: string;
  rightPanelMode: string;
  caseObjectType: string;

  constructor(sidePanelState: SidePanelState) {
    sidePanelState = sidePanelState || {} as SidePanelState;
    sidePanelState.isLeftPanelOpen = sidePanelState.isLeftPanelOpen || false;
    sidePanelState.isRightPanelOpen = sidePanelState.isRightPanelOpen || false;
    sidePanelState.rightPanelMode = sidePanelState.rightPanelMode || '';
    sidePanelState.leftPanelMode = sidePanelState.leftPanelMode || '';
    sidePanelState.caseObjectType = sidePanelState.caseObjectType || '';
    return sidePanelState;

  }

}

export class CommonState {
  commonSearchState: CommonSearchState;

  constructor(commonState?: CommonState) {
    commonState = commonState || {} as CommonState;
    commonState.commonSearchState = new CommonSearchState(commonState.commonSearchState);
    return commonState;
  }
}

export class LinkedItemState {
  releasePackageSort: Sort;

  constructor(linkedItemState: LinkedItemState) {
    linkedItemState = linkedItemState || {} as LinkedItemState;
    linkedItemState.releasePackageSort = linkedItemState.releasePackageSort || {
      'direction': 'desc',
      'active': 'ID'
    } as Sort;
    return linkedItemState;
  }
}

export class ChangeRequestState {
  commonCaseObjectState: CommonCaseObjectState;
  imsPageState: ReadOnlyPageState;
  ciaPageState: ReadOnlyPageState;
  detailsPageState: DetailsPageState;
  airPbsDialogType?: string;

  constructor(changeRequestState?: ChangeRequestState) {
    changeRequestState = changeRequestState || {} as ChangeRequestState;
    changeRequestState.commonCaseObjectState = new CommonCaseObjectState(changeRequestState.commonCaseObjectState);
    changeRequestState.imsPageState = new ReadOnlyPageState(changeRequestState.imsPageState || {} as ReadOnlyPageState);
    changeRequestState.ciaPageState = new ReadOnlyPageState(changeRequestState.ciaPageState || {} as ReadOnlyPageState);
    changeRequestState.detailsPageState = new DetailsPageState(changeRequestState.detailsPageState || {} as DetailsPageState);
    return changeRequestState;
  }

}

export class ChangeNoticeState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(changeNoticeState?: ChangeNoticeState) {
    changeNoticeState = changeNoticeState || {} as ChangeNoticeState;
    changeNoticeState.commonCaseObjectState = new CommonCaseObjectState(changeNoticeState.commonCaseObjectState);
    return changeNoticeState;
  }
}

export class ReleasePackageState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(releasePackageState?: ReleasePackageState) {
    releasePackageState = releasePackageState || {} as ReleasePackageState;
    releasePackageState.commonCaseObjectState = new CommonCaseObjectState(releasePackageState.commonCaseObjectState);
    return releasePackageState;
  }
}

export class AgendaState {
  commonCaseObjectState: CommonCaseObjectState;
  infoPageState: InfoPageState;
  constructor(agendaState?: AgendaState) {
    agendaState = agendaState || {} as AgendaState;
    agendaState.commonCaseObjectState = new CommonCaseObjectState(agendaState.commonCaseObjectState);
    agendaState.infoPageState = new InfoPageState(agendaState.infoPageState || {} as InfoPageState);
    return agendaState;
  }
}

export class AgendaItemState {
  commonCaseObjectState: CommonCaseObjectState;
  agendaItemPageState: AgendaItemPageState;
  navBarState: NavBarState;

  constructor(agendaItemState?: AgendaItemState) {
    agendaItemState = agendaItemState || {} as AgendaItemState;
    agendaItemState.commonCaseObjectState = new CommonCaseObjectState(agendaItemState.commonCaseObjectState);
    agendaItemState.agendaItemPageState = new AgendaItemPageState(agendaItemState.agendaItemPageState || {} as AgendaItemPageState);
    agendaItemState.navBarState = new NavBarState(agendaItemState.navBarState || {} as NavBarState);
    return agendaItemState;
  }
}

export class ActionState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(actionState?: ActionState) {
    actionState = actionState || {} as ActionState;
    actionState.commonCaseObjectState = new CommonCaseObjectState(actionState.commonCaseObjectState);
    return actionState;
  }
}


export class ReviewState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(reviewState?: ReviewState) {
    reviewState = reviewState || {} as ReviewState;
    reviewState.commonCaseObjectState = new CommonCaseObjectState(reviewState.commonCaseObjectState);
    return reviewState;
  }
}

export class ReviewEntryState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(reviewEntryState?: ReviewEntryState) {
    reviewEntryState = reviewEntryState || {} as ReviewEntryState;
    reviewEntryState.commonCaseObjectState = new CommonCaseObjectState(reviewEntryState.commonCaseObjectState);
    return reviewEntryState;
  }
}

export class TrackerBoardState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(dashboardState?: TrackerBoardState) {
    dashboardState = dashboardState || {} as TrackerBoardState;
    dashboardState.commonCaseObjectState = new CommonCaseObjectState(dashboardState.commonCaseObjectState);
    return dashboardState;
  }
}

export class DecisionLogState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(decisionLogState?: DecisionLogState) {
    decisionLogState = decisionLogState || {} as DecisionLogState;
    decisionLogState.commonCaseObjectState = new CommonCaseObjectState(decisionLogState.commonCaseObjectState);
    return decisionLogState;
  }
}

export class MyTeamState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(myTeamState?: MyTeamState) {
    myTeamState = myTeamState || {} as MyTeamState;
    myTeamState.commonCaseObjectState = new CommonCaseObjectState(myTeamState.commonCaseObjectState);
    return myTeamState;
  }
}

export class MyTeamManagementState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(myTeamManagementState?: MyTeamManagementState) {
    myTeamManagementState = myTeamManagementState || {} as MyTeamManagementState;
    myTeamManagementState.commonCaseObjectState = new CommonCaseObjectState(myTeamManagementState.commonCaseObjectState);
    return myTeamManagementState;
  }
}

export class DashboardWidgetState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(dashboardWidgetState?: DashboardWidgetState) {
    dashboardWidgetState = dashboardWidgetState || {} as DashboardWidgetState;
    dashboardWidgetState.commonCaseObjectState = new CommonCaseObjectState(dashboardWidgetState.commonCaseObjectState);
    return dashboardWidgetState;
  }
}

export class DashboardActionWidgetState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(dashboardActionWidgetState?: DashboardActionWidgetState) {
    dashboardActionWidgetState = dashboardActionWidgetState || {} as DashboardActionWidgetState;
    dashboardActionWidgetState.commonCaseObjectState = new CommonCaseObjectState(dashboardActionWidgetState.commonCaseObjectState);
    return dashboardActionWidgetState;
  }
}

export class UpcomingMeetingsWidgetState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(upcomingMeetingsWidgetState?: UpcomingMeetingsWidgetState) {
    upcomingMeetingsWidgetState = upcomingMeetingsWidgetState || {} as UpcomingMeetingsWidgetState;
    upcomingMeetingsWidgetState.commonCaseObjectState = new CommonCaseObjectState(upcomingMeetingsWidgetState.commonCaseObjectState);
    return upcomingMeetingsWidgetState;
  }
}

export class AnnouncementState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(announcementState?: AnnouncementState) {
    announcementState = announcementState || {} as AnnouncementState;
    announcementState.commonCaseObjectState = new CommonCaseObjectState(announcementState.commonCaseObjectState);
    return announcementState;
  }
}

export class NotificationState {
  commonCaseObjectState: CommonCaseObjectState;

  constructor(notificationState?: NotificationState) {
    notificationState = notificationState || {} as NotificationState;
    notificationState.commonCaseObjectState = new CommonCaseObjectState(notificationState.commonCaseObjectState);
    return notificationState;
  }
}

export class AdminState {
  agendaState: AdminAgendaState;

  constructor(adminState?: AdminState) {
    adminState = adminState || {} as AdminState;
    adminState.agendaState = new AdminAgendaState(adminState.agendaState);
    return adminState;
  }
}

export class AdminAgendaState {
  selectedView: string;

  constructor(adminAgendaState?: AdminAgendaState) {
    adminAgendaState = adminAgendaState || {} as AdminAgendaState;
    adminAgendaState.selectedView = adminAgendaState.selectedView || '';
    return adminAgendaState;
  }
}

export class CommonSearchState {
  globalSearchHistory: string[];

  constructor(commonSearchState?: CommonSearchState) {
    commonSearchState = commonSearchState || {} as CommonSearchState;
    commonSearchState.globalSearchHistory = commonSearchState.globalSearchHistory || [] as string[];
    return commonSearchState;
  }
}

export class StateModel {
  panelState: string | string[];
  listView: boolean;
  selectedTabIndex: number; // used for notifications => unread-0, read-1

  constructor(stateModel?: StateModel) {
    stateModel = stateModel || {} as StateModel;
    stateModel.panelState = stateModel.panelState || '' as string;
    stateModel.listView = stateModel.listView || true as boolean;
    stateModel.selectedTabIndex = stateModel.selectedTabIndex || 0;
    return stateModel;
  }
}


export class CommonCaseObjectState {
  listSortConfiguration: Sort;
  listOverviewSortConfiguration: Sort;
  filters: McFiltersModel | string;
  filterHistory: HistoryModel;
  stateConfiguration: StateModel;
  sidePanelNotesToggleOption: string;

  constructor(commonCaseObjectState?: CommonCaseObjectState) {
    commonCaseObjectState = commonCaseObjectState || {} as CommonCaseObjectState;
    commonCaseObjectState.listSortConfiguration = commonCaseObjectState.listSortConfiguration || {} as Sort;
    commonCaseObjectState.listOverviewSortConfiguration = commonCaseObjectState.listOverviewSortConfiguration || {} as Sort;
    commonCaseObjectState.filters = commonCaseObjectState.filters || new McFiltersModel({});
    commonCaseObjectState.filterHistory = commonCaseObjectState.filterHistory || new HistoryModel({});
    commonCaseObjectState.stateConfiguration = commonCaseObjectState.stateConfiguration || new StateModel();
    commonCaseObjectState.sidePanelNotesToggleOption = commonCaseObjectState.sidePanelNotesToggleOption || '';
    return commonCaseObjectState;
  }
}

export class ReadOnlyPageState {
  fontSize: string;
  viewState: string;

  constructor(readOnlyPageState?: ReadOnlyPageState) {
    this.fontSize = readOnlyPageState.fontSize;
    this.viewState = readOnlyPageState.viewState;
  }
}
export class AgendaItemPageState {
  fontSize: string;

  constructor(agendaItemDetailsState?: AgendaItemPageState) {
    this.fontSize = agendaItemDetailsState.fontSize;
  }
}
export class DetailsPageState {
  fontSize: string;
  viewState: string;
  showInfoDialog: boolean;

  constructor(detailsPageState?: DetailsPageState) {
    this.fontSize = detailsPageState.fontSize;
    this.viewState = detailsPageState.viewState;
    this.showInfoDialog = detailsPageState.showInfoDialog;
  }
}

export class InfoPageState {
  showSendUpdateInfo: boolean;
  showSendMinutesInfo: boolean;

  constructor(infoPageState?: InfoPageState) {
    this.showSendUpdateInfo = infoPageState.showSendUpdateInfo;
    this.showSendMinutesInfo = infoPageState.showSendMinutesInfo;
  }
}

export class FixedSizeQueue {
  size: number;
  data: any[];

  constructor(size: number, data?: any) {
    this.size = size;
  }

  setData(data?: any): void {
    if (data) {
      if (Array.isArray(data)) {
        if (data.length >= this.size) {
          this.data = data[this.size - 1].reverse();
        } else {

        }
      }
    }
  }
}
