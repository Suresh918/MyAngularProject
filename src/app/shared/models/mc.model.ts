import {AuditTypes} from './mc-enums';
import {PMODetails} from './pmo-details.model';

export class ChangeRequest {
  id?: number;
  revision?: string;
  contexts?: Context[];
  title?: string;
  status?: number;
  status_label?: string;
  is_secure?: boolean;
  change_specialist1?: MiraiUser;
  change_specialist2?: MiraiUser;
  creator?: MiraiUser;
  created_on?: Date;
  change_control_boards?: string[];
  change_boards?: string[];
  issue_types?: string[];
  change_request_type?: string;
  type?: string;
  analysis_priority?: number;
  project_id?: string;
  product_id?: string;
  project_lead?: string;
  functional_cluster_id?: string;
  pmo_details?: PMODetails;
  reasons_for_change?: string[];
  problem_description?: string;
  proposed_solution?: string;
  root_cause?: string;
  benefits_of_change?: string;
  implementation_priority?: number;
  requirements_for_implementation_plan?: string;
  excess_and_obsolescence_savings?: number;
  dependent_change_request_ids?: string[];
  change_board_rule_set?: RuleSet;
  scope?: Scope;
  solution_definition?: SolutionDefine;
  impact_analysis?: ImpactAnalysis;
  complete_business_case?: CompleteBusinessCase;
  my_team?: MyTeam;
  change_owner?: MiraiUser;
  change_owner_type?: string;

  constructor(changeRequest ?: ChangeRequest) {
    changeRequest = changeRequest || {} as ChangeRequest;
    changeRequest.id = changeRequest.id || changeRequest['ID'];
    changeRequest.contexts = changeRequest.contexts ? changeRequest.contexts.map(res => new Context(res)) : [];
    changeRequest.change_specialist1 = changeRequest.change_specialist1 ? new MiraiUser(changeRequest.change_specialist1) : null;
    changeRequest.change_specialist2 = changeRequest.change_specialist2 ? new MiraiUser(changeRequest.change_specialist2) : null;
    changeRequest.creator = new MiraiUser(changeRequest.creator);
    changeRequest.change_board_rule_set = new RuleSet(changeRequest.change_board_rule_set);
    changeRequest.scope = new Scope(changeRequest.scope);
    changeRequest.solution_definition = new SolutionDefine(changeRequest.solution_definition);
    changeRequest.impact_analysis = new ImpactAnalysis(changeRequest.impact_analysis);
    changeRequest.complete_business_case = new CompleteBusinessCase(changeRequest.complete_business_case);
    changeRequest.my_team = new MyTeam(changeRequest.my_team);
    changeRequest.change_owner = changeRequest.change_owner ? new MiraiUser(changeRequest.change_owner) : null;
    return changeRequest;
  }
}

export class RuleSet {
  name?: string;
  rules?: string[];

  constructor(ruleSet ?: RuleSet) {
    ruleSet = ruleSet || {} as RuleSet;
    return ruleSet;
  }
}

export class Scope {
  id?: number;
  scope_details?: string;
  parts?: string;
  part_detail?: Parts;
  tooling?: string;
  tooling_detail?: Tooling;
  packaging?: string;
  packaging_detail?: Packaging;
  bop?: string;

  constructor(scope ?: Scope) {
    scope = scope || {} as Scope;
    scope.part_detail = new Parts(scope.part_detail);
    scope.tooling_detail = new Tooling(scope.tooling_detail);
    scope.packaging_detail = new Packaging(scope.packaging_detail);
    return scope;
  }
}

export class Parts {
  machine_bom_part?: string;
  service_part?: string;
  preinstall_part?: string;
  test_rig_part?: string;
  dev_bag_part?: string;
  fco_upgrade_option_csr?: string;

  constructor(parts ?: Parts) {
    parts = parts || {} as Parts;
    return parts;
  }
}

export class Tooling {
  supplier_tooling?: string;
  manufacturing_de_tooling?: string;
  service_tooling?: string;

  constructor(tooling ?: Tooling) {
    tooling = tooling || {} as Tooling;
    return tooling;
  }
}

export class Packaging {
  supplier_packaging?: string;
  storage_packaging?: string;
  shipping_packaging?: string;
  reusable_packaging?: string;

  constructor(packaging ?: Packaging) {
    packaging = packaging || {} as Packaging;
    return packaging;
  }
}

export class SolutionDefine {
  id?: number;
  functional_software_dependencies?: string;
  functional_software_dependencies_details?: string;
  functional_hardware_dependencies?: string;
  functional_hardware_dependencies_details?: string;
  hardware_software_dependencies_aligned?: string;
  hardware_software_dependencies_aligned_details?: string;
  test_and_release_strategy?: string;
  test_and_release_strategy_details?: string;
  products_affected?: string[];
  products_module_affected?: string;
  aligned_with_fo?: string;
  aligned_with_fo_details?: string;
  technical_recommendation?: string;

  constructor(solutionDefine ?: SolutionDefine) {
    solutionDefine = solutionDefine || {} as SolutionDefine;
    return solutionDefine;
  }
}

export class CustomerImpact {
  id?: number;
  customer_impact_result?: string;
  customer_approval?: string;
  customer_approval_details?: string;
  customer_communication?: string;
  customer_communication_details?: string;
  uptime_improvement?: string;
  fco_implementation?: string;
  uptime_payback?: string;
  uptime_improvement_availability?: string;
  fco_implementation_availability?: string;
  uptime_payback_availability?: string;
  impact_on_user_interfaces?: string;
  impact_on_user_interfaces_details?: string;
  impact_on_wafer_process_environment?: string;
  impact_on_wafer_process_environment_details?: string;
  change_to_customer_impact_critical_part?: string;
  change_to_customer_impact_critical_part_details?: string;
  change_to_process_impacting_customer?: string;
  change_to_process_impacting_customer_details?: string;
  fco_upgrade_option_csr_implementation_change?: string;
  fco_upgrade_option_csr_implementation_change_details?: string;

  constructor(customerImpact ?: CustomerImpact) {
    customerImpact = customerImpact || {} as CustomerImpact;
    return customerImpact;
  }
}

