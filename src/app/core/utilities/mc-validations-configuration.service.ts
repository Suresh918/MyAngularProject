import {Injectable} from '@angular/core';

@Injectable({
  'providedIn': 'root'
})
export class McValidationsConfigurationService {

  constructor() {
  }

  getChangeRequestValidatorsConfiguration() {
    return {
      'id': {},
      'contexts': this.getContextValidatorsConfiguration(),
      'title': {'maxLength': '256'},
      'status': {},
      'is_secure': {},
      'change_specialist1': this.getUserValidatorsConfiguration(),
      'change_specialist2': this.getUserValidatorsConfiguration(),
      'creator': this.getUserValidatorsConfiguration(),
      'created_on': {},
      'change_control_boards': {'maxLength': '50'},
      'change_boards': {'maxLength': '50'},
      'issue_types': {'maxLength': '50'},
      'change_request_type': {'maxLength': '50'},
      'analysis_priority': {},
      'project_id': {'maxLength': '50'},
      'product_id': {'maxLength': '50'},
      'functional_cluster_id': {'maxLength': '50'},
      'reasons_for_change': {'maxLength': '50'},
      'problem_description': {},
      'proposed_solution': {},
      'root_cause': {'maxLength': '1024'},
      'benefits_of_change': {'maxLength': '1024'},
      'implementation_priority': {},
      'requirements_for_implementation_plan': {'maxLength': '2048'},
      'excess_and_obsolescence_savings': {},
      'dependent_change_request_ids': {'maxLength': '50'},
      'change_board_rule_set': this.getRuleSetValidatorsConfiguration(),
      'scope': this.getScopeValidatorsConfiguration(),
      'solution_definition': this.getSolutionDefineValidatorsConfiguration(),
      'impact_analysis': this.getImpactAnalysisValidatorsConfiguration(),
      'complete_business_case': this.getCompleteBusinessCaseValidatorsConfiguration(),
      'my_team': this.getMyTeamValidatorsConfiguration(),
      'change_owner': this.getUserValidatorsConfiguration(),
      'change_owner_type': {'maxLength': '50'},
    };
  }

  getRuleSetValidatorsConfiguration() {
    return {
      'name': {'maxLength': '256'},
      'rules': {'maxLength': '2000'},
    };
  }

  getScopeValidatorsConfiguration() {
    return {
      'id': {},
      'scope_details': {},
      'parts': {'maxLength': '50'},
      'part_detail': this.getPartsValidatorsConfiguration(),
      'tooling': {'maxLength': '50'},
      'tooling_detail': this.getToolingValidatorsConfiguration(),
      'packaging': {'maxLength': '50'},
      'packaging_detail': this.getPackagingValidatorsConfiguration(),
      'bop': {'maxLength': '50'},
    };
  }

  getPartsValidatorsConfiguration() {
    return {
      'machine_bom_part': {'maxLength': '50'},
      'service_part': {'maxLength': '50'},
      'preinstall_part': {'maxLength': '50'},
      'test_rig_part': {'maxLength': '50'},
      'dev_bag_part': {'maxLength': '50'},
      'fco_upgrade_option_csr': {'maxLength': '50'},
    };
  }

  getToolingValidatorsConfiguration() {
    return {
      'supplier_tooling': {'maxLength': '50'},
      'manufacturing_de_tooling': {'maxLength': '50'},
      'service_tooling': {'maxLength': '50'},
    };
  }

  getPackagingValidatorsConfiguration() {
    return {
      'supplier_packaging': {'maxLength': '50'},
      'storage_packaging': {'maxLength': '50'},
      'shipping_packaging': {'maxLength': '50'},
      'reusable_packaging': {'maxLength': '50'},
    };
  }

