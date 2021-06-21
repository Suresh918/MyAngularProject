import {
  Action,
  Agenda,
  AgendaItem,
  CaseObject,
  ChangeRequest,
  Decision,
  ReleasePackage,
  Review,
  ReviewEntry, ReviewItem,
  User, MiraiUser, AuditData, ReviewTaskAuditAggregate, AuditEntry, ChangeNotice, ImpactedItem, Context, MyTeam
} from './mc.model';
import {FormGroup} from '@angular/forms';
import {FormControlConfiguration, FormControlEnumeration} from './mc-configuration.model';
import {AuditTypes} from './mc-enums';

export interface NavObj {
  actions?: number | null;
  notes?: number | null;
  page?: string;
  data?: any | null;
  actionsData?: any | null;
  createAction?: boolean | null;
  actionFilter?: string | null;
  showNotes?: boolean | null;
}

export interface AbstractReleasePackage extends ReleasePackage {
  caseActions?: any;
}

export interface AbstractUser extends User {
  selected?: boolean;
}

export interface ChangeRequestSummary {
  ID?: string;
  linkedToCN?: boolean;
  status?: string;
  title?: string;
  totalActions?: number;
  customerImpactResult?: string;
  preInstallImpactResult?: string;
  implementationPriority?: string;
}

export interface AbstractAction extends Action {
  showNotesSection?: boolean;
  showCaseActionsSection?: boolean;
  iconStatus?: boolean;
  showRemoveBtn?: boolean;
  isUserIsAOwner?: boolean;
  isUserIsACreator?: boolean;
  showCompleteBtn?: boolean;
}

export interface AggregatedActionList {
  totalItems: number;
  aggregatedActions: AggregatedAction[];
}

export interface AggregatedAction {
  action: Action;
  link: Link;
  linkObjectSummary: LinkObjectSummary;
  communicationObjectSummary: CommunicationObjectSummary;
  totalNotes?: string;
  actionMetadata: ActionMetadata;
}

export interface ActionSummaryList {
  totalItems: number;
  actionSummary?: ActionSummary[];
  actionOverview?: ActionSummary[];
}

export interface ActionSummary {
  actionElement?: Action;
  linkElement?: Link;
  totalNotes?: string;
  actionMetadata?: ActionMetadata;
  isAcceptAllowed?: boolean;
  isRejectAllowed?: boolean;
  isCompleteAllowed?: boolean;
  category?: string;
  expiry?: string;
  statusLabel: string;
}

export interface AggregatedAgendaList {
  totalItems: number;
  aggregatedAgendas: Agenda[];
}

export interface Link {
  ID: string;
  revision?: string;
  type: string;
  status?: string;
  title?: string;
  priorityOfImplementation?: string;
  priorityOfAnalysis?: string;
  plannedReleaseDate?: string;
  plannedEffectiveDate?: string;
}

export interface LinkObjectSummary {
  ID?: string;
  id?: string;
  revision?: string;
  type: string;
  status?: string;
  title?: string;
  priorityLabel: string;
  totalOpenActions: number;
  totalDueSoonActions: number;
  totalOverdueActions: number;
  project: Project;
  implementationPriority: number;
  totalMyteamUsers: number;
  release_package_number: string;
}

export interface Project {
  definition: string;
}

export interface CommunicationObjectSummary {
  agenda: Agenda;
  totalOfflineAgendaItems: number;
  totalOnlineAgendaItems: number;
}

export interface ActionMetadata {
  showNotesSection?: boolean;
  showCaseActionsSection?: boolean;
  iconStatus?: string;
  showRemoveBtn?: boolean;
  isUserIsAOwner?: boolean;
  isUserIsACreator?: boolean;
  showCompleteBtn?: boolean;
}

export interface ActionCountSummaryList {
  totalItems: number;
  actionCountSummaries: ActionCountSummary[];
}

export interface ActionCountSummary {
  assignee: User;
  open: number;
  accepted: number;
  completed: number;
  rejected: number;
}

export interface Categories {
  TotalItems?: number;
  totalItems?: number;
  total_items?: number;
  categories?: Category[];
}

export interface Category {
  name?: string;
  sub_categories?: SubCategory[];
  subCategories: SubCategory[];
  totalItems?: number;
  total_items?: number;
  TotalItems?: number;
}

export interface BackgroundTaskCount {
  totalItems?: number;
}

export interface SubCategory {
  items: SubCategoryItem[];
  name?: string;
}

