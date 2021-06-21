import {Permission, User} from './mc.model';
import {WorkBreakdownStructure} from './work-breakdown-structure.model';
import {Project} from './project.model';
import {FormControlEnumeration} from './mc-configuration.model';
import {Problem} from './air.model';
import {ProductBreakdownStructure} from './product-breakdown-structure.model';
import {MyTeamAction} from './mc-presentation.model';

export class McFiltersModel {
  filtersModel?: { [key: string]: FilterOptions };

  constructor(mcFilterModel: McFiltersModel) {
    mcFilterModel = mcFilterModel || {} as McFiltersModel;
    mcFilterModel.filtersModel = mcFilterModel.filtersModel || {
      'currentDefaultFilter': new FilterOptions(mcFilterModel.filtersModel ? mcFilterModel.filtersModel.currentDefaultFilter : {})
    };
    return mcFilterModel;
  }
}

export interface MCDatePickerRangeValue {
  begin: Date | null;
  end: Date | null;
}

export class FilterOptions {
  state?: FormControlEnumeration[];
  status?: FormControlEnumeration[];
  classification?: FormControlEnumeration[];
  productID?: Project[];
  projectID?: WorkBreakdownStructure[];
  implementationPriority?: FormControlEnumeration[];
  analysisPriority?: FormControlEnumeration[];
  customerImpact?: FormControlEnumeration[];
  PCCSTRAIMIDs?: Problem[];
  PBSIDs?: ProductBreakdownStructure[];
  type?: FormControlEnumeration[];
  purpose?: FormControlEnumeration[];
  people?: People[];
  attendee?: User[];
  allUsers?: User[];
  plannedReleaseDate?: MCDatePickerRangeValue;
  plannedEffectiveDate?: MCDatePickerRangeValue;
  dueDate?: MCDatePickerRangeValue;
  meetingDate?: MCDatePickerRangeValue;
  myTeamAction?: string;
  keywords?: string[];
  linkedItems?: string;
  reviewItems?: string[];
  role?: FormControlEnumeration[];
  group?: Permission[];
  department?: string[];
  activeDate?: MCDatePickerRangeValue;
  priority?: FormControlEnumeration[];
  effectiveEndDate?: MCDatePickerRangeValue;
  createdOn?: MCDatePickerRangeValue;
  isActive?: FormControlEnumeration[];
  id?: string[];
  actionType?: FormControlEnumeration[];
  linkedChangeObject?: string;
  agendaCategory?: string;
  changeObject?: string;
  fromCaseObject?: string;
  actionDates?: MCDatePickerRangeValue[];
  actionStatus?: FormControlEnumeration[];
  actionDisplayStatus?: FormControlEnumeration[];
  decision?: string[];
  tags?: string[];
  solutionItem?: string;
  review_tasks_status?: FormControlEnumeration[];
  changeOwnerType?: string;