export class ImpactAnalysis {
  id?: number;
  customer_impact?: CustomerImpact;
  preinstall_impact?: PreInstallImpact;
  upgrade_packages?: string;
  upgrade_time?: string;
  recovery_time?: string;
  pre_post_conditions?: string;
  impact_on_sequence?: string;
  impact_on_sequence_details?: string;
  impact_on_availability?: string;
  impact_on_availability_details?: string;
  multi_plant_impact?: string;
  phase_out_spares_tools?: string;
  phase_out_spares_tools_details?: string;
  tech_risk_assessment_sra?: string;
  tech_risk_assessment_sra_details?: string;
  tech_risk_assessment_fmea?: string;
  tech_risk_assessment_fmea_details?: string;
  total_instances_affected?: string;
  impact_on_system_level_performance?: string;
  impact_on_system_level_performance_details?: string;
  impact_on_cycle_time?: string;
  impact_on_cycle_time_details?: string;
  impact_on_labor_hours?: string;
  impact_on_labor_hours_details?: string;
  impact_on_existing_parts?: string;
  liability_risks?: string;
  implementation_ranges?: string[];
  implementation_ranges_details?: string;
  cbp_strategies?: string[];
  cbp_strategies_details?: string;
  development_labor_hours?: string;
  investigation_labor_hours?: string;
  fco_types?: string[];
  calendar_dependency?: string;
  targeted_valid_configurations?: string;

  constructor(impactAnalysis ?: ImpactAnalysis) {
    impactAnalysis = impactAnalysis || {} as ImpactAnalysis;
    impactAnalysis.customer_impact = new CustomerImpact(impactAnalysis.customer_impact);
    impactAnalysis.preinstall_impact = new PreInstallImpact(impactAnalysis.preinstall_impact);
    return impactAnalysis;
  }
}

export class PreInstallImpact {
  id?: number;
  preinstall_impact_result?: string;
  change_introduces_new11_nc?: string;
  change_introduces_new11_nc_details?: string;
  impact_on_customer_factory_layout?: string;
  impact_on_customer_factory_layout_details?: string;
  impact_on_facility_flows?: string;
  impact_on_facility_flows_details?: string;
  impact_on_preinstall_inter_connect_cables?: string;
  impact_on_preinstall_inter_connect_cables_details?: string;
  change_replaces_mentioned_parts?: string;
  change_replaces_mentioned_parts_details?: string;

  constructor(preInstallImpact ?: PreInstallImpact) {
    preInstallImpact = preInstallImpact || {} as PreInstallImpact;
    return preInstallImpact;
  }
}

export class CompleteBusinessCase {
  id?: number;
  risk?: number;
  risk_in_labor_hours?: string;
  hardware_commitment?: number;
  system_starts_impacted?: number;
  systems_in_wip_and_field_impacted?: number;
  factory_investments?: number;
  fs_tooling_investments?: number;
  supply_chain_management_investments?: number;
  supplier_investments?: number;
  de_investments?: number;
  material_recurring_costs?: number;
  labor_recurring_costs?: number;
  cycle_time_recurring_costs?: number;
  inventory_replace_nonrecurring_costs?: number;
  inventory_scrap_nonrecurring_costs?: number;
  supply_chain_adjustments_nonrecurring_costs?: number;
  factory_change_order_nonrecurring_costs?: number;
  field_change_order_nonrecurring_costs?: number;
  update_upgrade_product_documentation_nonrecurring_costs?: number;
  farm_out_development_nonrecurring_costs?: number;
  prototype_materials_nonrecurring_costs?: number;
  revenues_benefits?: number;
  opex_reduction_field_labor_benefits?: number;
  opex_reduction_spare_parts_benefits?: number;
  customer_uptime_improvement_benefits?: number;
  other_opex_savings_benefits?: number;
  internal_rate_of_return?: number;
  bsnl_savings?: number;
  payback_period?: number;
  customer_opex_savings?: number;
  risk_on_excess_and_obsolescence?: number;
  risk_on_excess_and_obsolescence_reduction_proposal?: number;
  risk_on_excess_and_obsolescence_reduction_proposal_costs?: number;

  constructor(completeBusinessCase ?: CompleteBusinessCase) {
    completeBusinessCase = completeBusinessCase || {} as CompleteBusinessCase;
    return completeBusinessCase;
  }
}

export class Member {
  id?: number;
  status?: string;
  user?: MiraiUser;
  roles?: string[];

  constructor(member ?: Member) {
    member = member || {} as Member;
    member.user = new MiraiUser(member.user);
    return member;
  }
}

export class MemberElement {
  member?: Member;
  constructor(memberElement ?: MemberElement) {
    memberElement = memberElement || {} as MemberElement;
    memberElement.member = new Member(memberElement.member);
    return memberElement;
  }
}

export class MyTeam {
  id?: number;
  members?: MemberElement[];

  constructor(myTeam ?: MyTeam) {
    myTeam = myTeam || {} as MyTeam;
    myTeam.members = myTeam.members ? myTeam.members.map(res => new MemberElement(res)) : [];
    return myTeam;
  }
}

export class User {
  userID?: string;
  fullName?: string;
  email?: string;
  abbreviation?: string;
  departmentName?: string;

  constructor(user ?: User) {
    user = user || {} as User;
    this.userID = user.userID || user['user_id'] || '';
    this.fullName = user.fullName || user['full_name'] || '';
    this.email = user.email || '';
    this.abbreviation = user.abbreviation || '';
    this.departmentName = user.departmentName || user['department_name'] || '';
    return this;
  }
}

export class MiraiUser {
  user_id?: string;
  full_name?: string;
  email?: string;
  abbreviation?: string;
  department_name?: string;

  constructor(user ?: MiraiUser) {
    if (user) {
      user = user || {} as MiraiUser;
      this.user_id = user.user_id || user['userID'];
      this.full_name = user.full_name || user['fullName'];
      this.email = user.email || user['email'];
      this.abbreviation = user.abbreviation || user['abbreviation'];
      this.department_name = user.department_name || user['departmentName'];
      return this;
    }
  }
}

export class GeneralInformation {
  title?: string;
  state?: string;
  status?: string;
  createdBy?: User;
  createdOn?: Date;
  lastModifiedOn?: Date;
  submittedOn?: Date;
  permissions?: Permission[];

  constructor(generalInformation ?: GeneralInformation) {
    generalInformation = generalInformation || {} as GeneralInformation;
    generalInformation.createdBy = new User(generalInformation.createdBy);
    generalInformation.permissions = generalInformation.permissions ? generalInformation.permissions.map(res => new Permission(res)) : [];
    return generalInformation;
  }
}

