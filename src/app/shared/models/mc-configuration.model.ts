

export interface ChangeRequestFormConfiguration {
  id: FormControlConfiguration;
  contexts: ContextFormConfiguration;
  title: FormControlConfiguration;
  status: FormControlConfiguration;
  is_secure: FormControlConfiguration;
  change_specialist1: UserFormConfiguration;
  change_specialist2: UserFormConfiguration;
  creator: UserFormConfiguration;
  created_on: FormControlConfiguration;
  change_control_boards: FormControlConfiguration;
  change_boards: FormControlConfiguration;
  issue_types: FormControlConfiguration;
  change_request_type: FormControlConfiguration;
  analysis_priority: FormControlConfiguration;
  project_id: FormControlConfiguration;
  product_id: FormControlConfiguration;
  functional_cluster_id: FormControlConfiguration;
  reasons_for_change: FormControlConfiguration;
  problem_description: FormControlConfiguration;
  proposed_solution: FormControlConfiguration;
  root_cause: FormControlConfiguration;
  benefits_of_change: FormControlConfiguration;
  implementation_priority: FormControlConfiguration;
  requirements_for_implementation_plan: FormControlConfiguration;
  excess_and_obsolescence_savings: FormControlConfiguration;
  dependent_change_request_ids: FormControlConfiguration;
  change_board_rule_set: RuleSetFormConfiguration;
  scope: ScopeFormConfiguration;
  solution_definition: SolutionDefineFormConfiguration;
  impact_analysis: ImpactAnalysisFormConfiguration;
  complete_business_case: CompleteBusinessCaseFormConfiguration;
  my_team: MyTeamFormConfiguration;
  scia_document?: FormControlConfiguration;
  cbc_document?: FormControlConfiguration;
  change_owner: UserFormConfiguration;
  change_owner_type: FormControlConfiguration;
  problemItems: FormControlConfiguration;
  scopeItems: FormControlConfiguration;
}

export interface RuleSetFormConfiguration {
  name: FormControlConfiguration;
  rules: FormControlConfiguration;
  options?: FormControlConfiguration[];
}

export interface ScopeFormConfiguration {
  id: FormControlConfiguration;
  scope_details: FormControlConfiguration;
  parts: FormControlConfiguration;
  part_detail: PartsFormConfiguration;
  tooling: FormControlConfiguration;
  tooling_detail: ToolingFormConfiguration;
  packaging: FormControlConfiguration;
  packaging_detail: PackagingFormConfiguration;
  bop: FormControlConfiguration;
  bop_detail: FormControlConfiguration;
}

export interface PartsFormConfiguration {
  machine_bom_part: FormControlConfiguration;
  service_part: FormControlConfiguration;
  preinstall_part: FormControlConfiguration;
  test_rig_part: FormControlConfiguration;
  dev_bag_part: FormControlConfiguration;
  fco_upgrade_option_csr: FormControlConfiguration;
}

export interface ToolingFormConfiguration {
  supplier_tooling: FormControlConfiguration;
  manufacturing_de_tooling: FormControlConfiguration;
  service_tooling: FormControlConfiguration;
}

export interface PackagingFormConfiguration {
  supplier_packaging: FormControlConfiguration;
  storage_packaging: FormControlConfiguration;
  shipping_packaging: FormControlConfiguration;
  reusable_packaging: FormControlConfiguration;
}

export interface SolutionDefineFormConfiguration {
  id: FormControlConfiguration;
  functional_software_dependencies: FormControlConfiguration;
  functional_software_dependencies_details: FormControlConfiguration;
  functional_hardware_dependencies: FormControlConfiguration;
  functional_hardware_dependencies_details: FormControlConfiguration;
  hardware_software_dependencies_aligned: FormControlConfiguration;
  hardware_software_dependencies_aligned_details: FormControlConfiguration;
  test_and_release_strategy: FormControlConfiguration;
  test_and_release_strategy_details: FormControlConfiguration;
  products_affected: FormControlConfiguration;
  products_module_affected: FormControlConfiguration;
  aligned_with_fo: FormControlConfiguration;
  aligned_with_fo_details: FormControlConfiguration;
  technical_recommendation: FormControlConfiguration;
}