export interface SubCategoryItem {
  ID?: string;
  id?: string;
  job?: SubCategoryItem;
  type?: string;
  agendaSequenceNumber?: number;
  decision?: Decision;
  creator?: MiraiUser;
  isAOB?: boolean;
  link?: Link;
  action?: string;
  plannedDuration?: string;
  presenter?: User;
  purpose?: string;
  section?: string;
  context?: any;
  title?: string;
  startDateTime?: Date | string;
  // notificationDetails?: NotificationDetail;
}


export interface SidePanel {
  page?: string;
  caseObjectFormGroup?: FormGroup;
  showRightPanel?: boolean;
  createAction?: boolean;
  showNotes?: boolean;
  preDefinedActionFilter?: string;
}

export interface ReviewEntrySummaryList {
  totalItems: number;
  reviewEntrySummaries: ReviewEntrySummary[];
}

export interface ReviewEntrySummary {
  ID: string;
  status: string;
  classification: string;
  classification_label: string;
  description: string;
  reviewer: User;
  reviewItem: ReviewItem;
  notesCount: number;
  executorRemark: string;
  caseActions: string[];
}

export interface ReviewSummaryList {
  totalItems: number;
  reviewList: ReviewSummary[];
}

export interface ReviewSummary {
  ID: string;
  title: string;
  deadline: Date;
  status: string;
  totalCompletedActions: number;
  totalActions: number;
  totalCompletedReviewEntries: number;
  totalReviewEntries: number;
  link: LinkElement;
  sourceSystemID: string;
  sourceSystemAliasID: string;
  statusLabel: string;
}

export interface ReviewSummaryListNew {
  total_elements: number;
  total_pages: number;
  has_next: boolean;
  results: ReviewSummaryNew[];
}

export interface ReviewSummaryNew {
  id: number;
  title: string;
  completion_date: string;
  status: number;
  status_label: string;
  releasepackage_id: string;
  releasepackage_name: string;
  ecn_id: string;
  ecn_name: string;
  completed_review_task_count: number;
  review_task_count: number;
  completed_review_entry_count: number;
  review_entry_count: number;
  teamcenter_id: string;
}

export interface ECNReviewSummaryList {
  total_elements: number;
  total_pages: number;
  has_next: boolean;
  results: ECNReviewSummary[];
}

export interface ECNReviewSummary {
  id: number;
  title: string;
  completion_date: string;
  status: number;
  status_label: string;
  completed_review_task_count: number;
  review_task_count: number;
  releasepackage_id: string;
  releasepackage_name: string;
  teamcenter_id: string;
  teamcenter: string;
  ecn_id: string;
  ecn_name: string;
}

export interface MeetingElement {
  body: any;
  bodyType: string;
  MeetingElement: any;
}

export interface DecisionLogSummary {
  totalItems: number;
  decisionLogList: DecisionLogItem[];
}

export interface DecisionLogItem {
  agendaItemID: string;
  agendaItemStatus: string;
  statusLabel: string;
  minutes: string;
  conclusion: string;
  actualMeetingDate: string;
  communicatedOnDate: string;
  linkElements: any;
  attendeesPresent: any;
}

export interface MetaDataConfiguration {
  abbreviation?: string;
  explanation?: string;
  placeholder?: string;
  label?: string;
}


export interface PreferredRoleFormConfiguration {
  [key: string]: PreferredRoleForm;
}

export interface ExternalLinkFormConfiguration {
  [key: string]: ExternalLinkForm;
}

export interface ExternalLinkForm {
  name: string;
  values: FormControlEnumeration[];
}

export interface PreferredRoleForm {
  explanation: string;
  enumeration: FormControlEnumeration;
  roleSelected?: boolean;
  key?: string[];
  highlighted?: boolean;
  hovered?: boolean;
}

export interface Announcement {
  title?: string;
  message?: string;
  effectiveEndDate?: Date;
  priority?: number;
  isActive?: string | boolean;
  ID?: string;
  isRead?: string;
  application?: string;
  lastModifiedOn?: Date;
  activeDate?: Date;
  label?: string;
  createdBy?: User;
  createdOn?: Date;
  link?: string;
}


export interface Favorite {
  case?: Link;
  details?: FavoriteDetail;
  id?: string;
  type?: string;
  name?: string;
}

export interface FavoriteDetail {
  title: string;
}

export interface Links {
  name: string;
  url: string;
  label: string;
  hint: string;
}

export interface EndDateForm {
  [key: string]: any;
}

export interface EndDates {
  name: string;
  date: Date;
}

export interface ActionsGraphForm {
  fromGraph: boolean;
  caseObject: string;
}