export class ChangeRequestImpactAnalysis {
  upgradePackages?: string;
  productBaselinesAffected?: string[];
  productionModAffected?: string[];
  upgradeTime?: string;
  recoveryTime?: string;
  prePostConditions?: string;
  impactOnSequence?: string;
  impactOnFacilities?: string;
  impactOnAvailability?: string;
  multiplantImpact?: string;
  accordingPBSAIRStrategy?: string;
  phaseOutSparesTools?: string;
  CBC?: CBC;
  impactOnSequenceDet?: string;
  impactOnFacilitiesDet?: string;
  impactOnAvailabilityDet?: string;
  accordingPBSAIRStratDet?: string;
  phaseOutSparesToolsDet?: string;
  techRiskAssessSRA?: string;
  techRiskAssessFMEA?: string;
  techRiskAssessSRADet?: string;
  techRiskAssessFMEADet?: string;
  totalInstancesAffected?: string;
  customerImpactAnalysis?: CustomerImpactAnalysis;
  sysLevelPerformImpact?: string;
  sysLevelPerformImpactDet?: string;
  mandatoryUpgrade?: string;
  mandatoryUpgradeDetails?: string;
  impactOnCycleTime?: string;
  impactOnCycleTimeDetails?: string;
  developmentLaborHours?: string;
  preInstallImpactAnalysis?: PreInstallImpactAnalysis;
  impactOnFIR?: string;
  liabilityRisk?: string[];
  investigationLaborHours?: string;
  impactOnExistingParts?: string;
  impactOnUserInterfaces?: string;
  impactOnUserInterfDtls?: string;
  impactOnWaferProcessEnv?: string;
  impactOnWaferProcEnvDtls?: string;
  changeToCustImpCrtclPart?: string;
  chngCustImpCrtclPartDtls?: string;
  changeToProcImpactCust?: string;
  changeProcImpactCustDtls?: string;
  FCOUpgOptCSRImplChange?: string;
  FCOUpgOptCSRImplChngDtls?: string;
  leadingNonLeading?: string;
  targetedValidConfig?: string;

  constructor(changeRequestImpactAnalysis ?: ChangeRequestImpactAnalysis) {
    changeRequestImpactAnalysis = changeRequestImpactAnalysis || {} as ChangeRequestImpactAnalysis;
    changeRequestImpactAnalysis.CBC = new CBC(changeRequestImpactAnalysis.CBC);
    changeRequestImpactAnalysis.customerImpactAnalysis = new CustomerImpactAnalysis(changeRequestImpactAnalysis.customerImpactAnalysis);
    changeRequestImpactAnalysis.preInstallImpactAnalysis = new PreInstallImpactAnalysis(changeRequestImpactAnalysis.preInstallImpactAnalysis);
    return changeRequestImpactAnalysis;
  }
}

export class ChangeNotice {
  ID?: string;
  revision?: string;
  revisionStatus?: string;
  generalInformation?: GeneralInformation;
  statusTrackers?: StatusTracker[];
  productID?: string;
  projectID?: string;
  changeSpecialist2?: User;
  implementationPriority?: number;
  testAndReleaseStrategy?: string;
  phaseOutSparesTools?: string;
  phaseOutSparesToolsDet?: string;
  customerImpact?: string;
  notes?: Note[];
  documents?: Document[];
  secure?: boolean;
  changeImplPlanURL?: string;
  CBC?: CBC;
  dependencies?: Dependencies;
  implementationRangeCS?: string;
  implementationRangeGF?: string;
  impactAnalysis?: ChangeNoticeImpactAnalysis;
  orderingStrategyNewHW?: string[];
  strategyOldHW?: string[];
  implementationRanges?: string[];
  implementationRangesDet?: string;
  requirementsForImpPlan?: string;
  orderingStrategyNewHWDet?: string;
  strategyOldHWDetails?: string;
  testAndReleaseStratDet?: string;
  CBPStrategies?: string[];
  CBPStrategiesDetails?: string;
  FCOTypes?: string[];
  tags?: string[];
  leadingInfo?: string;
  targetedVC?: string[];
  projectLead?: User;
  contexts?: Context[];
  solutionItems?: ImpactedItem[];
  changeOwner?: User;
  changeOwnerType?: string;

  constructor(changeNotice ?: ChangeNotice) {
    changeNotice = changeNotice || {} as ChangeNotice;
    changeNotice.generalInformation = new GeneralInformation(changeNotice.generalInformation);
    changeNotice.statusTrackers = changeNotice.statusTrackers ? changeNotice.statusTrackers.map(res => new StatusTracker(res)) : [];
    changeNotice.changeSpecialist2 = new User(changeNotice.changeSpecialist2);
    changeNotice.notes = changeNotice.notes ? changeNotice.notes.map(res => new Note(res)) : [];
    changeNotice.documents = changeNotice.documents ? changeNotice.documents.map(res => new Document(res)) : [];
    changeNotice.CBC = new CBC(changeNotice.CBC);
    changeNotice.dependencies = new Dependencies(changeNotice.dependencies);
    changeNotice.impactAnalysis = new ChangeNoticeImpactAnalysis(changeNotice.impactAnalysis);
    changeNotice.contexts = changeNotice.contexts ? changeNotice.contexts.map(res => new Context(res)) : [];
    changeNotice.solutionItems = changeNotice.solutionItems ? changeNotice.solutionItems.map(res => new ImpactedItem(res)) : [];
    changeNotice.changeOwner =   new User(changeNotice.changeOwner);
    return changeNotice;
  }
}

export class Decision {
  ID?: string;
  type?: string;
  decision?: string;
  decidedBy?: User[];
  decidedOn?: Date;
  motivation?: string;
  communicatedOn?: Date;

  constructor(decision ?: Decision) {
    decision = decision || {} as Decision;
    decision.decidedBy = decision.decidedBy ? decision.decidedBy.map(res => new User(res)) : [];
    return decision;
  }
}

export class Action {
  ID?: string;
  generalInformation?: GeneralInformation;
  type?: string;
  assignee?: User;
  assigneeGroup?: string;
  deadline?: Date;
  closedOn?: Date;
  closedBy?: User;
  notes?: NoteElement[];
  motivation?: string;
  statusTrackers?: StatusTracker[];
  documents?: Document[];
  expiry?: string;
  title?: string;
  status?: string;
  totalNotes?: number;
  isAcceptAllowed?: boolean;
  isRejectAllowed?: boolean;
  isRequestDetailsAllowed?: boolean;
  isCompleteAllowed?: boolean;
  isDeleteAllowed?: boolean;
  isSaveAllowed?: boolean;

  constructor(action ?: Action) {
    action = action || {} as Action;
    action.generalInformation = new GeneralInformation(action.generalInformation);
    action.assignee = new User(action.assignee);
    action.closedBy = new User(action.closedBy);
    action.notes = action.notes ? action.notes.map(res => new Note(res)) : [];
    action.statusTrackers = action.statusTrackers ? action.statusTrackers.map(res => new StatusTracker(res)) : [];
    action.documents = action.documents ? action.documents.map(res => new Document(res)) : [];
    return action;
  }
}

