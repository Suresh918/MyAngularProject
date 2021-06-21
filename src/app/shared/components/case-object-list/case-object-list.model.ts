import {Project} from '../../models/project.model';
import {User, MiraiUser} from '../../models/mc.model';
import {Product} from '../../models/product.model';
import {PMODetails} from '../../models/pmo-details.model';

export interface CaseObjectOverview {
  id?: string;
  ID: string;
  title: string;
  status?: string | number;
  statusLabel?: string;
  status_label?: string;
  priority?: number;
  priorityLabel?: string;
  analysis_priority?: string;
  analysis_priority_label?: string;
  prerequisiterpid?: number;
  prerequisite_release_package_id?: number;
  totalOpenActions: number;
  totalDueSoonActions: number;
  totalOverdueActions: number;
  projectID?: string;
  pmo_details?: PMODetails;
  change_specialist2?: MiraiUser;
  SAPChangeControl?: boolean;
  sourceSystemID?: string;
  sourceSystemAliasID?: string;
  plannedReleaseDate?: string;
  plannedEffectiveDate?: string;
  planned_release_date?: string;
  planned_effective_date?: string;
  siblingRPCount?: string;
  WIPFAT?: string;
  completedReviewEntriesCount?: number;
  totalReviewEntries?: number;
  totalOpenActionsLinkedCN?: number;
  totalActionsLinkedCN?: number;
  totalMyteamUsers?: number;
  changeNoticeID?: string;
  reviewID?: string;
  type?: string;
  project?: Project;
  requirementsForImpPlan?: string;
  implementationPriority?: number;
  changeSpecialist2?: User;
  PCCSTRAIMID?: string[];
  product?: Product;
  excessAndObsolSavings?: number;
  lastStatusChangedDate?: Date;
  group?: string[];
  revision?: string;
  sequenceNumber?: number;
  sequencenumber?: number;
  sequence_number?: number;
  ecn_number?: string;
  release_package_number?: string;
  sibling_rp_count?: string;
  sibling_count?: number;
  open_actions?: number;
  total_actions?: number;
  completed_actions?: number;
  totalActions?: number;
  totalCompletedActions?: number;
  change_owner_type?: string;
  changeOwnerType?: string;
  team_center_id?: string;
  product_id?: string;
  excess_and_obsolescence_savings?: number;
}


export interface CaseObjectOverviewElement {
  totalItems: number;
  caseObjectOverViewList: CaseObjectOverview[];
}

export interface CaseObjectOverviewElement {
  totalItems: number;
  caseObjectOverViewList: CaseObjectOverview[];
}

export interface AbstractCaseObjectStateAnalytics {
  caseObjectState: string;
  caseObjectsCount: number;
  openActionsCount: number;
  dueSoonActionsCount: number;
  overdueActionsCount: number;
  obsoletedCaseObjectsCount?: number;
  toolTip?: string;
  stateLabel?: string;
}

export interface ReleasePackageStateAnalytics {
  caseObjectStatus: string;
  caseObjectsCount: number;
  openActionsCount: number;
  plannedEffectiveDateDueSoonCount: number;
  plannedEffectiveDateOverdueCount: number;
  plannedReleaseDateDueSoonCount: number;
  plannedReleaseDateOverdueCount: number;
  obsoletedCaseObjectsCount?: number;
}

export interface ActionsStateAnalytics {
  openActionsCount: number;
  acceptedActionsCount: number;
  dueSoonActionsCount: number;
  overdueActionsCount: number;
  obsoletedCaseObjectsCount?: number;
}

export interface NotificationAnalytics {
  notificationType: string;
  notificationCount: number;
  notificationTypeLabel: string;
  obsoletedCaseObjectsCount?: number;
  checked?: boolean;
}

export type CaseObjectStateAnalytics = AbstractCaseObjectStateAnalytics | ReleasePackageStateAnalytics | ActionsStateAnalytics | NotificationAnalytics;