  constructor(filterOptions: FilterOptions) {
    if (filterOptions.hasOwnProperty('linkedItemType')) {
      delete filterOptions['linkedItemType'];
    }
    filterOptions = filterOptions || {} as FilterOptions;
    filterOptions.state = filterOptions.state ? filterOptions.state : [];
    filterOptions.status = filterOptions.status ? filterOptions.status : [];
    filterOptions.classification = filterOptions.classification ? filterOptions.classification : [];
    filterOptions.productID = filterOptions.productID ? filterOptions.productID : [];
    filterOptions.projectID = filterOptions.projectID ? filterOptions.projectID : [];
    filterOptions.type = filterOptions.type ? filterOptions.type : [];
    filterOptions.purpose = filterOptions.purpose ? filterOptions.purpose : [];
    filterOptions.implementationPriority = filterOptions.implementationPriority ? filterOptions.implementationPriority : [];
    filterOptions.analysisPriority = filterOptions.analysisPriority ? filterOptions.analysisPriority : [];
    filterOptions.customerImpact = filterOptions.customerImpact ? filterOptions.customerImpact : [];
    filterOptions.PCCSTRAIMIDs = filterOptions.PCCSTRAIMIDs ? filterOptions.PCCSTRAIMIDs : [];
    filterOptions.PBSIDs = filterOptions.PBSIDs ? filterOptions.PBSIDs : [];
    filterOptions.people = filterOptions.people ? filterOptions.people : [];
    filterOptions.attendee = filterOptions.attendee ? filterOptions.attendee : [];
    filterOptions.allUsers = filterOptions.allUsers ? filterOptions.allUsers : [];
    filterOptions.plannedReleaseDate = filterOptions.plannedReleaseDate ? filterOptions.plannedReleaseDate : null;
    filterOptions.plannedEffectiveDate = filterOptions.plannedEffectiveDate ? filterOptions.plannedEffectiveDate : null;
    filterOptions.meetingDate = filterOptions.meetingDate ? filterOptions.meetingDate : null;
    filterOptions.myTeamAction = filterOptions.myTeamAction ? filterOptions.myTeamAction : null;
    filterOptions.dueDate = filterOptions.dueDate ? filterOptions.dueDate : null;
    filterOptions.keywords = filterOptions.keywords ? filterOptions.keywords : [];
    filterOptions.linkedItems = filterOptions.linkedItems ? filterOptions.linkedItems : '';
    filterOptions.solutionItem = filterOptions.solutionItem ? filterOptions.solutionItem : '';
    filterOptions.reviewItems = filterOptions.reviewItems ? filterOptions.reviewItems : [];
    filterOptions.role = filterOptions.role ? filterOptions.role : [];
    filterOptions.group = filterOptions.group ? filterOptions.group : [];
    filterOptions.department = filterOptions.department ? filterOptions.department : [];
    filterOptions.activeDate = filterOptions.activeDate ? filterOptions.activeDate : null;
    filterOptions.priority = filterOptions.priority ? filterOptions.priority : [];
    filterOptions.effectiveEndDate = filterOptions.effectiveEndDate ? filterOptions.effectiveEndDate : null;
    filterOptions.createdOn = filterOptions.createdOn ? filterOptions.createdOn : null;
    filterOptions.isActive = filterOptions.isActive ? filterOptions.isActive : [];
    filterOptions.id = filterOptions.id ? filterOptions.id : [];
    filterOptions.actionType = filterOptions.actionType ? filterOptions.actionType : [];
    // linkedChangeObject changed from array to string, can be removed later
    filterOptions.linkedChangeObject = filterOptions.linkedChangeObject ? filterOptions.linkedChangeObject : '';
    filterOptions.agendaCategory = filterOptions.agendaCategory ? filterOptions.agendaCategory : '';
    filterOptions.fromCaseObject = filterOptions.fromCaseObject ? filterOptions.fromCaseObject : '';
    filterOptions.changeObject = filterOptions.changeObject ? filterOptions.changeObject : '';
    filterOptions.actionDates = filterOptions.actionDates ? filterOptions.actionDates : [];
    filterOptions.actionStatus = filterOptions.actionStatus ? filterOptions.actionStatus : [];
    // added for contained actions filter issue, Need to be removed later
    filterOptions.actionDisplayStatus = filterOptions.actionDisplayStatus ? filterOptions.actionDisplayStatus : [];
    filterOptions.decision = filterOptions.decision ? filterOptions.decision : [];
    filterOptions.review_tasks_status = filterOptions.review_tasks_status ? filterOptions.review_tasks_status : [];
    filterOptions.changeOwnerType = filterOptions.changeOwnerType ? filterOptions.changeOwnerType : '';
    return filterOptions;
  }
}

export interface People {
  user: User;
  users?: User[];
  role: FormControlEnumeration;
}

export class CaseObjectFilterConfiguration {
  state?: boolean;
  status?: boolean;
  changeObject?: string;
  productID?: boolean;
  projectID?: boolean;
  implementationPriority?: boolean;
  analysisPriority?: boolean;
  customerImpact?: boolean;
  PCCSTRAIMIDs?: boolean;
  purpose?: boolean;
  actionType?: boolean;
  type?: boolean;
  PBSIDs?: boolean;
  people?: boolean;
  changeSpecialist1?: boolean | string;
  changeSpecialist2?: boolean | string;
  changeSpecialist3?: boolean | string;
  createdBy?: boolean;
  assignee?: boolean;
  ecnExecutor?: boolean;
  productDevelopmentManager?: boolean;
  productManager?: boolean;
  productClusterManager?: boolean;
  attendee?: boolean;
  allUsers?: boolean;
  plannedReleaseDate?: boolean;
  plannedEffectiveDate?: boolean;
  dueDate?: boolean;
  meetingDate?: boolean;
  myTeamAction?: string;
  keywords?: boolean;
  linkedItems?: boolean;
  classification?: boolean;
  reviewedBy?: boolean;
  reviewItems?: boolean;
  role?: boolean;
  group?: boolean;
  department?: boolean;
  activeDate?: boolean;
  priority?: boolean;
  effectiveEndDate?: boolean;
  createdOn?: boolean;
  isActive?: boolean;
  id?: boolean;
  linkedChangeObject?: boolean;
  agendaCategory?: boolean;
  fromCaseObject?: boolean;
  actionDates?: boolean;
  actionStatus?: boolean;
  string?: boolean;
  tags?: boolean;
  solutionItem?: boolean;
  review_tasks_status?: boolean;
  changeOwnerType?: boolean;