export class CBC {
  riskInManHours?: string;
  risk?: number;
  HWCommitment?: number;
  investments?: Investments;
  recurringCosts?: RecurringCosts;
  nonRecurringCosts?: NonRecurringCosts;
  benefits?: Benefits;
  riskInLaborHours?: number;
  financialSummary?: FinancialSummary;
  systemStartsImpacted?: number;
  systemsWIPFieldImpacted?: number;
  riskOnEOValue?: number;
  riskOnEORedProposal?: number;
  riskOnEORedPropCosts?: number;

  constructor(cBC ?: CBC) {
    cBC = cBC || {} as CBC;
    cBC.investments = new Investments(cBC.investments);
    cBC.recurringCosts = new RecurringCosts(cBC.recurringCosts);
    cBC.nonRecurringCosts = new NonRecurringCosts(cBC.nonRecurringCosts);
    cBC.benefits = new Benefits(cBC.benefits);
    cBC.financialSummary = new FinancialSummary(cBC.financialSummary);
    return cBC;
  }
}

export class StatusTracker {
  status?: string;
  statusChangeCount?: number;
  actuals?: Period[];

  constructor(statusTracker ?: StatusTracker) {
    statusTracker = statusTracker || {} as StatusTracker;
    statusTracker.actuals = statusTracker.actuals ? statusTracker.actuals.map(res => new Period(res)) : [];
    return statusTracker;
  }
}

export class Document {
  name?: string;
  uploadedBy?: User;
  uploadedOn?: Date;
  tags?: string[];
  ID?: string;
  description?: string;
  contentType?: string;
  contentSize?: number;
  commentID?: string;

  constructor(document ?: Document) {
    document = document || {} as Document;
    document.uploadedBy = new User(document.uploadedBy);
    return document;
  }
}

export class Note {
  note?: string;
  documents?: Document[];
  type?: string;
  createdBy?: User;
  createdOn?: Date;
  tags?: string[];
  ID?: string;
  status?: string;
  lastModifiedOn?: Date;

  constructor(note ?: Note) {
    note = note || {} as Note;
    note.documents = note.documents ? note.documents.map(res => new Document(res)) : [];
    note.createdBy = new User(note.createdBy);
    return note;
  }
}

export class ReleasePackage {
  id?: number;
  release_package_number?: string;
  title?: string;
  status?: number;
  status_label?: string;
  is_secure?: boolean;
  change_specialist3?: MiraiUser;
  executor?: MiraiUser;
  creator?: MiraiUser;
  plm_coordinator?: MiraiUser;
  change_control_boards?: string[];
  created_on?: Date;
  planned_release_date?: Date;
  planned_effective_date?: Date;
  sap_change_control?: boolean;
  prerequisites_applicable?: string;
  prerequisites_detail?: string;
  types?: string[];
  product_id?: string;
  project_id?: string;
  project_lead?: string;
  my_team?: MyTeam;
  contexts?: Context[];
  er_valid_from_input_strategy?: string;
  tags?: string[];
  prerequisite_release_packages?: ReleasePackagePrerequisite[];
  change_owner_type?: string;
  change_owner?: MiraiUser;
  statusLabel?: string;
  revision?: string; // should be removed
  revisionStatus?: string;
  generalInformation?: GeneralInformation;
  type?: string; // should be removed
  sourceSystemID?: string; // should be removed, which comes under contexts
  notes?: Note[];
  documents?: Document[];
  preRequisites?: string[];
  sourceSystemAliasID?: string; // should be removed, which comes under contexts
  statusTrackers?: StatusTracker[];
  projectLead?: User;
  state?: string;
  rp_id?: string;
  rp_title?: string;
  rp_status?: string | number;
  ecn_id?: string;
  ecn_title?: string;
  ecn_status?: string | number;
  tc_id?: string;
  tc_title?: string;
  tc_status?: string | number;
  mdgCr_id?: string;
  mdgCr_title?: string;
  mdgCr_status?: string | number;

  constructor(releasePackage ?: ReleasePackage) {
    releasePackage = releasePackage || {} as ReleasePackage;
    // releasePackage.notes = releasePackage.notes ? releasePackage.notes.map(res => new Note(res)) : [];
    releasePackage.documents = releasePackage.documents ? releasePackage.documents.map(res => new Document(res)) : [];
    if (releasePackage.executor) {
      releasePackage.executor = new MiraiUser(releasePackage.executor);
    }
    if (releasePackage.change_specialist3) {
      releasePackage.change_specialist3 = new MiraiUser(releasePackage.change_specialist3);
    }
    if (releasePackage.plm_coordinator) {
      releasePackage.plm_coordinator = new MiraiUser(releasePackage.plm_coordinator);
    }
    releasePackage.creator = new MiraiUser(releasePackage.creator);
    releasePackage.my_team = new MyTeam(releasePackage.my_team);
    releasePackage.contexts = releasePackage.contexts ? releasePackage.contexts.map(res => new Context(res)) : [];
    releasePackage.prerequisite_release_packages = releasePackage.prerequisite_release_packages ? releasePackage.prerequisite_release_packages.map(res => new ReleasePackagePrerequisite(res)) : [];
    releasePackage.change_owner = new MiraiUser(releasePackage.change_owner);
    releasePackage.statusTrackers = releasePackage.statusTrackers ? releasePackage.statusTrackers.map(res => new StatusTracker(res)) : [];
    return releasePackage;
  }
}

export class ReleasePackagePrerequisite {
  release_package_id?: number;
  release_package_number?: string;
  sequence_number?: number;

  constructor(releasePackagePrerequisite ?: ReleasePackagePrerequisite) {
    releasePackagePrerequisite = releasePackagePrerequisite || {} as ReleasePackagePrerequisite;
    return releasePackagePrerequisite;
  }
}

export class Dependencies {
  functionalHWDependencies?: string;
  functionalHWDepenDet?: string;
  functionalSWDependencies?: string;
  functionalSWDepenDet?: string;
  HWSWDependenciesAligned?: string;
  HWSWDepenAlignedDet?: string;

  constructor(dependencies ?: Dependencies) {
    dependencies = dependencies || {} as Dependencies;
    return dependencies;
  }
}

export class Permission {
  group?: string;
  user?: User;
  role?: string;
  level?: string[];
  roles?: string[];
  name?: string;

  constructor(permission ?: Permission) {
    permission = permission || {} as Permission;
    if (permission.user) {
      permission.user = new User(permission.user);
    }
    return permission;
  }

  static createChangeControlBoardPermission(group: string): Permission {
    const permission = new Permission();
    permission.group = group;
    permission.role = 'CCB';
    return permission;
  }

  static createChangeBoardPermission(group: string): Permission {
    const permission = new Permission();
    permission.group = group;
    permission.role = 'CB';
    return permission;
  }
}