  getSolutionDefineValidatorsConfiguration() {
    return {
      'id': {},
      'functional_software_dependencies': {'maxLength': '50'},
      'functional_software_dependencies_details': {'maxLength': '1024'},
      'functional_hardware_dependencies': {'maxLength': '50'},
      'functional_hardware_dependencies_details': {'maxLength': '1024'},
      'hardware_software_dependencies_aligned': {'maxLength': '50'},
      'hardware_software_dependencies_aligned_details': {'maxLength': '1024'},
      'test_and_release_strategy': {'maxLength': '50'},
      'test_and_release_strategy_details': {'maxLength': '1024'},
      'products_affected': {'maxLength': '1024'},
      'products_module_affected': {'maxLength': '1024'},
      'aligned_with_fo': {'maxLength': '50'},
      'aligned_with_fo_details': {'maxLength': '1024'},
      'technical_recommendation': {},
    };
  }

  getCustomerImpactValidatorsConfiguration() {
    return {
      'id': {},
      'customer_impact_result': {'maxLength': '50'},
      'customer_approval': {'maxLength': '50'},
      'customer_approval_details': {'maxLength': '1024'},
      'customer_communication': {'maxLength': '50'},
      'customer_communication_details': {'maxLength': '1024'},
      'uptime_improvement': {'maxLength': '50'},
      'fco_implementation': {'maxLength': '50'},
      'uptime_payback': {'maxLength': '50'},
      'uptime_improvement_availability': {'maxLength': '50'},
      'fco_implementation_availability': {'maxLength': '50'},
      'uptime_payback_availability': {'maxLength': '50'},
      'impact_on_user_interfaces': {'maxLength': '50'},
      'impact_on_user_interfaces_details': {'maxLength': '1024'},
      'impact_on_wafer_process_environment': {'maxLength': '50'},
      'impact_on_wafer_process_environment_details': {'maxLength': '1024'},
      'change_to_customer_impact_critical_part': {'maxLength': '50'},
      'change_to_customer_impact_critical_part_details': {'maxLength': '1024'},
      'change_to_process_impacting_customer': {'maxLength': '50'},
      'change_to_process_impacting_customer_details': {'maxLength': '1024'},
      'fco_upgrade_option_csr_implementation_change': {'maxLength': '50'},
      'fco_upgrade_option_csr_implementation_change_details': {'maxLength': '1024'},
    };
  }

  getImpactAnalysisValidatorsConfiguration() {
    return {
      'id': {},
      'customer_impact': this.getCustomerImpactValidatorsConfiguration(),
      'preinstall_impact': this.getPreInstallImpactValidatorsConfiguration(),
      'upgrade_packages': {'maxLength': '1024'},
      'upgrade_time': {},
      'recovery_time': {},
      'pre_post_conditions': {'maxLength': '1024'},
      'impact_on_sequence': {'maxLength': '50'},
      'impact_on_sequence_details': {'maxLength': '1024'},
      'impact_on_availability': {'maxLength': '50'},
      'impact_on_availability_details': {'maxLength': '1024'},
      'multi_plant_impact': {'maxLength': '50'},
      'phase_out_spares_tools': {'maxLength': '50'},
      'phase_out_spares_tools_details': {'maxLength': '1024'},
      'tech_risk_assessment_sra': {'maxLength': '50'},
      'tech_risk_assessment_sra_details': {},
      'tech_risk_assessment_fmea': {'maxLength': '50'},
      'tech_risk_assessment_fmea_details': {},
      'total_instances_affected': {'maxLength': '400'},
      'impact_on_system_level_performance': {'maxLength': '50'},
      'impact_on_system_level_performance_details': {'maxLength': '1024'},
      'impact_on_cycle_time': {'maxLength': '50'},
      'impact_on_cycle_time_details': {'maxLength': '50'},
      'impact_on_labor_hours' : {'maxLength': '50'},
      'impact_on_labor_hours_details' : {'maxLength': '1024'},
      'impact_on_existing_parts': {'maxLength': '50'},
      'liability_risks': {'maxLength': '50'},
      'implementation_ranges': {'maxLength': '50'},
      'implementation_ranges_details': {'maxLength': '1024'},
      'cbp_strategies': {'maxLength': '50'},
      'cbp_strategies_details': {'maxLength': '1024'},
      'development_labor_hours': {},
      'investigation_labor_hours': {},
      'fco_types': {'maxLength': '50'},
      'calendar_dependency': {'maxLength': '256'},
      'targeted_valid_configurations': {'maxLength': '256'},
    };
  }