export interface CustomerImpactFormConfiguration {
  id: FormControlConfiguration;
  customer_impact_result: FormControlConfiguration;
  customer_approval: FormControlConfiguration;
  customer_approval_details: FormControlConfiguration;
  customer_communication: FormControlConfiguration;
  customer_communication_details: FormControlConfiguration;
  uptime_improvement: FormControlConfiguration;
  fco_implementation: FormControlConfiguration;
  uptime_payback: FormControlConfiguration;
  uptime_improvement_availability: FormControlConfiguration;
  fco_implementation_availability: FormControlConfiguration;
  uptime_payback_availability: FormControlConfiguration;
  impact_on_user_interfaces: FormControlConfiguration;
  impact_on_user_interfaces_details: FormControlConfiguration;
  impact_on_wafer_process_environment: FormControlConfiguration;
  impact_on_wafer_process_environment_details: FormControlConfiguration;
  change_to_customer_impact_critical_part: FormControlConfiguration;
  change_to_customer_impact_critical_part_details: FormControlConfiguration;
  change_to_process_impacting_customer: FormControlConfiguration;
  change_to_process_impacting_customer_details: FormControlConfiguration;
  fco_upgrade_option_csr_implementation_change: FormControlConfiguration;
  fco_upgrade_option_csr_implementation_change_details: FormControlConfiguration;
}

export interface ImpactAnalysisFormConfiguration {
  id: FormControlConfiguration;
  customer_impact: CustomerImpactFormConfiguration;
  preinstall_impact: PreInstallImpactFormConfiguration;
  upgrade_packages: FormControlConfiguration;
  upgrade_time: FormControlConfiguration;
  recovery_time: FormControlConfiguration;
  pre_post_conditions: FormControlConfiguration;
  impact_on_sequence: FormControlConfiguration;
  impact_on_sequence_details: FormControlConfiguration;
  impact_on_availability: FormControlConfiguration;
  impact_on_availability_details: FormControlConfiguration;
  multi_plant_impact: FormControlConfiguration;
  phase_out_spares_tools: FormControlConfiguration;
  phase_out_spares_tools_details: FormControlConfiguration;
  tech_risk_assessment_sra: FormControlConfiguration;
  tech_risk_assessment_sra_details: FormControlConfiguration;
  tech_risk_assessment_fmea: FormControlConfiguration;
  tech_risk_assessment_fmea_details: FormControlConfiguration;
  total_instances_affected: FormControlConfiguration;
  impact_on_system_level_performance: FormControlConfiguration;
  impact_on_system_level_performance_details: FormControlConfiguration;
  impact_on_cycle_time: FormControlConfiguration;
  impact_on_cycle_time_details: FormControlConfiguration;
  impact_on_labor_hours: FormControlConfiguration;
  impact_on_labor_hours_details: FormControlConfiguration;
  impact_on_existing_parts: FormControlConfiguration;
  liability_risks: FormControlConfiguration;
  implementation_ranges: FormControlConfiguration;
  implementation_ranges_details: FormControlConfiguration;
  cbp_strategies: FormControlConfiguration;
  cbp_strategies_details: FormControlConfiguration;
  development_labor_hours: FormControlConfiguration;
  investigation_labor_hours: FormControlConfiguration;
  fco_types: FormControlConfiguration;
  calendar_dependency: FormControlConfiguration;
  targeted_valid_configurations: FormControlConfiguration;
}

export interface PreInstallImpactFormConfiguration {
  id: FormControlConfiguration;
  preinstall_impact_result: FormControlConfiguration;
  change_introduces_new11_nc: FormControlConfiguration;
  change_introduces_new11_nc_details: FormControlConfiguration;
  impact_on_customer_factory_layout: FormControlConfiguration;
  impact_on_customer_factory_layout_details: FormControlConfiguration;
  impact_on_facility_flows: FormControlConfiguration;
  impact_on_facility_flows_details: FormControlConfiguration;
  impact_on_preinstall_inter_connect_cables: FormControlConfiguration;
  impact_on_preinstall_inter_connect_cables_details: FormControlConfiguration;
  change_replaces_mentioned_parts: FormControlConfiguration;
  change_replaces_mentioned_parts_details: FormControlConfiguration;
}