export class NonRecurringCosts {
  inventoryReplaceExpense?: number;
  inventoryScrapCosts?: number;
  supplyChainAdjustments?: number;
  factoryChangeOrderCosts?: number;
  fieldChangeOrderCosts?: number;
  updateUpgradeProductDocs?: number;
  farmOutDevelopment?: number;
  prototypeMaterials?: number;

  constructor(nonRecurringCosts ?: NonRecurringCosts) {
    nonRecurringCosts = nonRecurringCosts || {} as NonRecurringCosts;
    return nonRecurringCosts;
  }
}

export class RecurringCosts {
  material?: number;
  labor?: number;
  cycleTime?: number;

  constructor(recurringCosts ?: RecurringCosts) {
    recurringCosts = recurringCosts || {} as RecurringCosts;
    return recurringCosts;
  }
}

export class Benefits {
  revenues?: number;
  OPEXReductionFieldLabor?: number;
  OPEXReductionSpareParts?: number;
  customerUptimeImpr?: number;
  otherOPEXSavings?: number;

  constructor(benefits ?: Benefits) {
    benefits = benefits || {} as Benefits;
    return benefits;
  }
}

export class Agenda {
  ID?: string;
  generalInformation?: GeneralInformation;
  attendeesPresent?: User[];
  attendeesAbsent?: User[];
  actualStartDate?: Date | string;
  actualFinishDate?: Date | string;
  chairPerson?: User;
  calendarID?: string;
  category?: string;
  plannedStartDate?: string | Date;
  plannedEndDate?: string | Date;

  constructor(agenda ?: Agenda) {
    agenda = agenda || {} as Agenda;
    agenda.generalInformation = new GeneralInformation(agenda.generalInformation);
    agenda.attendeesPresent = agenda.attendeesPresent ? agenda.attendeesPresent.map(res => new User(res)) : [];
    agenda.attendeesAbsent = agenda.attendeesAbsent ? agenda.attendeesAbsent.map(res => new User(res)) : [];
    agenda.chairPerson = new User(agenda.chairPerson);
    return agenda;
  }
}

export class AgendaItem {
  ID?: string;
  generalInformation?: GeneralInformation;
  purpose?: string;
  category?: string;
  subCategory?: string;
  plannedDuration?: string;
  actualDuration?: string;
  agendaSequenceNumber?: number;
  presenter?: User;
  minutes?: Minutes;
  notes?: Note[];
  specialInvitees?: User[];
  preferredDate?: Date;
  presentationDocuments?: Document[];
  productClusterManager?: User;
  applicableCBRules?: string[];
  productDevManager?: User;
  topic?: string;
  applicableCBRulesCat?: string;
  section?: string;
  purposeDetails?: string;
  changeBoardRuleSet?: string[];
  calendarID?: string;
  linkedObject?: ChangeRequest | ChangeNotice;
  isAOB?: boolean;
  agendaStartDate?: Date | string;
  sectionLabel?: string;

  constructor(agendaItem ?: AgendaItem) {
    agendaItem = agendaItem || {} as AgendaItem;
    agendaItem.generalInformation = new GeneralInformation(agendaItem.generalInformation);
    agendaItem.presenter = new User(agendaItem.presenter);
    agendaItem.minutes = new Minutes(agendaItem.minutes);
    agendaItem.notes = agendaItem.notes ? agendaItem.notes.map(res => new Note(res)) : [];
    agendaItem.specialInvitees = agendaItem.specialInvitees ? agendaItem.specialInvitees.map(res => new User(res)) : [];
    agendaItem.presentationDocuments = agendaItem.presentationDocuments ? agendaItem.presentationDocuments.map(res => new Document(res)) : [];
    agendaItem.productClusterManager = new User(agendaItem.productClusterManager);
    agendaItem.productDevManager = new User(agendaItem.productDevManager);
    return agendaItem;
  }
}

export class Minutes {
  date?: Date;
  attendeesPresent?: User[];
  minutes?: string;
  conclusion?: string;

  constructor(minutes ?: Minutes) {
    minutes = minutes || {} as Minutes;
    minutes.attendeesPresent = minutes.attendeesPresent ? minutes.attendeesPresent.map(res => new User(res)) : [];
    return minutes;
  }
}

export class Period {
  startDate?: Date;
  endDate?: Date;

  constructor(period ?: Period) {
    period = period || {} as Period;
    return period;
  }
}

export class ChangeNoticeImpactAnalysis {
  upgradePackages?: string;
  productBaselinesAffected?: string[];
  productionModAffected?: string[];
  totalInstancesAffected?: string;
  upgradeTime?: string;
  recoveryTime?: string;
  prePostConditions?: string;
  impactOnSequence?: string;
  impactOnFacilities?: string;
  impactOnAvailability?: string;
  impactOnSequenceDet?: string;
  impactOnFacilitiesDet?: string;
  impactOnAvailabilityDet?: string;
  multiplantImpact?: string;
  mandatoryUpgrade?: string;
  mandatoryUpgradeDetails?: string;
  impactOnCycleTime?: string;
  impactOnCycleTimeDetails?: string;
  developmentLaborHours?: string;
  impactOnPreInstall?: string;
  investigationLaborHours?: string;
  leadingNonLeading?: string;
  targetedValidConfig?: string;
  impactOnLaborHours?: string;
  impactOnLaborHoursDet?: string;

  constructor(changeNoticeImpactAnalysis ?: ChangeNoticeImpactAnalysis) {
    changeNoticeImpactAnalysis = changeNoticeImpactAnalysis || {} as ChangeNoticeImpactAnalysis;
    return changeNoticeImpactAnalysis;
  }
}

export class Investments {
  factoryInvestments?: number;
  FSToolingInvestments?: number;
  SCManagementInvestments?: number;
  supplierInvestments?: number;
  DEInvestments?: number;

  constructor(investments ?: Investments) {
    investments = investments || {} as Investments;
    return investments;
  }
}

export class CustomerImpactAnalysis {
  assessmentCriterias?: AssessmentCriteria[];
  customerImpact?: string;

  constructor(customerImpactAnalysis ?: CustomerImpactAnalysis) {
    customerImpactAnalysis = customerImpactAnalysis || {} as CustomerImpactAnalysis;
    customerImpactAnalysis.assessmentCriterias = customerImpactAnalysis.assessmentCriterias ? customerImpactAnalysis.assessmentCriterias.map(res => new AssessmentCriteria(res)) : [];
    return customerImpactAnalysis;
  }
}

export class AssessmentCriteria {
  question?: string;
  answer?: string;
  motivation?: string;
  explanation?: string;

  constructor(assessmentCriteria ?: AssessmentCriteria) {
    assessmentCriteria = assessmentCriteria || {} as AssessmentCriteria;
    return assessmentCriteria;
  }
}