export interface ReleasePackageStatePanelForm {
  caseObjectStatus?: string;
  caseObjectState?: string;
  caseObjectsCount?: number;
  openActionsCount?: number;
  caseObjectStatusLabel?: string;
  plannedReleaseDateDueSoonCount?: number;
  plannedReleaseDateOverdueCount?: number;
  plannedEffectiveDateDueSoonCount?: number;
  plannedEffectiveDateOverdueCount?: number;
  dueSoonActionsCount?: number;
  overdueActionsCount?: number;
}

export interface HelpTextFormConfiguration {
  service: HelpTextFormGroup[];
}

export interface HelpTextFormGroup {
  group: HelpTextGroups[];
  label: string;
  name: string;
  currentIndex: number;
}

export interface HelpTextDialogFormGroup {
  currentIndex: number;
  event: HelpTextGroups;
}

export interface HelpTextGroups {
  label?: string;
  name?: string;
  parameter: FormControlConfiguration[];
}

export interface EditDialogFormConfiguration {
  dialogData: any;
  disableDirection?: string;
  title: string;
  fieldLabel: string;
  icon: string;
  showAddFooter?: boolean;
  type?: string;
  helpTextPlaceholder?: string;
}

export interface EditDialogOutput {
  label: string;
  help?: string;
  add: boolean;
}

export interface AgendaCBRuleSet {
  name: string;
  ID?: string;
  help: string;
  rules: AgendaCBRule[];
  rule: AgendaCBRule[];
  label?: string;
}

export interface ProductsAffectedSet {
  name?: string;
  label: string;
  products: Product[];
}

export interface Tag {
  label: string;
  name: string;
  active: boolean;
}

export interface CBRuleSet {
  rule_set_name?: string;
  rules: string[];
  name?: string;
}

export interface AgendaCBRule {
  label: string;
  ID?: string;
  help: string;
  name: string;
  type?: string;
  selected?: boolean;
}

export interface Product {
  label?: string;
  name: string;
  type?: string;
  selected?: boolean;
  project_id?: string;
  description?: string;
}

export interface UpdateActionData {
  action: Action;
  caseAction: string;
}

export interface UpdateReviewerData {
  reviewer: Review;
  caseAction: string;
}

export interface UpdateReviewEntryData {
  reviewEntry: ReviewEntrySummary;
  caseAction: string;
}

export interface AddUpdateRemoveBulkPermissionsData {
  caseAction: string;
  user: User;
  role: string;
  replacedByUser?: User;
  replacedByRole?: string;
}

export interface CaseObjectLinkedItemsCount {
  openActionsCount: number;
  totalActionsCount: number;
  notesCount: number;
  attachmentsCount: number;
  otherAttachmentsCount: number;
  specialInviteesCount?: number;
}

export  type FormActionType = 'add' | 'edit';

export interface LinkObject {
  LinkElement: LinkElement;
}

export interface LinkElement {
  ID: string;
  type: string;
}

export interface CaseActionStatusMapping {
  status: string;
  caseAction: string;
}

export interface Problems {
  number?: string;
  short_description?: string;
  description?: string;
  owner?: User;
  initiator?: User;
  solver?: User;
  machine_type?: string;
  priority?: string;
  issue_type?: string;
  root_cause?: string;
  productID?: string;
  projectID?: string;
  functionalClusterID?: string;
  selected?: boolean;
}

export interface SpecialInviteesData {
  specialInvitees: User[];
  totalInviteesCount: number;
}

export class IssuesList {
  description?: string;
  initiator?: string;
  number?: string;
  owner?: string;
  priority?: string;
  projectID?: string;
  shortDescription?: string;
  solver?: string;
  type?: string;
  ID?: string;
  deliverable?: string;
  isLinkableToChangeRequest?: string;
  status?: string;

  constructor(issuesList ?: IssuesList) {
    issuesList = issuesList || {} as IssuesList;
    return issuesList;
  }
}

export type FieldValueType = 'multiple' | 'single';


export class AggregatedAgendaItem {
  // this object is order sensitive, please consult with team before you change order
  agendaItem: AgendaItem;
  decision?: Decision;
  linkedObjectSummary?: CaseObjectContext;
  startDateTime?: Date | string;
  isAOB?: boolean;