export interface CompleteBusinessCaseFormConfiguration {
  id: FormControlConfiguration;
  risk: FormControlConfiguration;
  risk_in_labor_hours: FormControlConfiguration;
  hardware_commitment: FormControlConfiguration;
  system_starts_impacted: FormControlConfiguration;
  systems_in_wip_and_field_impacted: FormControlConfiguration;
  factory_investments: FormControlConfiguration;
  fs_tooling_investments: FormControlConfiguration;
  supply_chain_management_investments: FormControlConfiguration;
  supplier_investments: FormControlConfiguration;
  de_investments: FormControlConfiguration;
  material_recurring_costs: FormControlConfiguration;
  labor_recurring_costs: FormControlConfiguration;
  cycle_time_recurring_costs: FormControlConfiguration;
  inventory_replace_nonrecurring_costs: FormControlConfiguration;
  inventory_scrap_nonrecurring_costs: FormControlConfiguration;
  supply_chain_adjustments_nonrecurring_costs: FormControlConfiguration;
  factory_change_order_nonrecurring_costs: FormControlConfiguration;
  field_change_order_nonrecurring_costs: FormControlConfiguration;
  update_upgrade_product_documentation_nonrecurring_costs: FormControlConfiguration;
  farm_out_development_nonrecurring_costs: FormControlConfiguration;
  prototype_materials_nonrecurring_costs: FormControlConfiguration;
  revenues_benefits: FormControlConfiguration;
  opex_reduction_field_labor_benefits: FormControlConfiguration;
  opex_reduction_spare_parts_benefits: FormControlConfiguration;
  customer_uptime_improvement_benefits: FormControlConfiguration;
  other_opex_savings_benefits: FormControlConfiguration;
  internal_rate_of_return: FormControlConfiguration;
  bsnl_savings: FormControlConfiguration;
  payback_period: FormControlConfiguration;
  customer_opex_savings: FormControlConfiguration;
  risk_on_excess_and_obsolescence: FormControlConfiguration;
  risk_on_excess_and_obsolescence_reduction_proposal: FormControlConfiguration;
  risk_on_excess_and_obsolescence_reduction_proposal_costs: FormControlConfiguration;
}

export interface MemberFormConfiguration {
  id: FormControlConfiguration;
  status: FormControlConfiguration;
  user: UserFormConfiguration;
  roles: FormControlConfiguration;
}

export interface MyTeamFormConfiguration {
  id: FormControlConfiguration;
  members: MemberFormConfiguration;
}

export interface DefineScopeFormConfiguration {
  defineScope: DefineScopeConfiguration;
}

export interface DefineScopeConfiguration {
  parts: WarningFormConfiguration;
  tooling: WarningFormConfiguration;
  packaging: WarningFormConfiguration;
  complete: WarningFormConfiguration;
  define: WarningFormConfiguration;
}

export interface WarningFormConfiguration {
  warning: WarningConfiguration;
}

export interface WarningConfiguration {
  label: FormControlConfiguration;
  explanation: FormControlConfiguration;
  hint?: FormControlConfiguration;
}

export interface UserFormConfiguration {
  userID?: FormControlConfiguration;
  fullName?: FormControlConfiguration;
  email?: FormControlConfiguration;
  abbreviation?: FormControlConfiguration;
  departmentName?: FormControlConfiguration;
}

export interface GeneralInformationFormConfiguration {
  title: FormControlConfiguration;
  state: FormControlConfiguration;
  status: FormControlConfiguration;
  createdBy: UserFormConfiguration;
  createdOn: FormControlConfiguration;
  lastModifiedOn: FormControlConfiguration;
  submittedOn: FormControlConfiguration;
  permissions: PermissionFormConfiguration;
}