export class Review {
  id?: number;
  ID?: string;
  contexts?: Context[];
  due_date?: Date;
  executor?: MiraiUser;
  status?: number;
  title?: string;
  created_on?: Date;
  creator?: MiraiUser;
  completion_date?: Date;

  constructor(review ?: Review) {
    review = review || {} as Review;
    review.contexts = review.contexts ? review.contexts.map(res => new Context(res)) : [];
    review.executor = (review.executor && review.executor.user_id || review.executor && review.executor['userID']) ? new MiraiUser(review.executor) : null;
    review.creator = (review.creator && review.creator.user_id || review.creator && review.creator['userID']) ? new MiraiUser(review.creator) : null;
    return review;
  }
}

export class ReviewEntry {
  id?: number;
  contexts?: Context[];
  status?: number;
  description?: string;
  classification?: string;
  remark?: string;
  sequence_number?: number;
  created_on?: Date;
  creator?: MiraiUser;
  assignee?: MiraiUser;

  constructor(reviewEntry ?: ReviewEntry) {
    reviewEntry = reviewEntry || {} as ReviewEntry;
    reviewEntry.contexts = reviewEntry.contexts ? reviewEntry.contexts.map(res => new Context(res)) : [];
    reviewEntry.creator = reviewEntry && reviewEntry.assignee ? new MiraiUser(reviewEntry.creator) : null;
    reviewEntry.assignee = reviewEntry && reviewEntry.assignee ? new MiraiUser(reviewEntry.assignee) : null;
    return reviewEntry;
  }
}

export class Reviewer {
  id?: number;
  assignee?: MiraiUser;
  assignees?: MiraiUser[];
  due_date?: Date;
  status?: number;
  created_on?: Date;
  creator?: MiraiUser;

  constructor(reviewer ?: Reviewer) {
    reviewer = reviewer || {} as Reviewer;
    reviewer.assignee = new MiraiUser(reviewer.assignee);
    reviewer.creator = new MiraiUser(reviewer.creator);
    reviewer.assignees = reviewer.assignees ? reviewer.assignees.map(res => new MiraiUser(res)) : [];
    return reviewer;
  }
}

export class AuditRecord {
  changedBy: string;
  changedOn: string;
  field: string;
  newValue: any;
  oldValue: any;

  constructor(entry: AuditEntry, caseObject: string, getLabelFn: any, getValueFn: any) {
    this.changedBy = entry.updater.full_name;
    this.changedOn = entry.updated_on;
    this.field = entry.property ? caseObject + '.' + getLabelFn(caseObject, entry.property) : caseObject;
    this.field = entry.revision_type === 'DEL' ? this.field + ' (Deleted)' : this.field;
    this.field = entry.revision_type === 'ADD' ? this.field + ' (Added)' : this.field;
    this.newValue = getValueFn(caseObject, entry.property, entry.value);
    this.oldValue = getValueFn(caseObject, entry.property, entry.old_value);
  }
}

export class ReviewEntryComments {
  id?: number;
  status?: number;
  comment_text?: string;
  created_on?: Date;
  creator?: User;

  constructor(reviewEntryComments ?: ReviewEntryComments) {
    reviewEntryComments = reviewEntryComments || {} as ReviewEntryComments;
    reviewEntryComments.creator = new User(reviewEntryComments.creator);
    return reviewEntryComments;
  }
}

export class ReviewerNotification {
  entity_id?: string;
  category?: string;
  role?: string;
  entity?: string;
  actor?: User;
  recipient?: User;
  timestamp?: string;
  title?: string;

  constructor(reviewerNotification ?: ReviewerNotification) {
    reviewerNotification = reviewerNotification || {} as ReviewerNotification;
    reviewerNotification.actor = new User(reviewerNotification.actor);
    reviewerNotification.recipient = new User(reviewerNotification.recipient);
    return reviewerNotification;
  }
}

export class ReviewEntryCommentDocumentResponse {
  id?: number;
  name?: string;
  type?: string;
  description?: string;
  tags?: string[];
  status?: number;
  creator?: User;
  created_on?: Date;

  constructor(reviewEntryCommentDocumentResponse ?: ReviewEntryCommentDocumentResponse) {
    reviewEntryCommentDocumentResponse = reviewEntryCommentDocumentResponse || {} as ReviewEntryCommentDocumentResponse;
    reviewEntryCommentDocumentResponse.creator = new User(reviewEntryCommentDocumentResponse.creator);
    return reviewEntryCommentDocumentResponse;
  }
}


export class ReviewItem {
  sourceSystemID?: string;
  name?: string;

  constructor(reviewItem ?: ReviewItem) {
    reviewItem = reviewItem || {} as ReviewItem;
    return reviewItem;
  }
}

export class FinancialSummary {
  internalRateofReturn?: number;
  BSNLSavings?: number;
  paybackPeriod?: number;
  customerOpexSavings?: number;

  constructor(financialSummary ?: FinancialSummary) {
    financialSummary = financialSummary || {} as FinancialSummary;
    return financialSummary;
  }
}

export class PreInstallImpactAnalysis {
  assessmentCriterias?: AssessmentCriteria[];
  preInstallImpact?: string;

  constructor(preInstallImpactAnalysis ?: PreInstallImpactAnalysis) {
    preInstallImpactAnalysis = preInstallImpactAnalysis || {} as PreInstallImpactAnalysis;
    preInstallImpactAnalysis.assessmentCriterias = preInstallImpactAnalysis.assessmentCriterias ? preInstallImpactAnalysis.assessmentCriterias.map(res => new AssessmentCriteria(res)) : [];
    return preInstallImpactAnalysis;
  }
}

export class Approval {
  customerApproval?: string;
  customerApprovalDet?: string;

  constructor(approval ?: Approval) {
    approval = approval || {} as Approval;
    return approval;
  }
}

export class Communication {
  customerCommunication?: string;
  customerCommunicationDet?: string;

  constructor(communication ?: Communication) {
    communication = communication || {} as Communication;
    return communication;
  }
}

export class CustomerPaybackPeriod {
  uptimeImprovement?: string;
  FCOImplementation?: string;
  customerUptimePayback?: string;
  uptimeImprovAvail?: number;
  FCOImplAvailability?: number;
  custUptimePaybackAvail?: number;
  custUptimePaybckAvailDur?: string;

  constructor(customerPaybackPeriod ?: CustomerPaybackPeriod) {
    customerPaybackPeriod = customerPaybackPeriod || {} as CustomerPaybackPeriod;
    return customerPaybackPeriod;
  }
}

export class Dependency {
  ID?: string;
  revision?: string;
  type?: string;
  sequenceNumber?: number;

  constructor(dependency ?: Dependency) {
    dependency = dependency || {} as Dependency;
    return dependency;
  }
}