  constructor(aggregatedAgendaItem ?: AggregatedAgendaItem) {
    aggregatedAgendaItem = aggregatedAgendaItem || {} as AggregatedAgendaItem;
    aggregatedAgendaItem.agendaItem = new AgendaItem(aggregatedAgendaItem.agendaItem);
    aggregatedAgendaItem.decision = new AgendaItem(aggregatedAgendaItem.decision);
    aggregatedAgendaItem.linkedObjectSummary = aggregatedAgendaItem.linkedObjectSummary ? aggregatedAgendaItem.linkedObjectSummary : {};
    return aggregatedAgendaItem;
  }
}

export interface GlobalSearchResponse {
  totalItems: number;
  totalChangeRequests: number;
  totalChangeNotices: number;
  totalReleasePackages: number;
  searchResult: GlobalSearchResult[];
}

export interface GlobalSearchResult {
  type: string;
  ID: string;
  title: string;
  status: string;
  priority: string;
  hasUncommunicatedOfflineDecision?: boolean;
}

export interface DecisionElement {
  DecisionElement: Decision;
}

export interface SectionSummary {
  name: string;
  count: number;
  isUserDefined: boolean;
}

export interface AttendeeSummary {
  ID: string;
  attendees: { UserElement: User[] };
}

export interface AgendaItemAttendeesSummary {
  allInvitedAttendeesCount: number;
  selectedAttendeesCount: number;
  selected: AttendeesSummary;
  allInvited: AttendeesSummary;
  isGetMeetingsSuccessful: boolean;
}

export interface AttendeesSummary {
  Attendees: AttendeeSummary[];
}

export interface AttendeeSummary {
  UserElement: User;
  isSpecialInvitee: boolean;
  isSelected: boolean;
}
export interface  LinkedReleasePackageCountsElement {
  isObsoleteAllowed?: boolean;
}
export interface Delta1ReportButtonStatus {
  Delta1ReportDetails: Delta1ReportStatus;
}
export interface Delta1ReportStatus {
  isButtonEnabled?: boolean;
  tooltipMessage?: string;
  reportDetails?: Delta1ReportDetails;
}
export interface Delta1ReportDetails {
  deltaReportID: string;
  ref: ReportID[];
}
export interface ReportID {
  ID: string;
  type: string;
}

export interface NotificationSummary {
  notificationDetails: NotificationDetail[];
  totalItems: number;
}

export interface NotificationDetail {
  ID: number;
  caseID: string;
  caseType: string;
  createdOn: string;
  isRead: boolean;
  title: string;
  type: string;
  actor: User;
  target: TargetCaseObject;
}

export interface TargetCaseObject {
  caseID: string;
  caseType: string;
  caseRevision: string;
  location: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
}

export interface MyTeamAction {
  name: string;
  label: string;
}

export interface ReadOnlyCIA {
  ID: string;
  title: string;
  ciaApplicabilityCheck: string;
  partsOrToolingInScope: string;
  partsManufacturedBefore: string;
  ciaResult: string;
  piiaResult: string;
  systemLevelPerformanceImpact: string;
  impactOnWaferProcessingEnv: string;
  negativeImpactOnAvailability: string;
  changeToCustImpCrtclPart: string;
  changeToSoftware: string;
  changeToProcImpCust: string;
  functionalSoftwareDependencies: string;
  fcoUpgrade: string;
  impactOnUserInterfaces: string;
}

export interface ReadOnlyCIASummary {
  parts_tooling_in_scope: string;
  parts_manufactured_before: string;
  impact_on_preinstall: string;
  system_level_performance_impact: string;
  negative_impact_on_availability: string;
  change_to_software: string;
  functional_software_dependencies: string;
  impact_on_user_interfaces: string;
  impact_on_wafer_process_environment: string;
  change_to_customer_impact_critical_part: string;
  change_to_process_impacts_customer: string;
  fco_upgrade_option_csr_implementation_change: string;
  customer_impact_result: string;
  change_request: ChangeRequest;
}

export interface ScopeSummary {
  ChangeRequestElement: ChangeRequest;
  showExistingPartQuestion: boolean;
  showOtherQuestions: boolean;
}

export class CaseObjectContext {
  ID?: string;
  revision?: string;
  type?: string;
  title?: string;
  status?: string;
  priority?: number;
  totalOpenActions?: number;
  implementationPriority?: number;
  group?: string[];
  CBGroups?: string[];
  CCBGroups?: string[];
  CBRuleSet?: any;
}

export class PreferredRole {
  user_id?: string;
  preferred_roles?: string[];
}

export class ImpactedItemType {
  id?: string;
  title?: string;
  description?: string;
  revision?: string;
  creator?: User[];
  user?: User[];
  creators?: MiraiUser | MiraiUser[];
  users?: MiraiUser[];
  workInstructionStatus?: string;
  rootMapStatus?: string;
  uid?: string;
  status?: string;
  sourceSystemStatus?: string;
  name?: string;
}