export interface ChangeRequestImpactAnalysisFormConfiguration {
  upgradePackages: FormControlConfiguration;
  productBaselinesAffected: FormControlConfiguration;
  productionModAffected: FormControlConfiguration;
  upgradeTime: FormControlConfiguration;
  recoveryTime: FormControlConfiguration;
  prePostConditions: FormControlConfiguration;
  impactOnSequence: FormControlConfiguration;
  impactOnFacilities: FormControlConfiguration;
  impactOnAvailability: FormControlConfiguration;
  multiplantImpact: FormControlConfiguration;
  accordingPBSAIRStrategy: FormControlConfiguration;
  phaseOutSparesTools: FormControlConfiguration;
  CBC: CBCFormConfiguration;
  impactOnSequenceDet: FormControlConfiguration;
  impactOnFacilitiesDet: FormControlConfiguration;
  impactOnAvailabilityDet: FormControlConfiguration;
  accordingPBSAIRStratDet: FormControlConfiguration;
  phaseOutSparesToolsDet: FormControlConfiguration;
  techRiskAssessSRA: FormControlConfiguration;
  techRiskAssessFMEA: FormControlConfiguration;
  techRiskAssessSRADet: FormControlConfiguration;
  techRiskAssessFMEADet: FormControlConfiguration;
  totalInstancesAffected: FormControlConfiguration;
  customerImpactAnalysis: CustomerImpactAnalysisFormConfiguration;
  sysLevelPerformImpact: FormControlConfiguration;
  sysLevelPerformImpactDet: FormControlConfiguration;
  mandatoryUpgrade: FormControlConfiguration;
  mandatoryUpgradeDetails: FormControlConfiguration;
  impactOnCycleTime: FormControlConfiguration;
  impactOnCycleTimeDetails: FormControlConfiguration;
  developmentLaborHours: FormControlConfiguration;
  preInstallImpactAnalysis: PreInstallImpactAnalysisFormConfiguration;
  impactOnFIR: FormControlConfiguration;
  liabilityRisk: FormControlConfiguration;
  investigationLaborHours: FormControlConfiguration;
  impactOnExistingParts: FormControlConfiguration;
  impactOnUserInterfaces: FormControlConfiguration;
  impactOnUserInterfDtls: FormControlConfiguration;
  impactOnWaferProcessEnv: FormControlConfiguration;
  impactOnWaferProcEnvDtls: FormControlConfiguration;
  changeToCustImpCrtclPart: FormControlConfiguration;
  chngCustImpCrtclPartDtls: FormControlConfiguration;
  changeToProcImpactCust: FormControlConfiguration;
  changeProcImpactCustDtls: FormControlConfiguration;
  FCOUpgOptCSRImplChange: FormControlConfiguration;
  FCOUpgOptCSRImplChngDtls: FormControlConfiguration;
  leadingNonLeading: FormControlConfiguration;
  targetedValidConfig: FormControlConfiguration;
}

export interface ChangeNoticeFormConfiguration {
  ID: FormControlConfiguration;
  revision: FormControlConfiguration;
  revisionStatus: FormControlConfiguration;
  generalInformation: GeneralInformationFormConfiguration;
  statusTrackers: StatusTrackerFormConfiguration;
  productID: FormControlConfiguration;
  projectID: FormControlConfiguration;
  changeSpecialist2: UserFormConfiguration;
  implementationPriority: FormControlConfiguration;
  testAndReleaseStrategy: FormControlConfiguration;
  phaseOutSparesTools: FormControlConfiguration;
  phaseOutSparesToolsDet: FormControlConfiguration;
  customerImpact: FormControlConfiguration;
  notes: NoteFormConfiguration;
  documents: DocumentFormConfiguration;
  secure: FormControlConfiguration;
  changeImplPlanURL: FormControlConfiguration;
  CBC: CBCFormConfiguration;
  dependencies: DependenciesFormConfiguration;
  implementationRangeCS: FormControlConfiguration;
  implementationRangeGF: FormControlConfiguration;
  impactAnalysis: ChangeNoticeImpactAnalysisFormConfiguration;
  orderingStrategyNewHW: FormControlConfiguration;
  strategyOldHW: FormControlConfiguration;
  implementationRanges: FormControlConfiguration;
  implementationRangesDet: FormControlConfiguration;
  requirementsForImpPlan: FormControlConfiguration;
  orderingStrategyNewHWDet: FormControlConfiguration;
  strategyOldHWDetails: FormControlConfiguration;
  testAndReleaseStratDet: FormControlConfiguration;
  CBPStrategies: FormControlConfiguration;
  CBPStrategiesDetails: FormControlConfiguration;
  FCOTypes: FormControlConfiguration;
  changeControlBoard: FormControlConfiguration;
  SCIPDocument: FormControlConfiguration;
  CBCDocument: FormControlConfiguration;
  tags?: FormControlConfiguration;
  leadingInfo: FormControlConfiguration;
  targetedVC: FormControlConfiguration;
  contexts: ContextFormConfiguration;
  solutionItems: ImpactedItemFormConfiguration;
  changeOwner: UserFormConfiguration;
  changeOwnerType: FormControlConfiguration;
  scopeItems: FormControlConfiguration;
}

export interface DecisionFormConfiguration {
  ID: FormControlConfiguration;
  type: FormControlConfiguration;
  decision: FormControlConfiguration;
  decidedBy: UserFormConfiguration;
  decidedOn: FormControlConfiguration;
  motivation: FormControlConfiguration;
  communicatedOn: FormControlConfiguration;
}