export class Context {
  type?: string;
  contextID?: string;
  context_id?: string;
  name?: string;
  status?: number | string;

  constructor(context ?: Context) {
    context = context || {} as Context;
    return context;
  }
}


export class CaseObjectData {
  caseObjectType?: string;
  caseObject?: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem | Review;

  constructor(caseObjectType: string, caseObject: CaseObject) {
    this.caseObjectType = caseObjectType;
    this.caseObject = caseObject;
  }
}

export class ActionSummary {
  assignee?: User;
  ID?: string;
  status?: string;
  title?: string;
  type?: string;
  deadline?: Date;
  totalNotes?: number;
  isCompleteAllowed?: boolean;
  isAcceptAllowed?: boolean;
  isRejectAllowed?: boolean;
  isDeleteAllowed?: boolean;
  isSaveAllowed?: boolean;

  constructor(actionSummary ?: ActionSummary) {
    actionSummary = actionSummary || {} as ActionSummary;
    this.assignee = new User(actionSummary.assignee);
    this.ID = actionSummary.ID ? actionSummary.ID : '';
    this.status = actionSummary.status ? actionSummary.status : '';
    this.title = actionSummary.title ? actionSummary.title : '';
    this.type = actionSummary.type ? actionSummary.type : '';
    this.deadline = actionSummary.deadline;
    this.totalNotes = actionSummary.totalNotes ? actionSummary.totalNotes : 0;
    this.isCompleteAllowed = actionSummary.isCompleteAllowed ? actionSummary.isCompleteAllowed : true;
    this.isAcceptAllowed = actionSummary.isAcceptAllowed ? actionSummary.isAcceptAllowed : true;
    this.isRejectAllowed = actionSummary.isRejectAllowed ? actionSummary.isRejectAllowed : true;
    this.isDeleteAllowed = actionSummary.isDeleteAllowed ? actionSummary.isDeleteAllowed : true;
    this.isSaveAllowed = actionSummary.isSaveAllowed ? actionSummary.isSaveAllowed : true;
    return this;
  }
}

export class NoteSummaryElement {
  note?: NoteElement;
  attachments?: AttachmentElement[];

  constructor(noteSummaryElement ?: NoteSummaryElement) {
    noteSummaryElement = noteSummaryElement || [] as NoteSummaryElement;
    noteSummaryElement.note = noteSummaryElement.note || {} as NoteElement;
    noteSummaryElement.attachments = noteSummaryElement.attachments ? noteSummaryElement.attachments.map(res => new AttachmentElement(res)) : [] as AttachmentElement[];
    return noteSummaryElement;
  }
}

export class AttachmentElement {
  contentSize?: number;
  contentType?: string;
  document?: Document;

  constructor(attachmentElement ?: AttachmentElement) {
    attachmentElement = attachmentElement || [] as AttachmentElement;
    attachmentElement.contentSize = attachmentElement.contentSize || 0;
    attachmentElement.contentType = attachmentElement.contentType || '';
    attachmentElement.document = attachmentElement.document ? new Document(attachmentElement.document) : {} as Document;
    return attachmentElement;
  }
}

export class NoteElement {
  note?: string;
  type?: string;
  createdBy?: User;
  createdOn?: Date;
  tags?: string[];
  ID?: string;
  status?: string;
  lastModifiedOn?: Date;
  documents?: Document[];

  constructor(noteElement ?: NoteElement) {
    noteElement = noteElement || {} as NoteElement;
    noteElement.createdBy = new User(noteElement.createdBy);
    return noteElement;
  }
}

export class CategorizedNoteSummary {
  CategorizedNoteSummariesElement: CategorizedNoteSummaryElement[];
  allNotesCount: number;
  crNotesCount: number;
  cnNotesCount: number;
  rpNotesCount: number;
  acNotesCount: number;

  constructor(categorizedNoteSummary ?: CategorizedNoteSummary) {
    categorizedNoteSummary.CategorizedNoteSummariesElement = categorizedNoteSummary.CategorizedNoteSummariesElement || [] as CategorizedNoteSummaryElement[];
    return categorizedNoteSummary;
  }
}

export class CategorizedNoteSummaryElement {
  category: string;
  noteSummaries: NoteSummaryElement[];

  constructor(categorizedNoteSummaryElement: CategorizedNoteSummaryElement) {
    categorizedNoteSummaryElement.category = categorizedNoteSummaryElement.category || '';
    categorizedNoteSummaryElement.noteSummaries = categorizedNoteSummaryElement.noteSummaries || [] as NoteSummaryElement[];
    return categorizedNoteSummaryElement;
  }
}

export class PermissionElement {
  PermissionElement: Permission;

  constructor(permission: Permission) {
    this.PermissionElement = permission;
  }
}

export class UserElement {
  UserElement: User;

  constructor(user: User) {
    if (user) {
      const tempUser = new User();
      tempUser.abbreviation = user.abbreviation;
      tempUser.departmentName = user.departmentName;
      tempUser.email = user.email;
      tempUser.fullName = user.fullName;
      tempUser.userID = user.userID;
      this.UserElement = tempUser;
    }
  }
}

export class UserElement2 {
  UserElement: MiraiUser;

  constructor(user: MiraiUser) {
    if (user) {
      const tempUser = new MiraiUser();
      tempUser.abbreviation = user.abbreviation;
      tempUser.department_name = user.department_name || user['departmentName'];
      tempUser.email = user.email;
      tempUser.full_name = user.full_name || user['fullName'];
      tempUser.user_id = user.user_id || user['userID'];
      this.UserElement = tempUser;
    }
  }
}

export class CaseObject {
  ID: string;
  revision: string;
  type: string;

  constructor(ID: string, revision: string, type: string) {
    this.ID = ID;
    this.revision = revision;
    this.type = type;
  }
}

export class CaseActionElement {
  name: string;
  isAllowed: boolean;
  mandatoryParameters: string[];

  constructor(name: string, isAllowed: boolean, mandatoryParameters: string[]) {
    this.name = name;
    this.isAllowed = isAllowed;
    this.mandatoryParameters = mandatoryParameters;
  }
}

export class CaseActionDetail {
  case_action: string;
  mandatory_properties_regexps: string[];
  is_allowed: boolean;
}

export class CasePermissions {
  case_actions: CaseActionDetail[];
  case_properties: any;
}

export class CaseStatus {
  status: number;
  status_label: string;
  case_permissions: CasePermissions;
}

export class UserType {
  abbreviation?: string;
  department_name?: string;
  email?: string;
  full_name?: string;
  user_id?: string;

  constructor(userType ?: UserType) {
    userType = userType || {} as UserType;
    return userType;
  }
}

export class ReviewEntryType {
  description?: string;
  classification?: string;