  constructor(caseObjectConfiguration: CaseObjectFilterConfiguration) {
    caseObjectConfiguration = caseObjectConfiguration || {};
    caseObjectConfiguration.state = caseObjectConfiguration.state || false;
    caseObjectConfiguration.status = caseObjectConfiguration.status || false;
    caseObjectConfiguration.productID = caseObjectConfiguration.productID || false;
    caseObjectConfiguration.projectID = caseObjectConfiguration.projectID || false;
    caseObjectConfiguration.purpose = caseObjectConfiguration.purpose || false;
    caseObjectConfiguration.actionType = caseObjectConfiguration.actionType || false;
    caseObjectConfiguration.type = caseObjectConfiguration.type || false;
    caseObjectConfiguration.implementationPriority = caseObjectConfiguration.implementationPriority || false;
    caseObjectConfiguration.analysisPriority = caseObjectConfiguration.analysisPriority || false;
    caseObjectConfiguration.customerImpact = caseObjectConfiguration.customerImpact || false;
    caseObjectConfiguration.PCCSTRAIMIDs = caseObjectConfiguration.PCCSTRAIMIDs || false;
    caseObjectConfiguration.PBSIDs = caseObjectConfiguration.PBSIDs || false;
    caseObjectConfiguration.people = caseObjectConfiguration.people || false;
    caseObjectConfiguration.changeSpecialist1 = caseObjectConfiguration.changeSpecialist1 || false;
    caseObjectConfiguration.changeSpecialist2 = caseObjectConfiguration.changeSpecialist2 || false;
    caseObjectConfiguration.changeSpecialist3 = caseObjectConfiguration.changeSpecialist3 || false;
    caseObjectConfiguration.createdBy = caseObjectConfiguration.createdBy || false;
    caseObjectConfiguration.assignee = caseObjectConfiguration.assignee || false;
    caseObjectConfiguration.ecnExecutor = caseObjectConfiguration.ecnExecutor || false;
    caseObjectConfiguration.productClusterManager = caseObjectConfiguration.productClusterManager || false;
    caseObjectConfiguration.productDevelopmentManager = caseObjectConfiguration.productDevelopmentManager || false;
    caseObjectConfiguration.productManager = caseObjectConfiguration.productManager || false;
    caseObjectConfiguration.attendee = caseObjectConfiguration.attendee || false;
    caseObjectConfiguration.allUsers = caseObjectConfiguration.allUsers || false;
    caseObjectConfiguration.plannedReleaseDate = caseObjectConfiguration.plannedReleaseDate || false;
    caseObjectConfiguration.plannedEffectiveDate = caseObjectConfiguration.plannedEffectiveDate || false;
    caseObjectConfiguration.dueDate = caseObjectConfiguration.dueDate || false;
    caseObjectConfiguration.meetingDate = caseObjectConfiguration.meetingDate || false;
    caseObjectConfiguration.keywords = caseObjectConfiguration.keywords || true;
    caseObjectConfiguration.linkedItems = caseObjectConfiguration.linkedItems || false;
    caseObjectConfiguration.classification = caseObjectConfiguration.classification || false;
    caseObjectConfiguration.reviewedBy = caseObjectConfiguration.reviewedBy || false;
    caseObjectConfiguration.reviewItems = caseObjectConfiguration.reviewItems || false;
    caseObjectConfiguration.role = caseObjectConfiguration.role || false;
    caseObjectConfiguration.group = caseObjectConfiguration.group || false;
    caseObjectConfiguration.department = caseObjectConfiguration.department || false;
    caseObjectConfiguration.activeDate = caseObjectConfiguration.activeDate || false;
    caseObjectConfiguration.priority = caseObjectConfiguration.priority || false;
    caseObjectConfiguration.effectiveEndDate = caseObjectConfiguration.effectiveEndDate || false;
    caseObjectConfiguration.createdOn = caseObjectConfiguration.createdOn || false;
    caseObjectConfiguration.isActive = caseObjectConfiguration.isActive || false;
    caseObjectConfiguration.id = caseObjectConfiguration.id || false;
    caseObjectConfiguration.linkedChangeObject = caseObjectConfiguration.linkedChangeObject || false;
    caseObjectConfiguration.agendaCategory = caseObjectConfiguration.agendaCategory || false;
    caseObjectConfiguration.fromCaseObject = caseObjectConfiguration.fromCaseObject || false;
    caseObjectConfiguration.actionDates = caseObjectConfiguration.actionDates || false;
    caseObjectConfiguration.actionStatus = caseObjectConfiguration.actionStatus || false;
    caseObjectConfiguration.tags = caseObjectConfiguration.tags || false;
    caseObjectConfiguration.solutionItem = caseObjectConfiguration.solutionItem || false;
    caseObjectConfiguration.review_tasks_status = caseObjectConfiguration.review_tasks_status || false;
    caseObjectConfiguration.changeOwnerType = caseObjectConfiguration.changeOwnerType || false;
  }
}