export interface ChangeRequestAuditAggregate {
  change_request_change_log: AuditData;
  scope_change_log: AuditData;
  solution_definition_change_log: AuditData;
  impact_analysis: ImpactAnalysisAudit;
  my_team_details: MyTeamAuditDetails;
}

export interface ReleasePackageAuditAggregate {
  change_request_change_log: AuditData;
  scope_change_log: AuditData;
  solution_definition_change_log: AuditData;
  impact_analysis: ImpactAnalysisAudit;
  my_team_details: MyTeamAuditDetails;
}

export interface ImpactAnalysisAudit {
  general: AuditData;
  details: DetailsAudit;
}
export interface DetailsAudit {
  customer_impact: AuditData;
  preinstall_impact: AuditData;
  complete_business_case: AuditData;
}

export interface MyTeamAuditDetails {
  my_team: AuditData;
  members: AuditMember[];
}
export interface AuditMember {
  member: AuditData;
}

export class ChangeNoticeImpactedItemSummary {
  totalItems?: number;
  SolutionItemSummaryElement?: ImpactedItem[];
  ChangeNoticeElement?: ChangeNotice;
}

export class LinkedSourceData {
  tc_data: TCData;
  mdg_data: MDGData;
  se_data: SEData;
  retryCaseAction: boolean;
  saveInProgress: boolean;
  completed: boolean;
  constructor(linkedSourceData ?: LinkedSourceData) {
    linkedSourceData = linkedSourceData || {} as LinkedSourceData;
    linkedSourceData.tc_data = new TCData(linkedSourceData.tc_data);
    linkedSourceData.mdg_data = new TCData(linkedSourceData.mdg_data);
    linkedSourceData.se_data = new TCData(linkedSourceData.se_data);
    linkedSourceData.retryCaseAction = linkedSourceData.retryCaseAction || false;
    linkedSourceData.saveInProgress = linkedSourceData.saveInProgress || false;
    linkedSourceData.completed = linkedSourceData.completed || false;
    return linkedSourceData;
  }
}

export class TCData {
  context: Context;
  status: string;
  error: string;

  constructor(tcData ?: TCData) {
    tcData = tcData || {} as TCData;
    tcData.context = new Context(tcData.context);
    tcData.status = tcData.status || null;
    tcData.error = tcData.error || null;
    return tcData;
  }
}

export class MDGData {
  context: Context;
  status: string;
  error: string;

  constructor(mcData ?: MDGData) {
    mcData = mcData || {} as MDGData;
    mcData.context = new Context(mcData.context);
    mcData.status = mcData.status || null;
    mcData.error = mcData.error || null;
    return mcData;
  }
}

export class SEData {
  context: Context;
  status: string;
  error: string;

  constructor(seData ?: SEData) {
    seData = seData || {} as SEData;
    seData.context = new Context(seData.context);
    seData.status = seData.status || null;
    seData.error = seData.error || null;
    return seData;
  }
}

export class LinkedSourceStatus {
  // this object is order sensitive, please consult with team before you change order
  showECN: boolean;
  showSDL?: boolean;
  showMDG?: boolean;
  showER?: boolean;

  constructor(linkedSourceStatus ?: LinkedSourceStatus) {
    linkedSourceStatus = linkedSourceStatus || {} as LinkedSourceStatus;
    linkedSourceStatus.showECN = linkedSourceStatus.showECN || false;
    linkedSourceStatus.showSDL = linkedSourceStatus.showSDL || false;
    linkedSourceStatus.showMDG = linkedSourceStatus.showMDG || false;
    linkedSourceStatus.showER = linkedSourceStatus.showER || false;
    return linkedSourceStatus;
  }
}

export class ImpactedItemResponse {
  change_object?: ChangeObject;
  problem_items?: ImpactedItem[];
  scope_items?: ImpactedItem[];
  my_team?: MyTeam;
}

export class ChangeObject {
  id?: number;
  status?: number;
  contexts?: Context;
  change_object_number?: number;
  change_object_type?: string;
  change_object_status?: number;
  change_object_title?: string;
  is_secure?: boolean;
  change_control_boards?: string[];
  change_boards?: string[];
  creator?: MiraiUser;
  sub_types?: any;
  created_on?: string;
}

export class ReleasePackageResponse {
  my_team_details?: MyTeam;
  release_package?: ReleasePackage;
}

export class SAPERResponse {
  er_number: string;
  status: number;
  status_label: string;
}