  getPreInstallImpactValidatorsConfiguration() {
    return {
      'id': {},
      'preinstall_impact_result': {'maxLength': '50'},
      'change_introduces_new11_nc': {'maxLength': '50'},
      'change_introduces_new11_nc_details': {'maxLength': '50'},
      'impact_on_customer_factory_layout': {'maxLength': '50'},
      'impact_on_customer_factory_layout_details': {'maxLength': '50'},
      'impact_on_facility_flows': {'maxLength': '50'},
      'impact_on_facility_flows_details': {'maxLength': '50'},
      'impact_on_preinstall_inter_connect_cables': {'maxLength': '50'},
      'impact_on_preinstall_inter_connect_cables_details': {'maxLength': '50'},
      'change_replaces_mentioned_parts': {'maxLength': '50'},
      'change_replaces_mentioned_parts_details': {'maxLength': '50'},
    };
  }

  getCompleteBusinessCaseValidatorsConfiguration() {
    return {
      'id': {},
      'risk': {},
      'risk_in_labor_hours': {},
      'hardware_commitment': {},
      'system_starts_impacted': {},
      'systems_in_wip_and_field_impacted': {},
      'factory_investments': {},
      'fs_tooling_investments': {},
      'supply_chain_management_investments': {},
      'supplier_investments': {},
      'material_recurring_costs': {},
      'labor_recurring_costs': {},
      'cycle_time_recurring_costs': {},
      'inventory_replace_nonrecurring_costs': {},
      'inventory_scrap_nonrecurring_costs': {},
      'supply_chain_adjustments_nonrecurring_costs': {},
      'factory_change_order_nonrecurring_costs': {},
      'field_change_order_nonrecurring_costs': {},
      'update_upgrade_product_documentation_nonrecurring_costs': {},
      'farm_out_development_nonrecurring_costs': {},
      'prototype_materials_nonrecurring_costs': {},
      'revenues_benefits': {},
      'opex_reduction_field_labor_benefits': {},
      'opex_reduction_spare_parts_benefits': {},
      'customer_uptime_improvement_benefits': {},
      'other_opexsavings_benefits': {},
      'internal_rate_of_return': {},
      'bsnl_savings': {},
      'payback_period': {},
      'customer_opex_savings': {},
      'risk_on_excess_and_obsolescence': {},
      'risk_on_excess_and_obsolescence_reduction_proposal': {},
      'risk_on_excess_and_obsolescence_reduction_proposal_costs': {},
    };
  }

  getMemberValidatorsConfiguration() {
    return {
      'id': {},
      'status': {'maxLength': '50'},
      'user': this.getUserValidatorsConfiguration(),
      'roles': {'maxLength': '256'},
    };
  }

  getMyTeamValidatorsConfiguration() {
    return {
      'id': {},
      'members': this.getMemberValidatorsConfiguration(),
    };
  }

  getUserValidatorsConfiguration() {
    return {
      'userID': {'maxLength': '50'},
      'fullName': {'maxLength': '128'},
      'email': {'maxLength': '128'},
      'abbreviation': {'maxLength': '50'},
      'departmentName': {'maxLength': '50'},
    };
  }

  getGeneralInformationValidatorsConfiguration() {
    return {
      'title': {'maxLength': '256'},
      'state': {'maxLength': '50'},
      'status': {'maxLength': '50'},
      'createdBy': this.getUserValidatorsConfiguration(),
      'createdOn': {},
      'lastModifiedOn': {},
      'submittedOn': {},
      'permissions': this.getPermissionValidatorsConfiguration(),
    };
  }