export interface ActionFormConfiguration {
  ID: FormControlConfiguration;
  generalInformation: GeneralInformationFormConfiguration;
  type: FormControlConfiguration;
  assignee: UserFormConfiguration;
  assigneeGroup: FormControlConfiguration;
  deadline: FormControlConfiguration;
  closedOn: FormControlConfiguration;
  closedBy: UserFormConfiguration;
  notes: NoteFormConfiguration;
  motivation: FormControlConfiguration;
  statusTrackers: StatusTrackerFormConfiguration;
  actionDocument: FormControlConfiguration;
  tags?: FormControlConfiguration;
}

export interface CBCFormConfiguration {
  riskInManHours: FormControlConfiguration;
  risk: FormControlConfiguration;
  HWCommitment: FormControlConfiguration;
  investments: InvestmentsFormConfiguration;
  recurringCosts: RecurringCostsFormConfiguration;
  nonRecurringCosts: NonRecurringCostsFormConfiguration;
  benefits: BenefitsFormConfiguration;
  riskInLaborHours: FormControlConfiguration;
  financialSummary: FinancialSummaryFormConfiguration;
  systemStartsImpacted: FormControlConfiguration;
  systemsWIPFieldImpacted: FormControlConfiguration;
  riskOnEOValue: FormControlConfiguration;
  riskOnEORedProposal: FormControlConfiguration;
  riskOnEORedPropCosts: FormControlConfiguration;
}

export interface StatusTrackerFormConfiguration {
  status: FormControlConfiguration;
  statusChangeCount: FormControlConfiguration;
  actuals: PeriodFormConfiguration;
}

export interface DocumentFormConfiguration {
  name: FormControlConfiguration;
  uploadedBy: UserFormConfiguration;
  uploadedOn: FormControlConfiguration;
  tags: FormControlConfiguration;
  ID: FormControlConfiguration;
  description: FormControlConfiguration;
}

export interface NoteFormConfiguration {
  note: FormControlConfiguration;
  documents: DocumentFormConfiguration;
  type: FormControlConfiguration;
  createdBy: UserFormConfiguration;
  createdOn: FormControlConfiguration;
  tags: FormControlConfiguration;
  ID: FormControlConfiguration;
  status: FormControlConfiguration;
  lastModifiedOn: FormControlConfiguration;
}

export interface ReleasePackageFormConfiguration {
  id: FormControlConfiguration;
  release_package_number: FormControlConfiguration;
  title: FormControlConfiguration;
  status: FormControlConfiguration;
  status_label: FormControlConfiguration;
  is_secure: FormControlConfiguration;
  change_specialist3: UserFormConfiguration;
  executor: UserFormConfiguration;
  creator: UserFormConfiguration;
  plm_coordinator: UserFormConfiguration;
  change_control_boards: FormControlConfiguration;
  created_on: FormControlConfiguration;
  planned_release_date: FormControlConfiguration;
  planned_effective_date: FormControlConfiguration;
  sap_change_control: FormControlConfiguration;
  prerequisites_applicable: FormControlConfiguration;
  prerequisites_detail: FormControlConfiguration;
  types: FormControlConfiguration;
  product_id: FormControlConfiguration;
  project_id: FormControlConfiguration;
  project_lead: FormControlConfiguration;
  my_team: MyTeamFormConfiguration;
  contexts: ContextFormConfiguration;
  er_valid_from_input_strategy: FormControlConfiguration;
  tags: FormControlConfiguration;
  prerequisite_release_packages: ReleasePackagePrerequisiteFormConfiguration;
  change_owner_type: FormControlConfiguration;
  change_owner: UserFormConfiguration;
  revision: FormControlConfiguration;
  revisionStatus: FormControlConfiguration;
  generalInformation: GeneralInformationFormConfiguration;
  type: FormControlConfiguration;
  sourceSystemID: FormControlConfiguration;
  notes: NoteFormConfiguration;
  documents: DocumentFormConfiguration;
  preRequisites: FormControlConfiguration;
  sourceSystemAliasID: FormControlConfiguration;
  statusTrackers: StatusTrackerFormConfiguration;
  changeControlBoard: FormControlConfiguration;
  LIPDocument: FormControlConfiguration;
  dependencies: DependencyFormConfiguration;
  lip_document?: FormControlConfiguration;
}

