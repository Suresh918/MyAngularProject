export enum ActionType {
  ProcessReview = 'PROCESS-REVIEW'
}

export enum NavBarPanel {
  Left = 'LEFT-PANEL',
  Right = 'RIGHT-PANEL',
  Both = 'BOTH',
  LeftClose = 'LEFT-PANEL-CLOSE',
  RightClose = 'RIGHT-PANEL-CLOSE',
  None = ''
}

export enum AgendaStatus {
  UnAssigned = 'UNASSIGNED',
  Assigned = 'ASSIGNED',
  Communicated = 'COMMUNICATED',
  PrepareMinutes = 'PREPARE-MINUTES',
  Completed = 'COMPLETED'
}

export enum AgendaCategory {
  CB = 'CB',
  CCB = 'CCB'
}

export enum CaseObjectType {
  ChangeRequest = 'CHANGEREQUEST',
  ChangeNotice = 'CHANGENOTICE',
  ReleasePackage = 'RELEASEPACKAGE',
  Agenda = 'AGENDA',
  AgendaItem = 'AGENDAITEM',
  Action = 'ACTION',
  Review = 'REVIEW',
  ReviewEntry = 'REVIEWENTRY',
  Dashboard = 'DASHBOARD',
  Trackerboard = 'TRACKERBOARD',
  DecisionLog = 'DECISIONLOG',
  MyTeam = 'MYTEAM',
  MyTeamManagement = 'MYTEAMMANAGEMENT',
  Announcement = 'ANNOUNCEMENT',
  Notification = 'NOTIFICATION'
}

export enum MenuCaseObjectLabel {
  changerequest = 'CR',
  changenotice = 'CN',
  releasepackage = 'RP',
  review = 'Review'
}

export enum filterOptionsTooltip {
  ccb = 'Change Control Board',
  cb = 'Change Board',
  productID = 'Product',
  projectID = 'Project',
  PCCSTRAIMIDs = 'Linked AIR ID',
  PBSIDs = 'Linked PBS ID',
  status = 'Status',
  customerImpact = 'Customer Impact',
  implementationPriority = 'Priority for Implementation',
  analysisPriority = 'Priority for Analysis',
  keywords = 'Keywords',
  linkedItems = 'Linked items',
  dueDate = 'Due Date',
  meetingDate = 'Meeting Date',
  plannedReleaseDate = 'Planned Release Date',
  actionType = 'Action Type',
  type = 'Action type',
  plannedEffectiveDate = 'Planned Effective Date',
  reviewedBy = 'Reviewer',
  role = 'Role',
  group = 'Group',
  department = 'Department',
  isActive = 'Published',
  priority = 'Priority',
  actionDates = 'Action Dates',
  actionStatus = 'Action Status',
  id = 'ID',
  decision = 'Decision',
  agendaCategory = 'Agenda Category',
  linkedChangeObject = 'Linked Change Object',
  tags = 'Tag',
  review_tasks_status = 'Review Task Status'
}

export enum FieldUpdateStates {
  progress = 'PROGRESS',
  success = 'SUCCESS',
  error = 'ERROR'
}

export enum FieldValueTypes {
  Multiple = 'multiple',
  Single = 'single'
}

export enum MeetingStates {
  before = 'before-meeting',
  after = 'after-meeting',
  during = 'during-meeting'
}

export enum AgendaItemCardTypes {
  beforeCb = 'before-meeting-cb',
  afterCb = 'after-meeting-cb',
  duringCb = 'during-meeting-cb',
  beforeCcb = 'before-meeting-ccb',
  afterCcb = 'after-meeting-ccb',
  duringCcb = 'during-meeting-ccb',
  beforeCbAob = 'before-meeting-cb-aob',
  afterCbAob = 'after-meeting-cb-aob',
  duringCbAob = 'during-meeting-cb-aob',
  beforeCcbAob = 'before-meeting-ccb-aob',
  afterCcbAob = 'after-meeting-ccb-aob',
  duringCcbAob= 'during-meeting-ccb-aob',
  beforeCbOffline = 'before-meeting-cb-offline',
  afterCbOffline = 'after-meeting-cb-offline',
  duringCbOffline = 'during-meeting-cb-offline'
}

export enum RequestTypes {
  Instance = 'instance',
  Element = 'element'
}
export enum AuditTypes {
  Add = 'ADD',
  Modify = 'MOD',
  Delete = 'DEL'
}