  getChangeRequestImpactAnalysisValidatorsConfiguration() {
    return {
      'upgradePackages': {'maxLength': '1024'},
      'productBaselinesAffected': {'maxLength': '1024'},
      'productionModAffected': {'maxLength': '1024'},
      'upgradeTime': {},
      'recoveryTime': {},
      'prePostConditions': {'maxLength': '1024'},
      'impactOnSequence': {'maxLength': '50'},
      'impactOnFacilities': {'maxLength': '50'},
      'impactOnAvailability': {'maxLength': '50'},
      'multiplantImpact': {'maxLength': '50'},
      'accordingPBSAIRStrategy': {'maxLength': '50'},
      'phaseOutSparesTools': {'maxLength': '50'},
      'CBC': this.getCBCValidatorsConfiguration(),
      'impactOnSequenceDet': {'maxLength': '1024'},
      'impactOnFacilitiesDet': {'maxLength': '1024'},
      'impactOnAvailabilityDet': {'maxLength': '1024'},
      'accordingPBSAIRStratDet': {'maxLength': '1024'},
      'phaseOutSparesToolsDet': {'maxLength': '1024'},
      'techRiskAssessSRA': {'maxLength': '50'},
      'techRiskAssessFMEA': {'maxLength': '50'},
      'techRiskAssessSRADet': {'maxLength': '1024'},
      'techRiskAssessFMEADet': {'maxLength': '1024'},
      'totalInstancesAffected': {'maxLength': '400'},
      'customerImpactAnalysis': this.getCustomerImpactAnalysisValidatorsConfiguration(),
      'sysLevelPerformImpact': {'maxLength': '50'},
      'sysLevelPerformImpactDet': {'maxLength': '1024'},
      'mandatoryUpgrade': {'maxLength': '50'},
      'mandatoryUpgradeDetails': {'maxLength': '1024'},
      'impactOnCycleTime': {'maxLength': '50'},
      'impactOnCycleTimeDetails': {'maxLength': '1024'},
      'developmentLaborHours': {},
      'preInstallImpactAnalysis': this.getPreInstallImpactAnalysisValidatorsConfiguration(),
      'impactOnFIR': {'maxLength': '50'},
      'liabilityRisk': {'maxLength': '50'},
      'investigationLaborHours': {},
      'impactOnExistingParts': {'maxLength': '50'},
      'impactOnUserInterfaces': {'maxLength': '50'},
      'impactOnUserInterfDtls': {'maxLength': '1024'},
      'impactOnWaferProcessEnv': {'maxLength': '50'},
      'impactOnWaferProcEnvDtls': {'maxLength': '1024'},
      'changeToCustImpCrtclPart': {'maxLength': '50'},
      'chngCustImpCrtclPartDtls': {'maxLength': '1024'},
      'changeToProcImpactCust': {'maxLength': '50'},
      'changeProcImpactCustDtls': {'maxLength': '1024'},
      'FCOUpgOptCSRImplChange': {'maxLength': '50'},
      'FCOUpgOptCSRImplChngDtls': {'maxLength': '1024'},
      'leadingNonLeading': {'maxLength': '256'},
      'targetedValidConfig': {'maxLength': '256'},
    };
  }

  getChangeNoticeValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'revision': {'maxLength': '50'},
      'revisionStatus': {'maxLength': '50'},
      'generalInformation': this.getGeneralInformationValidatorsConfiguration(),
      'statusTrackers': this.getStatusTrackerValidatorsConfiguration(),
      'productID': {'maxLength': '50'},
      'projectID': {'maxLength': '50'},
      'changeSpecialist2': this.getUserValidatorsConfiguration(),
      'implementationPriority': {},
      'testAndReleaseStrategy': {'maxLength': '50'},
      'phaseOutSparesTools': {'maxLength': '50'},
      'phaseOutSparesToolsDet': {'maxLength': '1024'},
      'customerImpact': {'maxLength': '50'},
      'notes': this.getNoteValidatorsConfiguration(),
      'documents': this.getDocumentValidatorsConfiguration(),
      'secure': {},
      'changeImplPlanURL': {},
      'CBC': this.getCBCValidatorsConfiguration(),
      'dependencies': this.getDependenciesValidatorsConfiguration(),
      'implementationRangeCS': {'maxLength': '50'},
      'implementationRangeGF': {'maxLength': '50'},
      'impactAnalysis': this.getChangeNoticeImpactAnalysisValidatorsConfiguration(),
      'orderingStrategyNewHW': {'maxLength': '50'},
      'strategyOldHW': {'maxLength': '50'},
      'implementationRanges': {'maxLength': '50'},
      'implementationRangesDet': {'maxLength': '1024'},
      'requirementsForImpPlan': {'maxLength': '2048'},
      'orderingStrategyNewHWDet': {'maxLength': '1024'},
      'strategyOldHWDetails': {'maxLength': '400'},
      'testAndReleaseStratDet': {'maxLength': '1024'},
      'CBPStrategies': {'maxLength': '50'},
      'CBPStrategiesDetails': {'maxLength': '1000'},
      'FCOTypes': {'maxLength': '50'},
      'tags': {'maxLength': '50'},
      'leadingInfo': {'maxLength': '256'},
      'targetedVC': {'maxLength': '256'},
      'contexts' : this.getContextValidatorsConfiguration(),
      'solutionItems' : this.getImpactedItemValidatorsConfiguration(),
      'changeOwner' : this.getUserValidatorsConfiguration(),
      'changeOwnerType' : {'maxLength':'256'},
    };
  }

  getDecisionValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'type': {'maxLength': '50'},
      'decision': {'maxLength': '50'},
      'decidedBy': this.getUserValidatorsConfiguration(),
      'decidedOn': {},
      'motivation': {'maxLength': '1024'},
      'communicatedOn': {},
    };
  }

  getActionValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'generalInformation': this.getGeneralInformationValidatorsConfiguration(),
      'type': {'maxLength': '50'},
      'assignee': this.getUserValidatorsConfiguration(),
      'assigneeGroup': {'maxLength': '50'},
      'deadline': {},
      'closedOn': {},
      'closedBy': this.getUserValidatorsConfiguration(),
      'notes': this.getNoteValidatorsConfiguration(),
      'motivation': {'maxLength': '1024'},
      'statusTrackers': this.getStatusTrackerValidatorsConfiguration(),
      'documents': this.getDocumentValidatorsConfiguration(),
    };
  }

  getCBCValidatorsConfiguration() {
    return {
      'riskInManHours': {},
      'risk': {},
      'HWCommitment': {},
      'investments': this.getInvestmentsValidatorsConfiguration(),
      'recurringCosts': this.getRecurringCostsValidatorsConfiguration(),
      'nonRecurringCosts': this.getNonRecurringCostsValidatorsConfiguration(),
      'benefits': this.getBenefitsValidatorsConfiguration(),
      'riskInLaborHours': {},
      'financialSummary': this.getFinancialSummaryValidatorsConfiguration(),
      'systemStartsImpacted': {},
      'systemsWIPFieldImpacted': {},
      'riskOnEOValue': {},
      'riskOnEORedProposal': {},
      'riskOnEORedPropCosts': {},
    };
  }

  getStatusTrackerValidatorsConfiguration() {
    return {
      'status': {'maxLength': '50'},
      'statusChangeCount': {},
      'actuals': this.getPeriodValidatorsConfiguration(),
    };
  }

  getDocumentValidatorsConfiguration() {
    return {
      'name': {'maxLength': '256'},
      'uploadedBy': this.getUserValidatorsConfiguration(),
      'uploadedOn': {},
      'tags': {'maxLength': '50'},
      'ID': {'maxLength': '50'},
      'description': {'maxLength': '256'},
    };
  }

  getNoteValidatorsConfiguration() {
    return {
      'note': {},
      'documents': this.getDocumentValidatorsConfiguration(),
      'type': {'maxLength': '50'},
      'createdBy': this.getUserValidatorsConfiguration(),
      'createdOn': {},
      'tags': {'maxLength': '50'},
      'ID': {'maxLength': '50'},
      'status': {'maxLength': '50'},
      'lastModifiedOn': {},
    };
  }

  getReleasePackageValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'release_package_number': {'maxLength': '50'},
      'title': {'maxLength': '256'},
      'status': {},
      'is_secure': {},
      'change_specialist3': this.getUserValidatorsConfiguration(),
      'executor': this.getUserValidatorsConfiguration(),
      'creator': this.getUserValidatorsConfiguration(),
      'plm_coordinator': this.getUserValidatorsConfiguration(),
      'change_control_boards': {'maxLength': '50'},
      'created_on': {},
      'planned_release_date': {},
      'planned_effective_date': {},
      'sap_change_control': {},
      'prerequisites_applicable': {'maxLength': '50'},
      'prerequisites_detail': {'maxLength': '1024'},
      'types': {'maxLength': '256'},
      'product_id': {'maxLength': '50'},
      'project_id': {'maxLength': '50'},
      'my_team': this.getMyTeamValidatorsConfiguration(),
      'contexts': this.getContextValidatorsConfiguration(),
      'er_valid_from_input_strategy': {'maxLength': '50'},
      'tags': {'maxLength': '50'},
      'prerequisite_release_packages': this.getReleasePacakgePrerequisiteValidatorsConfiguration(),
      'change_owner_type': {'maxLength': '256'},
      'change_owner': this.getUserValidatorsConfiguration(),
      'preRequisites': {'maxLength': '1024'},
      'sourceSystemAliasID': {'maxLength': '50'},
      'statusTrackers': this.getStatusTrackerValidatorsConfiguration(),
      'dependencies': this.getDependencyValidatorsConfiguration(),
      'revision': {'maxLength': '50'},
      'revisionStatus': {'maxLength': '50'},
      'type': {'maxLength': '50'},
      'sourceSystemID': {'maxLength': '50'},
      'notes': this.getNoteValidatorsConfiguration(),
      'documents': this.getDocumentValidatorsConfiguration(),
    };
  }

  getReleasePacakgePrerequisiteValidatorsConfiguration() {
    return {
      'release_package_id': {},
      'release_package_number': {'maxLength': '50'},
      'sequence_number': {},
    };
  }

  getDependenciesValidatorsConfiguration() {
    return {
      'functionalHWDependencies': {'maxLength': '50'},
      'functionalHWDepenDet': {'maxLength': '1024'},
      'functionalSWDependencies': {'maxLength': '50'},
      'functionalSWDepenDet': {'maxLength': '1024'},
      'HWSWDependenciesAligned': {'maxLength': '50'},
      'HWSWDepenAlignedDet': {'maxLength': '1024'},
    };
  }

  getPermissionValidatorsConfiguration() {
    return {
      'group': {'maxLength': '50'},
      'user': this.getUserValidatorsConfiguration(),
      'role': {'maxLength': '50'},
      'level': {'maxLength': '50'},
      'roles': {'maxLength': '50'},
    };
  }

  getNonRecurringCostsValidatorsConfiguration() {
    return {
      'inventoryReplaceExpense': {},
      'inventoryScrapCosts': {},
      'supplyChainAdjustments': {},
      'factoryChangeOrderCosts': {},
      'fieldChangeOrderCosts': {},
      'updateUpgradeProductDocs': {},
      'farmOutDevelopment': {},
      'prototypeMaterials': {},
    };
  }

  getRecurringCostsValidatorsConfiguration() {
    return {
      'material': {},
      'labor': {},
      'cycleTime': {},
    };
  }

  getBenefitsValidatorsConfiguration() {
    return {
      'revenues': {},
      'OPEXReductionFieldLabor': {},
      'OPEXReductionSpareParts': {},
      'customerUptimeImpr': {},
      'otherOPEXSavings': {},
    };
  }

  getAgendaValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'generalInformation': this.getGeneralInformationValidatorsConfiguration(),
      'attendeesPresent': this.getUserValidatorsConfiguration(),
      'attendeesAbsent': this.getUserValidatorsConfiguration(),
      'actualStartDate': {},
      'actualFinishDate': {},
      'chairPerson': this.getUserValidatorsConfiguration(),
      'calendarID': {'maxLength': '256'},
      'category': {'maxLength': '50'},
      'plannedStartDate': {},
      'plannedEndDate': {},
    };
  }

  getAgendaItemValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'generalInformation': this.getGeneralInformationValidatorsConfiguration(),
      'purpose': {'maxLength': '50'},
      'category': {'maxLength': '50'},
      'subCategory': {'maxLength': '50'},
      'plannedDuration': {},
      'actualDuration': {},
      'agendaSequenceNumber': {},
      'presenter': this.getUserValidatorsConfiguration(),
      'minutes': this.getMinutesValidatorsConfiguration(),
      'notes': this.getNoteValidatorsConfiguration(),
      'specialInvitees': this.getUserValidatorsConfiguration(),
      'preferredDate': {},
      'presentationDocuments': this.getDocumentValidatorsConfiguration(),
      'productClusterManager': this.getUserValidatorsConfiguration(),
      'applicableCBRules': {'maxLength': '1024'},
      'productDevManager': this.getUserValidatorsConfiguration(),
      'topic': {'maxLength': '50'},
      'applicableCBRulesCat': {'maxLength': '50'},
      'section': {'maxLength': '256'},
      'purposeDetails': {'maxLength': '256'},
    };
  }

  getMinutesValidatorsConfiguration() {
    return {
      'date': {},
      'attendeesPresent': this.getUserValidatorsConfiguration(),
      'minutes': {},
      'conclusion': {'maxLength': '1024'},
    };
  }

  getPeriodValidatorsConfiguration() {
    return {
      'startDate': {},
      'endDate': {},
    };
  }

  getChangeNoticeImpactAnalysisValidatorsConfiguration() {
    return {
      'upgradePackages': {'maxLength': '1024'},
      'productBaselinesAffected': {'maxLength': '1024'},
      'productionModAffected': {'maxLength': '1024'},
      'totalInstancesAffected': {'maxLength': '400'},
      'upgradeTime': {},
      'recoveryTime': {},
      'prePostConditions': {'maxLength': '1024'},
      'impactOnSequence': {'maxLength': '50'},
      'impactOnFacilities': {'maxLength': '50'},
      'impactOnAvailability': {'maxLength': '50'},
      'impactOnSequenceDet': {'maxLength': '1024'},
      'impactOnFacilitiesDet': {'maxLength': '1024'},
      'impactOnAvailabilityDet': {'maxLength': '1024'},
      'multiplantImpact': {'maxLength': '50'},
      'mandatoryUpgrade': {'maxLength': '50'},
      'mandatoryUpgradeDetails': {'maxLength': '1024'},
      'impactOnCycleTime': {'maxLength': '50'},
      'impactOnCycleTimeDetails': {'maxLength': '1024'},
      'developmentLaborHours': {},
      'impactOnPreInstall': {'maxLength': '50'},
      'investigationLaborHours': {},
      'leadingNonLeading': {'maxLength': '256'},
      'targetedValidConfig': {'maxLength': '256'},
      'impactOnLaborHours' : {'maxLength': '50'},
      'impactOnLaborHoursDet' : {'maxLength': '1024'},
    };
  }

  getInvestmentsValidatorsConfiguration() {
    return {
      'factoryInvestments': {},
      'FSToolingInvestments': {},
      'SCManagementInvestments': {},
      'supplierInvestments': {},
      'DEInvestments': {},
    };
  }

  getCustomerImpactAnalysisValidatorsConfiguration() {
    return {
      'assessmentCriterias': this.getAssessmentCriteriaValidatorsConfiguration(),
      'customerImpact': {'maxLength': '50'},
    };
  }

  getAssessmentCriteriaValidatorsConfiguration() {
    return {
      'question': {'maxLength': '1024'},
      'answer': {'maxLength': '50'},
      'motivation': {'maxLength': '1024'},
      'explanation': {'maxLength': '1024'},
    };
  }

  getReviewValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'contexts': this.getContextValidatorsConfiguration(),
      'due_date': {},
      'executor': this.getUserValidatorsConfiguration(),
      'status': {},
      'title': {'maxLength': '255'},
      'created_on': {},
      'creator': this.getUserValidatorsConfiguration(),
      'completion_date': {},
    };
  }

  getContextValidatorsConfiguration() {
    return {
      'context_id': {'maxLength': '255'},
      'name': {'maxLength': '255'},
      'type': {'maxLength': '255'},
      'status': {},
    };
  }

  getReviewEntryValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'contexts': this.getContextValidatorsConfiguration(),
      'status': {},
      'description': {'maxLength': '255'},
      'classification': {'maxLength': '255'},
      'remark': {'maxLength': '255'},
      'sequence_number': {},
      'created_on': {},
      'creator': this.getUserValidatorsConfiguration(),
      'assignee': this.getUserValidatorsConfiguration(),
    };
  }

  getReviewerValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'assignee': this.getUserValidatorsConfiguration(),
      'due_date': {},
      'status': {},
      'created_on': {},
      'creator': this.getUserValidatorsConfiguration(),
    };
  }

  getReviewEntryCommentsValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'status': {},
      'comment_text': {'maxLength': '255'},
      'created_on': {},
      'creator': this.getUserValidatorsConfiguration(),
    };
  }

  getReviewerNotificationValidatorsConfiguration() {
    return {
      'entity_id': {'maxLength': '255'},
      'category': {'maxLength': '255'},
      'role': {'maxLength': '255'},
      'entity': {'maxLength': '255'},
      'actor': this.getUserValidatorsConfiguration(),
      'recipient': this.getUserValidatorsConfiguration(),
      'timestamp': {'maxLength': '255'},
      'title': {'maxLength': '255'},
    };
  }

  getReviewEntryCommentDocumentResponseValidatorsConfiguration() {
    return {
      'id': {'maxLength': '50'},
      'name': {'maxLength': '255'},
      'type': {'maxLength': '255'},
      'description': {'maxLength': '255'},
      'tags': {'maxLength': '255'},
      'status': {},
      'creator': this.getUserValidatorsConfiguration(),
      'created_on': {},
    };
  }

  getReviewItemValidatorsConfiguration() {
    return {
      'sourceSystemID': {'maxLength': '50'},
      'name': {'maxLength': '256'},
    };
  }

  getFinancialSummaryValidatorsConfiguration() {
    return {
      'internalRateofReturn': {},
      'BSNLSavings': {},
      'paybackPeriod': {},
      'customerOpexSavings': {},
    };
  }

  getPreInstallImpactAnalysisValidatorsConfiguration() {
    return {
      'assessmentCriterias': this.getAssessmentCriteriaValidatorsConfiguration(),
      'preInstallImpact': {'maxLength': '50'},
    };
  }

  getApprovalValidatorsConfiguration() {
    return {
      'customerApproval': {'maxLength': '50'},
      'customerApprovalDet': {'maxLength': '1024'},
    };
  }

  getCommunicationValidatorsConfiguration() {
    return {
      'customerCommunication': {'maxLength': '50'},
      'customerCommunicationDet': {'maxLength': '1024'},
    };
  }

  getCustomerPaybackPeriodValidatorsConfiguration() {
    return {
      'uptimeImprovement': {},
      'FCOImplementation': {},
      'customerUptimePayback': {},
      'uptimeImprovAvail': {},
      'FCOImplAvailability': {},
      'custUptimePaybackAvail': {},
      'custUptimePaybckAvailDur': {}
    };
  }

  getDependencyValidatorsConfiguration() {
    return {
      'ID': {'maxLength': '50'},
      'revision': {'maxLength': '50'},
      'type': {'maxLength': '50'},
      'sequenceNumber': {},
    };
  }

  getUserTypeValidatorsConfiguration() {
    return {
      'abbreviation': {},
      'department_name': {},
      'email': {},
      'full_name': {},
      'user_id': {},
    };
  }

  getReviewEntryTypeValidatorsConfiguration() {
    return {
      'description': {},
      'classification': {},
    };
  }

  getImpactedItemValidatorsConfiguration() {
    return {
      'id': {'maxLength':'256'},
      'uid': {'maxLength': '255'},
      'type': {'maxLength': '255'},
      'category': {'maxLength': '255'},
      'name': {'maxLength': '255'},
      'revision': {'maxLength': '255'},
      'title': {'maxLength': '256'},
      'change_type': {'maxLength': '255'},
      'description': {'maxLength': '1024'},
      'creators': this.getUserValidatorsConfiguration(),
      'users': this.getUserValidatorsConfiguration(),
      'creator': this.getUserValidatorsConfiguration(),
      'created_on': {},
      'is_change_owner': {},
      'is_modified': {},
      'sequence': {},
      'contexts': this.getContextValidatorsConfiguration(),
      'status': {},
      'release_package_number': {'maxLength': '256'}
    };
  }
}