export interface ReleasePackagePrerequisiteFormConfiguration {
  release_package_id: FormControlConfiguration;
  release_package_number: FormControlConfiguration;
  sequence_number: FormControlConfiguration;
}

export interface DependenciesFormConfiguration {
  functionalHWDependencies: FormControlConfiguration;
  functionalHWDepenDet: FormControlConfiguration;
  functionalSWDependencies: FormControlConfiguration;
  functionalSWDepenDet: FormControlConfiguration;
  HWSWDependenciesAligned: FormControlConfiguration;
  HWSWDepenAlignedDet: FormControlConfiguration;
}

export interface PermissionFormConfiguration {
  group: FormControlConfiguration;
  user: UserFormConfiguration;
  role: FormControlConfiguration;
  level: FormControlConfiguration;
  roles: FormControlConfiguration;
}

export interface NonRecurringCostsFormConfiguration {
  inventoryReplaceExpense: FormControlConfiguration;
  inventoryScrapCosts: FormControlConfiguration;
  supplyChainAdjustments: FormControlConfiguration;
  factoryChangeOrderCosts: FormControlConfiguration;
  fieldChangeOrderCosts: FormControlConfiguration;
  updateUpgradeProductDocs: FormControlConfiguration;
  farmOutDevelopment: FormControlConfiguration;
  prototypeMaterials: FormControlConfiguration;
}

export interface RecurringCostsFormConfiguration {
  material: FormControlConfiguration;
  labor: FormControlConfiguration;
  cycleTime: FormControlConfiguration;
}

export interface BenefitsFormConfiguration {
  revenues: FormControlConfiguration;
  OPEXReductionFieldLabor: FormControlConfiguration;
  OPEXReductionSpareParts: FormControlConfiguration;
  customerUptimeImpr: FormControlConfiguration;
  otherOPEXSavings: FormControlConfiguration;
}

export interface AgendaFormConfiguration {
  ID: FormControlConfiguration;
  generalInformation: GeneralInformationFormConfiguration;
  attendeesPresent: UserFormConfiguration;
  attendeesAbsent: UserFormConfiguration;
  actualStartDate: FormControlConfiguration;
  actualFinishDate: FormControlConfiguration;
  chairPerson: UserFormConfiguration;
  calendarID: FormControlConfiguration;
  category: FormControlConfiguration;
  plannedStartDate: FormControlConfiguration;
  plannedEndDate: FormControlConfiguration;
}

export interface AgendaItemFormConfiguration {
  ID: FormControlConfiguration;
  generalInformation: GeneralInformationFormConfiguration;
  purpose: FormControlConfiguration;
  category: FormControlConfiguration;
  subCategory: FormControlConfiguration;
  plannedDuration: FormControlConfiguration;
  actualDuration: FormControlConfiguration;
  agendaSequenceNumber: FormControlConfiguration;
  presenter: UserFormConfiguration;
  minutes: MinutesFormConfiguration;
  notes: NoteFormConfiguration;
  specialInvitees: UserFormConfiguration;
  preferredDate: FormControlConfiguration;
  presentationDocuments: DocumentFormConfiguration;
  productClusterManager: UserFormConfiguration;
  applicableCBRules: FormControlConfiguration;
  productDevManager: UserFormConfiguration;
  topic: FormControlConfiguration;
  applicableCBRulesCat: FormControlConfiguration;
  section: FormControlConfiguration;
  purposeDetails: FormControlConfiguration;
  attendee: UserFormConfiguration;
  // added by ptummala
  changeBoardRuleSet: FormControlConfiguration;
  // added by ptummala - for CRB+ status changes - Dt. 11th march,2020
  agendaItem: AgendaItemStatusConfiguration;
}

export interface MinutesFormConfiguration {
  date: FormControlConfiguration;
  attendeesPresent: UserFormConfiguration;
  minutes: FormControlConfiguration;
  conclusion: FormControlConfiguration;
}

export interface PeriodFormConfiguration {
  startDate: FormControlConfiguration;
  endDate: FormControlConfiguration;
}