  constructor(reviewEntryType ?: ReviewEntryType) {
    reviewEntryType = reviewEntryType || {} as ReviewEntryType;
    return reviewEntryType;
  }
}

export interface ReviewAuditAggregate {
  review_change_log: AuditData;
  review_tasks_change_log: ReviewTaskAuditAggregate[];
}

export interface ReviewTaskAuditAggregate {
  review_task_change_log: AuditData;
  review_entries_change_log: ReviewEntryAuditAggregate[];
}

export interface ReviewEntryAuditAggregate {
  review_entry_change_log: AuditData;
}

export interface AuditData {
  entries: AuditEntry[];
}

export interface AuditEntry {
  updater: MiraiUser;
  updated_on: string;
  revision: number;
  revision_type: AuditTypes;
  property: string;
  value: any;
  old_value: any;
  id: number;
}

export class ImpactedItem {
  id?: number;
  uid?: string;
  type?: string;
  category?: string;
  name?: string;
  revision?: string;
  title?: string;
  change_type?: string;
  description?: string;
  creators?: MiraiUser[] | MiraiUser;
  users?: MiraiUser[];
  creator?: MiraiUser;
  created_on?: Date;
  is_change_owner?: boolean;
  is_modified?: boolean;
  sequence?: number;
  contexts?: Context[];
  status?: number;
  new_existing_toggle?: string;
  release_package_number?: string;
  deleteInProgress?: boolean;
  change_object_type?: string;
  change_object_number?: string;
  change_type_label?: any;

  constructor(impactedItem ?: ImpactedItem) {
    impactedItem = impactedItem || {} as ImpactedItem;
    if (!(impactedItem.creators instanceof MiraiUser)) {
      impactedItem.creators = impactedItem.creators ? impactedItem.creators.map(res => new MiraiUser(res)) : [];
    } else {
      impactedItem.creators = new MiraiUser(impactedItem.creators);
    }
    impactedItem.users = impactedItem.users ? impactedItem.users.map(res => new MiraiUser(res)) : [];
    impactedItem.creator = new MiraiUser(impactedItem.creator);
    impactedItem.contexts = impactedItem.contexts ? impactedItem.contexts.map(res => new Context(res)) : [];
    return impactedItem;
  }
}

export interface MaterialList {
  id?: string;
  defect_count?: number;
  warning_messages?: Message[];
  sap_mdg_solution_item?: SapMdgSolutionItems;
  teamcenter_solution_item?: TeamCenterSolutionItems;
}

export interface SapMdgSolutionItems {
  defect_count?: number;
  failure_rate?: TeamCenterSAPMDGValueType | null;
  materialID?: string;
  material_type?: TeamCenterSAPMDGValueType | null;
  regular_part_description?: TeamCenterSAPMDGValueType | null;
  serial_number_profile?: TeamCenterSAPMDGValueType | null;
  sourcing_plant?: TeamCenterSAPMDGValueType | null;
  tools_packaging_category?: TeamCenterSAPMDGValueType | null;
  tools_packaging_category_description?: TeamCenterSAPMDGValueType | null;
  plant_specific?: PlantSpecific[];
}
export interface TeamCenterSolutionItems {
  id?: string;
  change_type_label?: string;
  change_type?: TeamCenterSAPMDGValueType | null;
  config_relevant_indicator?: TeamCenterSAPMDGValueType | null;
  cross_plant_status?: TeamCenterSAPMDGValueType | null;
  defect_count?: number;
  description?: TeamCenterSAPMDGValueType | null;
  material_group?: TeamCenterSAPMDGValueType | null;
  material_type?: TeamCenterSAPMDGValueType | null;
  name?: string;
  occurrence_order_number?: TeamCenterSAPMDGValueType | null;
  owner?: TeamCenterSAPMDGValueType | null;
  procurement_type?: TeamCenterSAPMDGValueType | null;
  project_code?: TeamCenterSAPMDGValueType | null;
  quantity?: string;
  revision?: TeamCenterSAPMDGValueType | null;
  sap_change_controlled?: TeamCenterSAPMDGValueType | null;
  serial_number_profile?: TeamCenterSAPMDGValueType | null;
  serialization_indicator?: TeamCenterSAPMDGValueType | null;
  service_material_part_indicator?: TeamCenterSAPMDGValueType | null;
  solution_item_id?: string;
  source_material?: TeamCenterSAPMDGValueType | null;
  stepper_model?: TeamCenterSAPMDGValueType | null;
  tc_change_controlled?: TeamCenterSAPMDGValueType | null;
  unit_of_measure?: TeamCenterSAPMDGValueType | null;
}

export interface TeamCenterSAPMDGValueType {
  old_value?: string;
  new_value?: string;
}

export interface Message {
  message?: string[];
  title?: string;
}

export interface PlantSpecific {
  disco_description?: TeamCenterSAPMDGValueType | null;
  disco_indicator?: TeamCenterSAPMDGValueType | null;
  followup_material?: TeamCenterSAPMDGValueType | null;
  in_house_pdt?: TeamCenterSAPMDGValueType | null;
  mrp_controller?: TeamCenterSAPMDGValueType | null;
  mrp_profile?: TeamCenterSAPMDGValueType | null;
  object_dependency?: TeamCenterSAPMDGValueType | null;
  pdt?: TeamCenterSAPMDGValueType | null;
  plant_name?: string;
  plant_status?: TeamCenterSAPMDGValueType | null;
  ref_material?: TeamCenterSAPMDGValueType | null;
  spec_procurement_type?: TeamCenterSAPMDGValueType | null;
  spec_procurement_type_description?: TeamCenterSAPMDGValueType | null;
}

export interface TPD {
  uid?: string;
  name?: string;
  revision?: string;
  description?: string;
  document_type?: string;
  document_part?: string;
  document_version?: string;
  document_status?: string;
  new_change_number?: string;
  document_link?: string;
  defect_count?: number;
  id?: string;
  complete_tpd_id?: string;
}

export interface BomStructure {
  solution_item_id?: string;
  name?: string;
  revision?: string;
  description?: string;
  change_type?: string;
  change_type_label?: string;
  cross_plant_status?: string;
  config_relevant_indicator?: string;
  service_material_part_indicator?: string;
  sap_change_controlled?: string;
  tc_change_controlled?: string;
  owner?: string;
  material_type?: string;
  serialization_indicator?: string;
  material_group?: string;
  serial_number_profile?: string;
  source_material?: string;
  unit_of_material?: string;
  tpds?: string;
  solution_items?: string;
  defect_count?: number;
  procurement_type?: string;
  unit_of_measure?: string;
  quantity?: string;
  occurrence_order_number?: string;
  C?: string;
  P?: string;
  review_solution_items?: BomStructure[];
  id?: string;
}