export interface ChangeNoticeImpactAnalysisFormConfiguration {
  upgradePackages: FormControlConfiguration;
  productBaselinesAffected: FormControlConfiguration;
  productionModAffected: FormControlConfiguration;
  totalInstancesAffected: FormControlConfiguration;
  upgradeTime: FormControlConfiguration;
  recoveryTime: FormControlConfiguration;
  prePostConditions: FormControlConfiguration;
  impactOnSequence: FormControlConfiguration;
  impactOnFacilities: FormControlConfiguration;
  impactOnAvailability: FormControlConfiguration;
  impactOnSequenceDet: FormControlConfiguration;
  impactOnFacilitiesDet: FormControlConfiguration;
  impactOnAvailabilityDet: FormControlConfiguration;
  multiplantImpact: FormControlConfiguration;
  mandatoryUpgrade: FormControlConfiguration;
  mandatoryUpgradeDetails: FormControlConfiguration;
  impactOnCycleTime: FormControlConfiguration;
  impactOnCycleTimeDetails: FormControlConfiguration;
  developmentLaborHours: FormControlConfiguration;
  impactOnPreInstall: FormControlConfiguration;
  investigationLaborHours: FormControlConfiguration;
  leadingNonLeading: FormControlConfiguration;
  targetedValidConfig: FormControlConfiguration;
  impactOnLaborHours: FormControlConfiguration;
  impactOnLaborHoursDet: FormControlConfiguration;
}

export interface InvestmentsFormConfiguration {
  factoryInvestments: FormControlConfiguration;
  FSToolingInvestments: FormControlConfiguration;
  SCManagementInvestments: FormControlConfiguration;
  supplierInvestments: FormControlConfiguration;
  DEInvestments: FormControlConfiguration;
}

export interface CustomerImpactAnalysisFormConfiguration {
  assessmentCriterias: AssessmentCriteriaFormConfiguration;
  customerImpact: FormControlConfiguration;
}

export interface AssessmentCriteriaFormConfiguration {
  question: FormControlConfiguration;
  answer: FormControlConfiguration;
  motivation: FormControlConfiguration;
  explanation: FormControlConfiguration;
}

export interface ReviewFormConfiguration {
  id: FormControlConfiguration;
  contexts: ContextFormConfiguration;
  due_date: FormControlConfiguration;
  executor: UserFormConfiguration;
  status: FormControlConfiguration;
  title: FormControlConfiguration;
  created_on: FormControlConfiguration;
  creator: UserFormConfiguration;
  completion_date: FormControlConfiguration;
}

export interface ContextFormConfiguration {
  context_id: FormControlConfiguration;
  name: FormControlConfiguration;
  type: FormControlConfiguration;
  status: FormControlConfiguration;
}

export interface ReviewEntryFormConfiguration {
  id: FormControlConfiguration;
  contexts: ContextFormConfiguration;
  status: FormControlConfiguration;
  description: FormControlConfiguration;
  classification: FormControlConfiguration;
  remark: FormControlConfiguration;
  sequence_number: FormControlConfiguration;
  created_on: FormControlConfiguration;
  creator: UserFormConfiguration;
  assignee: UserFormConfiguration;
}

export interface ReviewerFormConfiguration {
  id: FormControlConfiguration;
  assignee: UserFormConfiguration;
  due_date: FormControlConfiguration;
  status: FormControlConfiguration;
  created_on: FormControlConfiguration;
  creator: UserFormConfiguration;
}

export interface ReviewEntryCommentsFormConfiguration {
  id: FormControlConfiguration;
  status: FormControlConfiguration;
  comment_text: FormControlConfiguration;
  created_on: FormControlConfiguration;
  creator: UserFormConfiguration;
}

export interface ReviewerNotificationFormConfiguration {
  entity_id: FormControlConfiguration;
  category: FormControlConfiguration;
  role: FormControlConfiguration;
  entity: FormControlConfiguration;
  actor: UserFormConfiguration;
  recipient: UserFormConfiguration;
  timestamp: FormControlConfiguration;
  title: FormControlConfiguration;
}

export interface ReviewEntryCommentDocumentResponseFormConfiguration {
  id: FormControlConfiguration;
  name: FormControlConfiguration;
  type: FormControlConfiguration;
  description: FormControlConfiguration;
  tags: FormControlConfiguration;
  status: FormControlConfiguration;
  creator: UserFormConfiguration;
  created_on: FormControlConfiguration;
}

export interface FinancialSummaryFormConfiguration {
  internalRateofReturn: FormControlConfiguration;
  BSNLSavings: FormControlConfiguration;
  paybackPeriod: FormControlConfiguration;
  customerOpexSavings: FormControlConfiguration;
}

export interface PreInstallImpactAnalysisFormConfiguration {
  assessmentCriterias: AssessmentCriteriaFormConfiguration;
  preInstallImpact: FormControlConfiguration;
}


export interface ApprovalFormConfiguration {
  customerApproval: FormControlConfiguration;
  customerApprovalDet: FormControlConfiguration;
}

export interface CommunicationFormConfiguration {
  customerCommunication: FormControlConfiguration;
  customerCommunicationDet: FormControlConfiguration;
}

export interface CustomerPaybackPeriodFormConfiguration {
  uptimeImprovement: FormControlConfiguration;
  FCOImplementation: FormControlConfiguration;
  customerUptimePayback: FormControlConfiguration;
  uptimeImprovAvail: FormControlConfiguration;
  FCOImplAvailability: FormControlConfiguration;
  custUptimePaybackAvail: FormControlConfiguration;
  custUptimePaybckAvailDur: FormControlConfiguration;
}

export interface DependencyFormConfiguration {
  ID: FormControlConfiguration;
  revision: FormControlConfiguration;
  type: FormControlConfiguration;
  sequenceNumber: FormControlConfiguration;
}

export interface ContextFormConfiguration {
  type: FormControlConfiguration;
  contextID: FormControlConfiguration;
  name: FormControlConfiguration;
  status: FormControlConfiguration;
}

export interface ImpactedItemFormConfiguration {
  id: FormControlConfiguration;
  uid: FormControlConfiguration;
  type: FormControlConfiguration;
  category: FormControlConfiguration;
  name: FormControlConfiguration;
  revision: FormControlConfiguration;
  title: FormControlConfiguration;
  change_type: FormControlConfiguration;
  description: FormControlConfiguration;
  creators: UserFormConfiguration;
  users: UserFormConfiguration;
  creator: UserFormConfiguration;
  created_on: FormControlConfiguration;
  is_change_owner: FormControlConfiguration;
  is_modified: FormControlConfiguration;
  sequence: FormControlConfiguration;
  contexts: ContextFormConfiguration;
  status: FormControlConfiguration;
  new_existing_toggle: FormControlConfiguration;
  release_package_number: FormControlConfiguration;
}


export interface FormControlConfiguration {
  ID?: string;
  placeholder?: string;
  help?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  tag?: string;
  validator?: string;
  options?: FormControlEnumeration[];
  validatorConfiguration?: FormControlValidators;
  validators?: FormControlValidators;
}

export interface FormControlEnumeration {
  value: string;
  name?: string; // need to be removed after total migration
  label?: string;
  description?: string;
  sequence?: number | string;
  section?: string;
  tooltip?: string;
}

export interface FormControlValidators {
  minLength?: number;
  maxLength?: number;
  required?: number;
  pattern?: RegExp;
  min_length?: number;
  max_length?: number;
}

// added by ptummala - for CRB+ status changes - Dt. 11th march,2020
export interface AgendaItemStatusConfiguration {
  offlineDecision: FormControlConfiguration;
  onlineDecision: FormControlConfiguration;
  discussion: FormControlConfiguration;
}

export interface UserTypeFormConfiguration {
  abbreviation: FormControlConfiguration;
  department_name: FormControlConfiguration;
  email: FormControlConfiguration;
  full_name: FormControlConfiguration;
  user_id: FormControlConfiguration;
}

export interface ReviewEntryTypeFormConfiguration {
  description: FormControlConfiguration;
  classification: FormControlConfiguration;
}

// added by savs - for ReadOnlyCIA Page (07-Sep-2020)
export interface ReadOnlyCIAConfiguration {
  change_to_customer_impact_critical_part: FormControlConfiguration;
  change_to_process_impacts_customer: FormControlConfiguration;
  change_to_software: FormControlConfiguration;
  ciaApplicabilityCheck: FormControlConfiguration;
  ciaResult: FormControlConfiguration;
  fco_upgrade_option_csr_implementation_change: FormControlConfiguration;
  functional_software_dependencies: FormControlConfiguration;
  ID: FormControlConfiguration;
  impact_on_user_interfaces: FormControlConfiguration;
  impact_on_wafer_process_environment: FormControlConfiguration;
  negative_impact_on_availability: FormControlConfiguration;
  parts_manufactured_before: FormControlConfiguration;
  parts_tooling_in_scope: FormControlConfiguration;
  impact_on_preinstall: FormControlConfiguration;
  system_level_performance_impact: FormControlConfiguration;
  title: FormControlConfiguration;
}
