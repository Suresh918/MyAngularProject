import {Injectable} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {McValidationsConfigurationService} from './mc-validations-configuration.service';
import {HelpersService} from './helpers.service';
import {FormControlValidators} from '../../shared/models/mc-configuration.model';
import {Decision, GeneralInformation, Note, User, MiraiUser} from '../../shared/models/mc.model';
import {Link} from '../../shared/models/mc-presentation.model';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Injectable({
  'providedIn': 'root'
})
export class MCFormGroupService {
  private questionsList;

  constructor(private readonly formBuilder: FormBuilder, private readonly mcValidationsConfigurationService: McValidationsConfigurationService,
              private readonly helpersService: HelpersService) {
    this.questionsList = [];
  }

  initializeAssessmentCriteriasWithQuestions(data, arrayIndex) {
    data.assessmentCriterias = data.assessmentCriterias || [];
    let criteria;
    if (data.assessmentCriterias) {
      if (data.assessmentCriterias.length) {
        for (const question of this.questionsList[arrayIndex]) {
          criteria = data.assessmentCriterias.find(criteriaQn => criteriaQn.question === question.question);
          if (criteria) {
            criteria.tooltip = question.tooltip;
            criteria.explanation = question.tooltip;
          }
        }
      } else {
        if (this.questionsList.length > 0) {
          for (const question of this.questionsList[arrayIndex]) {
            data.assessmentCriterias.push({
              tooltip: question && question.tooltip,
              question: question && question.question,
              answer: '',
              motivation: '',
              explanation: question && question.tooltip
            });
          }
        }
      }
    }
  }

  customRequiredValidatorForGroups(groupTag: String): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = false;
      if (control.value) {
        control.value.forEach(permission => {
          if (permission && permission.role && permission.role === groupTag) {
            isValid = true;
          }
        });
      }
      return !isValid ? (groupTag === 'CCB' ? {'ccb_required': true} : {'cb_required': true}) : null;
    };
  }

  setCaseObjectValidators(caseObjectFormGroup: FormGroup, caseObjectValidatorsConfiguration, mandatoryFields: string[], caseObject?: string) {
    const groupsValidatorFnArray = [];
    caseObjectValidatorsConfiguration = this.helpersService.convertComplexObjToDotNotation(Object.assign(caseObjectValidatorsConfiguration));
    const convertedCaseObject = this.helpersService.convertComplexObjToDotNotation(Object.assign(caseObjectValidatorsConfiguration));
    if (caseObject && (caseObject === 'Review' || caseObject === 'ReviewEntry' || caseObject === 'ChangeRequest' || caseObject === 'ReleasePackage' || caseObject === 'ImpactedItem')) {
      Object.keys(convertedCaseObject).forEach((key) => {
        if (caseObjectFormGroup.get(key)) {
          mandatoryFields.forEach((mandatoryField) => {
            if (this.getMatchingPath(key, new RegExp(mandatoryField))) {
              const caseObjectValidatorsFnArray = this.getFormControlValidatorFnArray(caseObjectValidatorsConfiguration[key]);
              if (caseObjectValidatorsFnArray.indexOf(Validators.required) === -1) {
                caseObjectValidatorsFnArray.push(Validators.required);
                caseObjectFormGroup.get(key).setValidators(caseObjectValidatorsFnArray);
                caseObjectFormGroup.get(key).updateValueAndValidity();
              }
            }
          });
        }
      });
    } else {
      mandatoryFields.forEach((res) => {
        if (caseObjectFormGroup.get(res)) {
          const caseObjectValidatorsFnArray = this.getFormControlValidatorFnArray(caseObjectValidatorsConfiguration[res]);
          if (caseObjectValidatorsFnArray.indexOf(Validators.required) === -1) {
            caseObjectValidatorsFnArray.push(Validators.required);
            caseObjectFormGroup.get(res).setValidators(caseObjectValidatorsFnArray);
            caseObjectFormGroup.get(res).updateValueAndValidity();
          }
        }
        if (res === 'generalInformation.ccb') {
          groupsValidatorFnArray.push(this.customRequiredValidatorForGroups('CCB'));
        }
        if (res === 'generalInformation.cb') {
          groupsValidatorFnArray.push(this.customRequiredValidatorForGroups('CB'));
        }
      });
    }
    if (groupsValidatorFnArray.length > 0) {
      caseObjectFormGroup.get('generalInformation.permissions').setValidators(groupsValidatorFnArray);
    }
  }

  getMatchingPath(key, regExp): string {
    const keyList = key.split('.');
    let matchingPath = null;
    keyList.forEach((keyValue, index) => {
      if (keyValue.match(regExp)) {
        keyList.splice(index + 1);
        matchingPath = keyList.join('.');
      }
    });
    return matchingPath;
  }

  setCaseObjectReadOnlyFields(caseObjectFormGroup, readOnlyFields?: string[]) {
    if (readOnlyFields) {
      readOnlyFields.forEach((res) => {
        if (caseObjectFormGroup.get(res)) {
          caseObjectFormGroup.get(res).disable();
        }
      });
    }
  }

  getFormControlValidatorFnArray(formControlValidators: FormControlValidators): Array<any> {
    const formControlValidatorFnArray = [];
    if (formControlValidators) {
      if (formControlValidators.min_length) {
        formControlValidatorFnArray.push(Validators.maxLength(formControlValidators.min_length));
      }
      if (formControlValidators.max_length) {
        formControlValidatorFnArray.push(Validators.maxLength(formControlValidators.max_length));
      }
      if (formControlValidators.required) {
        formControlValidatorFnArray.push(Validators.required);
      }
      if (formControlValidators.pattern) {
        formControlValidatorFnArray.push(Validators.pattern(formControlValidators.pattern));
      }
    }
    return formControlValidatorFnArray;
  }

  createChangeRequestFormGroup(data, mandatoryFieldsConfiguration, readOnlyFields?: string[]) {
    data = data || {};
    mandatoryFieldsConfiguration = mandatoryFieldsConfiguration || [];
    const changeRequestFormGroup = this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createContextFormGroup(res)) : []),
      title: [data.title === undefined ? null : data.title, Validators.compose([Validators.maxLength(256)])],
      status: [isNaN(data.status) ? null : data.status, Validators.compose([])],
      status_label: [data.status_label ? data.status_label : '', Validators.compose([])],
      is_secure: [coerceBooleanProperty(data.is_secure), Validators.compose([])],
      change_specialist1: this.createUserFormControl(data.change_specialist1 === undefined ? null : data.change_specialist1),
      change_specialist2: this.createUserFormControl(data.change_specialist2 === undefined ? null : data.change_specialist2),
      creator: this.createUserFormControl(data.creator === undefined ? null : data.creator),
      created_on: [data.created_on === undefined ? null : data.created_on, Validators.compose([])],
      change_control_boards: [(data.change_control_boards === undefined || data.change_control_boards === null) ? [] : data.change_control_boards, Validators.compose([Validators.maxLength(50)])],
      change_boards: [(data.change_boards === undefined || data.change_boards === null) ? [] : data.change_boards, Validators.compose([Validators.maxLength(50)])],
      issue_types: [(data.issue_types === undefined || data.issue_types === null) ? [] : data.issue_types, Validators.compose([Validators.maxLength(50)])],
      change_request_type: [data.change_request_type === undefined ? null : data.change_request_type, Validators.compose([Validators.maxLength(50)])],
      analysis_priority: [isNaN(data.analysis_priority) ? null : data.analysis_priority, Validators.compose([])],
      project_id: [data.project_id === undefined ? null : data.project_id, Validators.compose([Validators.maxLength(50)])],
      product_id: [data.product_id === undefined ? null : data.product_id, Validators.compose([Validators.maxLength(50)])],
      project_lead: [data.project_lead === undefined ? null : data.project_lead, Validators.compose([Validators.maxLength(50)])],
      functional_cluster_id: [data.functional_cluster_id === undefined ? null : data.functional_cluster_id, Validators.compose([Validators.maxLength(50)])],
      reasons_for_change: [(data.reasons_for_change === undefined || data.reasons_for_change === null) ? [] : data.reasons_for_change, Validators.compose([Validators.maxLength(50)])],
      problem_description: [data.problem_description === undefined ? null : data.problem_description, Validators.compose([])],
      proposed_solution: [data.proposed_solution === undefined ? null : data.proposed_solution, Validators.compose([])],
      root_cause: [data.root_cause === undefined ? null : data.root_cause, Validators.compose([Validators.maxLength(1024)])],
      benefits_of_change: [data.benefits_of_change === undefined ? null : data.benefits_of_change, Validators.compose([Validators.maxLength(1024)])],
      implementation_priority: [isNaN(data.implementation_priority) ? null : data.implementation_priority, Validators.compose([])],
      requirements_for_implementation_plan: [data.requirements_for_implementation_plan === undefined ? null : data.requirements_for_implementation_plan, Validators.compose([Validators.maxLength(2048)])],
      excess_and_obsolescence_savings: [isNaN(data.excess_and_obsolescence_savings) ? null : data.excess_and_obsolescence_savings, Validators.compose([])],
      dependent_change_request_ids: [(data.dependent_change_request_ids === undefined || data.dependent_change_request_ids === null) ? [] : data.dependent_change_request_ids, Validators.compose([Validators.maxLength(50)])],
      change_board_rule_set: this.createRuleSetFormGroup(data.change_board_rule_set),
      scope: this.createScopeFormGroup(data.scope),
      solution_definition: this.createSolutionDefineFormGroup(data.solution_definition),
      impact_analysis: this.createImpactAnalysisFormGroup(data.impact_analysis),
      complete_business_case: this.createCompleteBusinessCaseFormGroup(data.complete_business_case),
      my_team: this.createMyTeamFormGroup(data.my_team),
      change_owner: this.createUserFormControl(data.change_owner === undefined ? null : data.change_owner),
      change_owner_type: [data.change_owner_type === undefined ? null : data.change_owner_type, Validators.compose([Validators.maxLength(50)])],

    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(changeRequestFormGroup,
        this.mcValidationsConfigurationService.getChangeRequestValidatorsConfiguration(), mandatoryFieldsConfiguration, 'ChangeRequest');
    }
    return changeRequestFormGroup;
  }

  createRuleSetFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      rule_set_name: [data.name === undefined ? null : data.name, Validators.compose([Validators.maxLength(256)])],
      rules: [data.rules === undefined ? null : data.rules, Validators.compose([Validators.maxLength(2000)])],
    });
  }

  createScopeFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      scope_details: [data.scope_details === undefined ? null : data.scope_details, Validators.compose([])],
      parts: [data.parts === undefined ? null : data.parts, Validators.compose([Validators.maxLength(50)])],
      part_detail: this.createPartsFormGroup(data.part_detail),
      tooling: [data.tooling === undefined ? null : data.tooling, Validators.compose([Validators.maxLength(50)])],
      tooling_detail: this.createToolingFormGroup(data.tooling_detail),
      packaging: [data.packaging === undefined ? null : data.packaging, Validators.compose([Validators.maxLength(50)])],
      packaging_detail: this.createPackagingFormGroup(data.packaging_detail),
      bop: [data.bop || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createPartsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      machine_bom_part: [data.machine_bom_part === undefined ? null : data.machine_bom_part, Validators.compose([Validators.maxLength(50)])],
      service_part: [data.service_part === undefined ? null : data.service_part, Validators.compose([Validators.maxLength(50)])],
      preinstall_part: [data.preinstall_part === undefined ? null : data.preinstall_part, Validators.compose([Validators.maxLength(50)])],
      test_rig_part: [data.test_rig_part === undefined ? null : data.test_rig_part, Validators.compose([Validators.maxLength(50)])],
      dev_bag_part: [data.dev_bag_part === undefined ? null : data.dev_bag_part, Validators.compose([Validators.maxLength(50)])],
      fco_upgrade_option_csr: [data.fco_upgrade_option_csr === undefined ? null : data.fco_upgrade_option_csr, Validators.compose([Validators.maxLength(50)])],
    });
  }

  createToolingFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      supplier_tooling: [data.supplier_tooling === undefined ? null : data.supplier_tooling, Validators.compose([Validators.maxLength(50)])],
      manufacturing_de_tooling: [data.manufacturing_de_tooling === undefined ? null : data.manufacturing_de_tooling, Validators.compose([Validators.maxLength(50)])],
      service_tooling: [data.service_tooling === undefined ? null : data.service_tooling, Validators.compose([Validators.maxLength(50)])],
    });
  }

  createPackagingFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      supplier_packaging: [data.supplier_packaging === undefined ? null : data.supplier_packaging, Validators.compose([Validators.maxLength(50)])],
      storage_packaging: [data.storage_packaging === undefined ? null : data.storage_packaging, Validators.compose([Validators.maxLength(50)])],
      shipping_packaging: [data.shipping_packaging === undefined ? null : data.shipping_packaging, Validators.compose([Validators.maxLength(50)])],
      reusable_packaging: [data.reusable_packaging === undefined ? null : data.reusable_packaging, Validators.compose([Validators.maxLength(50)])],
    });
  }

  createSolutionDefineFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      functional_software_dependencies: [data.functional_software_dependencies === undefined ? null : data.functional_software_dependencies, Validators.compose([Validators.maxLength(50)])],
      functional_software_dependencies_details: [data.functional_software_dependencies_details === undefined ? null : data.functional_software_dependencies_details, Validators.compose([Validators.maxLength(1024)])],
      functional_hardware_dependencies: [data.functional_hardware_dependencies === undefined ? null : data.functional_hardware_dependencies, Validators.compose([Validators.maxLength(50)])],
      functional_hardware_dependencies_details: [data.functional_hardware_dependencies_details === undefined ? null : data.functional_hardware_dependencies_details, Validators.compose([Validators.maxLength(1024)])],
      hardware_software_dependencies_aligned: [data.hardware_software_dependencies_aligned === undefined ? null : data.hardware_software_dependencies_aligned, Validators.compose([Validators.maxLength(50)])],
      hardware_software_dependencies_aligned_details: [data.hardware_software_dependencies_aligned_details === undefined ? null : data.hardware_software_dependencies_aligned_details, Validators.compose([Validators.maxLength(1024)])],
      test_and_release_strategy: [data.test_and_release_strategy === undefined ? null : data.test_and_release_strategy, Validators.compose([Validators.maxLength(50)])],
      test_and_release_strategy_details: [data.test_and_release_strategy_details === undefined ? null : data.test_and_release_strategy_details, Validators.compose([Validators.maxLength(1024)])],
      products_affected: [(data.products_affected === undefined || data.products_affected === null) ? [] : data.products_affected, Validators.compose([Validators.maxLength(1024)])],
      products_module_affected: [data.products_module_affected === undefined ? null : data.products_module_affected, Validators.compose([Validators.maxLength(1024)])],
      aligned_with_fo: [data.aligned_with_fo === undefined ? null : data.aligned_with_fo, Validators.compose([Validators.maxLength(50)])],
      aligned_with_fo_details: [data.aligned_with_fo_details === undefined ? null : data.aligned_with_fo_details, Validators.compose([Validators.maxLength(1024)])],
      technical_recommendation: [data.technical_recommendation === undefined ? null : data.technical_recommendation, Validators.compose([])],
    });
  }

  createCustomerImpactFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      customer_impact_result: [data.customer_impact_result === undefined ? null : data.customer_impact_result, Validators.compose([Validators.maxLength(50)])],
      customer_approval: [data.customer_approval === undefined ? null : data.customer_approval, Validators.compose([Validators.maxLength(50)])],
      customer_approval_details: [data.customer_approval_details === undefined ? null : data.customer_approval_details, Validators.compose([Validators.maxLength(1024)])],
      customer_communication: [data.customer_communication === undefined ? null : data.customer_communication, Validators.compose([Validators.maxLength(50)])],
      customer_communication_details: [data.customer_communication_details === undefined ? null : data.customer_communication_details, Validators.compose([Validators.maxLength(1024)])],
      uptime_improvement: [data.uptime_improvement === undefined ? null : data.uptime_improvement, Validators.compose([Validators.maxLength(50)])],
      fco_implementation: [data.fco_implementation === undefined ? null : data.fco_implementation, Validators.compose([Validators.maxLength(50)])],
      uptime_payback: [data.uptime_payback === undefined ? null : data.uptime_payback, Validators.compose([Validators.maxLength(50)])],
      uptime_improvement_availability: [data.uptime_improvement_availability === undefined ? null : data.uptime_improvement_availability, Validators.compose([Validators.maxLength(50)])],
      fco_implementation_availability: [data.fco_implementation_availability === undefined ? null : data.fco_implementation_availability, Validators.compose([Validators.maxLength(50)])],
      uptime_payback_availability: [data.uptime_payback_availability === undefined ? null : data.uptime_payback_availability, Validators.compose([Validators.maxLength(50)])],
      impact_on_user_interfaces: [data.impact_on_user_interfaces === undefined ? null : data.impact_on_user_interfaces, Validators.compose([Validators.maxLength(50)])],
      impact_on_user_interfaces_details: [data.impact_on_user_interfaces_details === undefined ? null : data.impact_on_user_interfaces_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_wafer_process_environment: [data.impact_on_wafer_process_environment === undefined ? null : data.impact_on_wafer_process_environment, Validators.compose([Validators.maxLength(50)])],
      impact_on_wafer_process_environment_details: [data.impact_on_wafer_process_environment_details === undefined ? null : data.impact_on_wafer_process_environment_details, Validators.compose([Validators.maxLength(1024)])],
      change_to_customer_impact_critical_part: [data.change_to_customer_impact_critical_part === undefined ? null : data.change_to_customer_impact_critical_part, Validators.compose([Validators.maxLength(50)])],
      change_to_customer_impact_critical_part_details: [data.change_to_customer_impact_critical_part_details === undefined ? null : data.change_to_customer_impact_critical_part_details, Validators.compose([Validators.maxLength(1024)])],
      change_to_process_impacting_customer: [data.change_to_process_impacting_customer === undefined ? null : data.change_to_process_impacting_customer, Validators.compose([Validators.maxLength(50)])],
      change_to_process_impacting_customer_details: [data.change_to_process_impacting_customer_details === undefined ? null : data.change_to_process_impacting_customer_details, Validators.compose([Validators.maxLength(1024)])],
      fco_upgrade_option_csr_implementation_change: [data.fco_upgrade_option_csr_implementation_change === undefined ? null : data.fco_upgrade_option_csr_implementation_change, Validators.compose([Validators.maxLength(50)])],
      fco_upgrade_option_csr_implementation_change_details: [data.fco_upgrade_option_csr_implementation_change_details === undefined ? null : data.fco_upgrade_option_csr_implementation_change_details, Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createImpactAnalysisFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      customer_impact: this.createCustomerImpactFormGroup(data.customer_impact),
      preinstall_impact: this.createPreInstallImpactFormGroup(data.preinstall_impact),
      upgrade_packages: [data.upgrade_packages === undefined ? null : data.upgrade_packages, Validators.compose([Validators.maxLength(1024)])],
      upgrade_time: [data.upgrade_time === undefined ? null : data.upgrade_time, Validators.compose([])],
      recovery_time: [data.recovery_time === undefined ? null : data.recovery_time, Validators.compose([])],
      pre_post_conditions: [data.pre_post_conditions === undefined ? null : data.pre_post_conditions, Validators.compose([Validators.maxLength(1024)])],
      impact_on_sequence: [data.impact_on_sequence === undefined ? null : data.impact_on_sequence, Validators.compose([Validators.maxLength(50)])],
      impact_on_sequence_details: [data.impact_on_sequence_details === undefined ? null : data.impact_on_sequence_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_availability: [data.impact_on_availability === undefined ? null : data.impact_on_availability, Validators.compose([Validators.maxLength(50)])],
      impact_on_availability_details: [data.impact_on_availability_details === undefined ? null : data.impact_on_availability_details, Validators.compose([Validators.maxLength(1024)])],
      multi_plant_impact: [data.multi_plant_impact === undefined ? null : data.multi_plant_impact, Validators.compose([Validators.maxLength(50)])],
      phase_out_spares_tools: [data.phase_out_spares_tools === undefined ? null : data.phase_out_spares_tools, Validators.compose([Validators.maxLength(50)])],
      tech_risk_assessment_sra: [data.tech_risk_assessment_sra === undefined ? null : data.tech_risk_assessment_sra, Validators.compose([Validators.maxLength(50)])],
      tech_risk_assessment_sra_details: [data.tech_risk_assessment_sra_details === undefined ? null : data.tech_risk_assessment_sra_details, Validators.compose([Validators.maxLength(1024)])],
      tech_risk_assessment_fmea: [data.tech_risk_assessment_fmea === undefined ? null : data.tech_risk_assessment_fmea, Validators.compose([Validators.maxLength(50)])],
      tech_risk_assessment_fmea_details: [data.tech_risk_assessment_fmea_details === undefined ? null : data.tech_risk_assessment_fmea_details, Validators.compose([Validators.maxLength(1024)])],
      total_instances_affected: [data.total_instances_affected === undefined ? null : data.total_instances_affected, Validators.compose([Validators.maxLength(400)])],
      impact_on_system_level_performance: [data.impact_on_system_level_performance === undefined ? null : data.impact_on_system_level_performance, Validators.compose([Validators.maxLength(50)])],
      impact_on_system_level_performance_details: [data.impact_on_system_level_performance_details === undefined ? null : data.impact_on_system_level_performance_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_cycle_time: [data.impact_on_cycle_time === undefined ? null : data.impact_on_cycle_time, Validators.compose([Validators.maxLength(50)])],
      impact_on_cycle_time_details: [data.impact_on_cycle_time_details === undefined ? null : data.impact_on_cycle_time_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_labor_hours: [data.impact_on_labor_hours === undefined ? null : data.impact_on_labor_hours, Validators.compose([Validators.maxLength(50)])],
      impact_on_labor_hours_details: [data.impact_on_labor_hours_details === undefined ? null : data.impact_on_labor_hours_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_existing_parts: [data.impact_on_existing_parts === undefined ? null : data.impact_on_existing_parts, Validators.compose([Validators.maxLength(50)])],
      liability_risks: [(data.liability_risks === undefined || data.liability_risks === null) ? [] : data.liability_risks, Validators.compose([Validators.maxLength(50)])],
      implementation_ranges: [ (data.implementation_ranges === undefined || data.implementation_ranges === null) ? [] : data.implementation_ranges, Validators.compose([Validators.maxLength(50)])],
      implementation_ranges_details: [data.implementation_ranges_details === undefined ? null : data.implementation_ranges_details, Validators.compose([Validators.maxLength(1024)])],
      cbp_strategies: [(data.cbp_strategies === undefined || data.cbp_strategies === null) ? [] : data.cbp_strategies, Validators.compose([Validators.maxLength(50)])],
      cbp_strategies_details: [data.cbp_strategies_details === undefined ? null : data.cbp_strategies_details, Validators.compose([Validators.maxLength(1024)])],
      development_labor_hours: [data.development_labor_hours === undefined ? null : data.development_labor_hours, Validators.compose([])],
      investigation_labor_hours: [data.investigation_labor_hours === undefined ? null : data.investigation_labor_hours, Validators.compose([])],
      fco_types: [(data.fco_types === undefined || data.fco_types === null) ? [] : data.fco_types, Validators.compose([Validators.maxLength(50)])],
      calendar_dependency: [data.calendar_dependency === undefined ? null : data.calendar_dependency, Validators.compose([Validators.maxLength(256)])],
      targeted_valid_configurations: [data.targeted_valid_configurations === undefined ? null : data.targeted_valid_configurations, Validators.compose([Validators.maxLength(256)])],
      phase_out_spares_tools_details: [data.phase_out_spares_tools_details === undefined ? null : data.phase_out_spares_tools_details, Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createPreInstallImpactFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      preinstall_impact_result: [data.preinstall_impact_result === undefined ? null : data.preinstall_impact_result, Validators.compose([Validators.maxLength(50)])],
      change_introduces_new11_nc: [data.change_introduces_new11_nc === undefined ? null : data.change_introduces_new11_nc, Validators.compose([Validators.maxLength(50)])],
      change_introduces_new11_nc_details: [data.change_introduces_new11_nc_details === undefined ? null : data.change_introduces_new11_nc_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_customer_factory_layout: [data.impact_on_customer_factory_layout === undefined ? null : data.impact_on_customer_factory_layout, Validators.compose([Validators.maxLength(50)])],
      impact_on_customer_factory_layout_details: [data.impact_on_customer_factory_layout_details === undefined ? null : data.impact_on_customer_factory_layout_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_facility_flows: [data.impact_on_facility_flows === undefined ? null : data.impact_on_facility_flows, Validators.compose([Validators.maxLength(50)])],
      impact_on_facility_flows_details: [data.impact_on_facility_flows_details === undefined ? null : data.impact_on_facility_flows_details, Validators.compose([Validators.maxLength(1024)])],
      impact_on_preinstall_inter_connect_cables: [data.impact_on_preinstall_inter_connect_cables === undefined ? null : data.impact_on_preinstall_inter_connect_cables, Validators.compose([Validators.maxLength(50)])],
      impact_on_preinstall_inter_connect_cables_details: [data.impact_on_preinstall_inter_connect_cables_details === undefined ? null : data.impact_on_preinstall_inter_connect_cables_details, Validators.compose([Validators.maxLength(1024)])],
      change_replaces_mentioned_parts: [data.change_replaces_mentioned_parts === undefined ? null : data.change_replaces_mentioned_parts, Validators.compose([Validators.maxLength(50)])],
      change_replaces_mentioned_parts_details: [data.change_replaces_mentioned_parts_details === undefined ? null : data.change_replaces_mentioned_parts_details, Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createCompleteBusinessCaseFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      risk: [isNaN(data.risk) ? null : data.risk, Validators.compose([])],
      risk_in_labor_hours: [data.risk_in_labor_hours === undefined ? null : data.risk_in_labor_hours, Validators.compose([])],
      hardware_commitment: [isNaN(data.hardware_commitment) ? null : data.hardware_commitment, Validators.compose([])],
      system_starts_impacted: [isNaN(data.system_starts_impacted) ? null : data.system_starts_impacted, Validators.compose([])],
      systems_in_wip_and_field_impacted: [isNaN(data.systems_in_wip_and_field_impacted) ? null : data.systems_in_wip_and_field_impacted, Validators.compose([])],
      factory_investments: [isNaN(data.factory_investments) ? null : data.factory_investments, Validators.compose([])],
      fs_tooling_investments: [isNaN(data.fs_tooling_investments) ? null : data.fs_tooling_investments, Validators.compose([])],
      supply_chain_management_investments: [isNaN(data.supply_chain_management_investments) ? null : data.supply_chain_management_investments, Validators.compose([])],
      supplier_investments: [isNaN(data.supplier_investments) ? null : data.supplier_investments, Validators.compose([])],
      de_investments: [isNaN(data.de_investments) ? null : data.de_investments, Validators.compose([])],
      material_recurring_costs: [isNaN(data.material_recurring_costs) ? null : data.material_recurring_costs, Validators.compose([])],
      labor_recurring_costs: [isNaN(data.labor_recurring_costs) ? null : data.labor_recurring_costs, Validators.compose([])],
      cycle_time_recurring_costs: [isNaN(data.cycle_time_recurring_costs) ? null : data.cycle_time_recurring_costs, Validators.compose([])],
      inventory_replace_nonrecurring_costs: [isNaN(data.inventory_replace_nonrecurring_costs) ? null : data.inventory_replace_nonrecurring_costs, Validators.compose([])],
      inventory_scrap_nonrecurring_costs: [isNaN(data.inventory_scrap_nonrecurring_costs) ? null : data.inventory_scrap_nonrecurring_costs, Validators.compose([])],
      supply_chain_adjustments_nonrecurring_costs: [isNaN(data.supply_chain_adjustments_nonrecurring_costs) ? null : data.supply_chain_adjustments_nonrecurring_costs, Validators.compose([])],
      factory_change_order_nonrecurring_costs: [isNaN(data.factory_change_order_nonrecurring_costs) ? null : data.factory_change_order_nonrecurring_costs, Validators.compose([])],
      field_change_order_nonrecurring_costs: [isNaN(data.field_change_order_nonrecurring_costs) ? null : data.field_change_order_nonrecurring_costs, Validators.compose([])],
      update_upgrade_product_documentation_nonrecurring_costs: [isNaN(data.update_upgrade_product_documentation_nonrecurring_costs) ? null : data.update_upgrade_product_documentation_nonrecurring_costs, Validators.compose([])],
      farm_out_development_nonrecurring_costs: [isNaN(data.farm_out_development_nonrecurring_costs) ? null : data.farm_out_development_nonrecurring_costs, Validators.compose([])],
      prototype_materials_nonrecurring_costs: [isNaN(data.prototype_materials_nonrecurring_costs) ? null : data.prototype_materials_nonrecurring_costs, Validators.compose([])],
      revenues_benefits: [isNaN(data.revenues_benefits) ? null : data.revenues_benefits, Validators.compose([])],
      opex_reduction_field_labor_benefits: [isNaN(data.opex_reduction_field_labor_benefits) ? null : data.opex_reduction_field_labor_benefits, Validators.compose([])],
      opex_reduction_spare_parts_benefits: [isNaN(data.opex_reduction_spare_parts_benefits) ? null : data.opex_reduction_spare_parts_benefits, Validators.compose([])],
      customer_uptime_improvement_benefits: [isNaN(data.customer_uptime_improvement_benefits) ? null : data.customer_uptime_improvement_benefits, Validators.compose([])],
      other_opex_savings_benefits: [isNaN(data.other_opex_savings_benefits) ? null : data.other_opex_savings_benefits, Validators.compose([])],
      internal_rate_of_return: [isNaN(data.internal_rate_of_return) ? null : data.internal_rate_of_return, Validators.compose([])],
      bsnl_savings: [isNaN(data.bsnl_savings) ? null : data.bsnl_savings, Validators.compose([])],
      payback_period: [isNaN(data.payback_period) ? null : data.payback_period, Validators.compose([])],
      customer_opex_savings: [isNaN(data.customer_opex_savings) ? null : data.customer_opex_savings, Validators.compose([])],
      risk_on_excess_and_obsolescence: [isNaN(data.risk_on_excess_and_obsolescence) ? null : data.risk_on_excess_and_obsolescence, Validators.compose([])],
      risk_on_excess_and_obsolescence_reduction_proposal: [isNaN(data.risk_on_excess_and_obsolescence_reduction_proposal) ? null : data.risk_on_excess_and_obsolescence_reduction_proposal, Validators.compose([])],
      risk_on_excess_and_obsolescence_reduction_proposal_costs: [isNaN(data.risk_on_excess_and_obsolescence_reduction_proposal_costs) ? null : data.risk_on_excess_and_obsolescence_reduction_proposal_costs, Validators.compose([])],
    });
  }

  createMemberFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      status: [data.status || null, Validators.compose([Validators.maxLength(50)])],
      user: this.createMiraiUserFormGroup(data.user),
      roles: [data.roles || null, Validators.compose([Validators.maxLength(256)])],
    });
  }

  createMemberElementFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      member: this.createMemberFormGroup(data.member)
    });
  }

  createMyTeamFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [isNaN(data.id) ? null : data.id, Validators.compose([])],
      members: this.formBuilder.array(data.members ? data.members.map(res => this.createMemberElementFormGroup(res)) : []),
    });
  }

  createUserFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      userID: [(data.user_id || data.userID) || '', Validators.compose([Validators.maxLength(50)])],
      fullName: [(data.full_name || data.fullName) || '', Validators.compose([Validators.maxLength(128)])],
      email: [data.email || '', Validators.compose([Validators.maxLength(128)])],
      abbreviation: [data.abbreviation || '', Validators.compose([Validators.maxLength(50)])],
      departmentName: [(data.department_name || data.departmentName) || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createMiraiUserFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      user_id: [data.user_id || '', Validators.compose([Validators.maxLength(50)])],
      full_name: [data.full_name || '', Validators.compose([Validators.maxLength(128)])],
      email: [data.email || '', Validators.compose([Validators.maxLength(128)])],
      abbreviation: [data.abbreviation || '', Validators.compose([Validators.maxLength(50)])],
      department_name: [data.department_name || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createGeneralInformationFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      title: [data.title || '', Validators.compose([Validators.maxLength(256)])],
      state: [data.state || '', Validators.compose([Validators.maxLength(50)])],
      status: [data.status || '', Validators.compose([Validators.maxLength(50)])],
      createdBy: this.createUserFormGroup(data.createdBy),
      createdOn: [data.createdOn || '', Validators.compose([])],
      lastModifiedOn: [data.lastModifiedOn || '', Validators.compose([])],
      submittedOn: [data.submittedOn || '', Validators.compose([])],
      permissions: this.formBuilder.array(data.permissions ? data.permissions.map(res => this.createPermissionFormGroup(res)) : []),
    });
  }

  createChangeRequestImpactAnalysisFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      upgradePackages: [data.upgradePackages || '', Validators.compose([Validators.maxLength(1024)])],
      productBaselinesAffected: [data.productBaselinesAffected || '', Validators.compose([Validators.maxLength(1024)])],
      productionModAffected: [data.productionModAffected || '', Validators.compose([Validators.maxLength(1024)])],
      upgradeTime: [data.upgradeTime || '', Validators.compose([])],
      recoveryTime: [data.recoveryTime || '', Validators.compose([])],
      prePostConditions: [data.prePostConditions || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnSequence: [data.impactOnSequence || '', Validators.compose([Validators.maxLength(50)])],
      impactOnFacilities: [data.impactOnFacilities || '', Validators.compose([Validators.maxLength(50)])],
      impactOnAvailability: [data.impactOnAvailability || '', Validators.compose([Validators.maxLength(50)])],
      multiplantImpact: [data.multiplantImpact || '', Validators.compose([Validators.maxLength(50)])],
      accordingPBSAIRStrategy: [data.accordingPBSAIRStrategy || '', Validators.compose([Validators.maxLength(50)])],
      phaseOutSparesTools: [data.phaseOutSparesTools || '', Validators.compose([Validators.maxLength(50)])],
      CBC: this.createCBCFormGroup(data.CBC),
      impactOnSequenceDet: [data.impactOnSequenceDet || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnFacilitiesDet: [data.impactOnFacilitiesDet || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnAvailabilityDet: [data.impactOnAvailabilityDet || '', Validators.compose([Validators.maxLength(1024)])],
      accordingPBSAIRStratDet: [data.accordingPBSAIRStratDet || '', Validators.compose([Validators.maxLength(1024)])],
      phaseOutSparesToolsDet: [data.phaseOutSparesToolsDet || '', Validators.compose([Validators.maxLength(1024)])],
      techRiskAssessSRA: [data.techRiskAssessSRA || '', Validators.compose([Validators.maxLength(50)])],
      techRiskAssessFMEA: [data.techRiskAssessFMEA || '', Validators.compose([Validators.maxLength(50)])],
      techRiskAssessSRADet: [data.techRiskAssessSRADet || '', Validators.compose([Validators.maxLength(1024)])],
      techRiskAssessFMEADet: [data.techRiskAssessFMEADet || '', Validators.compose([Validators.maxLength(1024)])],
      totalInstancesAffected: [data.totalInstancesAffected || '', Validators.compose([Validators.maxLength(400)])],
      customerImpactAnalysis: this.createCustomerImpactAnalysisFormGroup(data.customerImpactAnalysis),
      sysLevelPerformImpact: [data.sysLevelPerformImpact || '', Validators.compose([Validators.maxLength(50)])],
      sysLevelPerformImpactDet: [data.sysLevelPerformImpactDet || '', Validators.compose([Validators.maxLength(1024)])],
      mandatoryUpgrade: [data.mandatoryUpgrade || '', Validators.compose([Validators.maxLength(50)])],
      mandatoryUpgradeDetails: [data.mandatoryUpgradeDetails || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnCycleTime: [data.impactOnCycleTime || '', Validators.compose([Validators.maxLength(50)])],
      impactOnCycleTimeDetails: [data.impactOnCycleTimeDetails || '', Validators.compose([Validators.maxLength(1024)])],
      developmentLaborHours: [data.developmentLaborHours || '', Validators.compose([])],
      preInstallImpactAnalysis: this.createPreInstallImpactAnalysisFormGroup(data.preInstallImpactAnalysis),
      impactOnFIR: [data.impactOnFIR || '', Validators.compose([Validators.maxLength(50)])],
      liabilityRisk: [data.liabilityRisk || '', Validators.compose([Validators.maxLength(50)])],
      investigationLaborHours: [data.investigationLaborHours || '', Validators.compose([])],
      impactOnExistingParts: [data.impactOnExistingParts || '', Validators.compose([Validators.maxLength(50)])],
      impactOnUserInterfaces: [data.impactOnUserInterfaces || '', Validators.compose([Validators.maxLength(50)])],
      impactOnUserInterfDtls: [data.impactOnUserInterfDtls || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnWaferProcessEnv: [data.impactOnWaferProcessEnv || '', Validators.compose([Validators.maxLength(50)])],
      impactOnWaferProcEnvDtls: [data.impactOnWaferProcEnvDtls || '', Validators.compose([Validators.maxLength(1024)])],
      changeToCustImpCrtclPart: [data.changeToCustImpCrtclPart || '', Validators.compose([Validators.maxLength(50)])],
      chngCustImpCrtclPartDtls: [data.chngCustImpCrtclPartDtls || '', Validators.compose([Validators.maxLength(1024)])],
      changeToProcImpactCust: [data.changeToProcImpactCust || '', Validators.compose([Validators.maxLength(50)])],
      changeProcImpactCustDtls: [data.changeProcImpactCustDtls || '', Validators.compose([Validators.maxLength(1024)])],
      FCOUpgOptCSRImplChange: [data.FCOUpgOptCSRImplChange || '', Validators.compose([Validators.maxLength(50)])],
      FCOUpgOptCSRImplChngDtls: [data.FCOUpgOptCSRImplChngDtls || '', Validators.compose([Validators.maxLength(1024)])],
      leadingNonLeading: [data.leadingNonLeading || '', Validators.compose([Validators.maxLength(256)])],
      targetedValidConfig: [data.targetedValidConfig || '', Validators.compose([Validators.maxLength(256)])],
    });
  }

  createChangeNoticeFormGroup(data, mandatoryFieldsConfiguration?: string[], readOnlyFields?: string[]) {
    data = data || {};
    const changeNoticeFormGroup = this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      revision: [data.revision || '', Validators.compose([Validators.maxLength(50)])],
      revisionStatus: [data.revisionStatus || '', Validators.compose([Validators.maxLength(50)])],
      generalInformation: this.createGeneralInformationFormGroup(data.generalInformation),
      statusTrackers: this.formBuilder.array(data.statusTrackers ? data.statusTrackers.map(res => this.createStatusTrackerFormGroup(res)) : []),
      productID: [data.productID || '', Validators.compose([Validators.maxLength(50)])],
      projectID: [data.projectID || '', Validators.compose([Validators.maxLength(50)])],
      changeSpecialist2: this.createUserFormControl(data.changeSpecialist2),
      implementationPriority: [isNaN(data.implementationPriority) ? '' : data.implementationPriority, Validators.compose([])],
      testAndReleaseStrategy: [data.testAndReleaseStrategy || '', Validators.compose([Validators.maxLength(50)])],
      phaseOutSparesTools: [data.phaseOutSparesTools || '', Validators.compose([Validators.maxLength(50)])],
      phaseOutSparesToolsDet: [data.phaseOutSparesToolsDet || '', Validators.compose([Validators.maxLength(1024)])],
      customerImpact: [data.customerImpact || '', Validators.compose([Validators.maxLength(50)])],
      notes: this.formBuilder.array(data.notes ? data.notes.map(res => this.createNoteFormGroup(res)) : []),
      documents: this.formBuilder.array(data.documents ? data.documents.map(res => this.createDocumentFormGroup(res)) : []),
      secure: [(data.secure === true || data.secure === false) ? data.secure : '', Validators.compose([])],
      changeImplPlanURL: [data.changeImplPlanURL || '', Validators.compose([])],
      CBC: this.createCBCFormGroup(data.CBC),
      dependencies: this.createDependenciesFormGroup(data.dependencies),
      implementationRangeCS: [data.implementationRangeCS || '', Validators.compose([Validators.maxLength(50)])],
      implementationRangeGF: [data.implementationRangeGF || '', Validators.compose([Validators.maxLength(50)])],
      impactAnalysis: this.createChangeNoticeImpactAnalysisFormGroup(data.impactAnalysis),
      orderingStrategyNewHW: [data.orderingStrategyNewHW || '', Validators.compose([Validators.maxLength(50)])],
      strategyOldHW: [data.strategyOldHW || '', Validators.compose([Validators.maxLength(50)])],
      implementationRanges: [data.implementationRanges || '', Validators.compose([Validators.maxLength(50)])],
      implementationRangesDet: [data.implementationRangesDet || '', Validators.compose([Validators.maxLength(1024)])],
      requirementsForImpPlan: [data.requirementsForImpPlan || '', Validators.compose([Validators.maxLength(2048)])],
      orderingStrategyNewHWDet: [data.orderingStrategyNewHWDet || '', Validators.compose([Validators.maxLength(1024)])],
      strategyOldHWDetails: [data.strategyOldHWDetails || '', Validators.compose([Validators.maxLength(400)])],
      testAndReleaseStratDet: [data.testAndReleaseStratDet || '', Validators.compose([Validators.maxLength(1024)])],
      CBPStrategies: [data.CBPStrategies || '', Validators.compose([Validators.maxLength(50)])],
      CBPStrategiesDetails: [data.CBPStrategiesDetails || '', Validators.compose([Validators.maxLength(1000)])],
      FCOTypes: [data.FCOTypes || '', Validators.compose([Validators.maxLength(50)])],
      tags: [data.tags || [], Validators.compose([Validators.maxLength(50)])],
      leadingInfo: [data.leadingInfo || '', Validators.compose([Validators.maxLength(256)])],
      targetedVC: [data.targetedVC || '', Validators.compose([Validators.maxLength(256)])],
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res=> this.createContextFormGroup(res)) : []),
      solutionItems: this.formBuilder.array(data.solutionItems ? data.solutionItems.map(res => this.createImpactedItemFormGroup(res)) : []),
      changeOwner: this.createUserFormGroup(data.changeOwner),
      changeOwnerType: [data.changeOwnerType || '', Validators.compose([Validators.maxLength(256)])],
      changeControlBoard: this.createChangeControlBoardFormControl(data.generalInformation),
      createdBy: this.createUserFormControl(data.generalInformation.createdBy),
      // added by ptummala
      projectLead: this.createUserFormControl(data.projectLead || new User())
    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(changeNoticeFormGroup,
        this.mcValidationsConfigurationService.getChangeNoticeValidatorsConfiguration(), mandatoryFieldsConfiguration);
    }
    return changeNoticeFormGroup;
  }

  createDecisionFormGroup(data?: Decision) {
    data = data || {};
    return this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      // required for decision added - ptummala
      decision: [data.decision || '', Validators.compose([Validators.maxLength(50), Validators.required])],
      decidedBy: this.formBuilder.array(data.decidedBy ? data.decidedBy.map(res => this.createUserFormGroup(res)) : []),
      decidedOn: [data.decidedOn || '', Validators.compose([])],
      motivation: [data.motivation || '', Validators.compose([Validators.maxLength(1024)])],
      communicatedOn: [data.communicatedOn || '', Validators.compose([])],
    });
  }

  createActionFormGroup(data, isDisabled?, mandatoryFieldsConfiguration?, readOnlyFields?: string[]) {
    data = data || {};
    const actionFormGroup = this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      generalInformation: this.createGeneralInformationFormGroup(data.generalInformation),
      title: [data.title || '', Validators.compose([Validators.maxLength(256)])],
      status: data.status || '',
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      assignee: this.createUserFormControl(data.assignee),
      assigneeGroup: [data.assigneeGroup || '', Validators.compose([Validators.maxLength(50)])],
      deadline: [data.deadline || '', Validators.compose([])],
      closedOn: [data.closedOn || '', Validators.compose([])],
      closedBy: this.createUserFormGroup(data.closedBy),
      notes: this.formBuilder.array(data.notes ? data.notes.map(res => this.createNoteFormGroup(res)) : []),
      motivation: [data.motivation || '', Validators.compose([Validators.maxLength(1024)])],
      statusTrackers: this.formBuilder.array(data.statusTrackers ? data.statusTrackers.map(res => this.createStatusTrackerFormGroup(res)) : []),
      documents: this.formBuilder.array(data.documents ? data.documents.map(res => this.createDocumentFormGroup(res)) : []),
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createActionContextFormGroup(res)) : []),

    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(actionFormGroup,
        this.mcValidationsConfigurationService.getActionValidatorsConfiguration(), mandatoryFieldsConfiguration);
    }
    if (readOnlyFields && readOnlyFields.length > 0) {
      this.setCaseObjectReadOnlyFields(actionFormGroup, readOnlyFields);
    }
    actionFormGroup.get('closedOn').disable();
    return actionFormGroup;
  }

  createCBCFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      riskInManHours: [data.riskInManHours || '', Validators.compose([])],
      risk: [isNaN(data.risk) ? '' : data.risk, Validators.compose([])],
      HWCommitment: [isNaN(data.HWCommitment) ? '' : data.HWCommitment, Validators.compose([])],
      investments: this.createInvestmentsFormGroup(data.investments),
      recurringCosts: this.createRecurringCostsFormGroup(data.recurringCosts),
      nonRecurringCosts: this.createNonRecurringCostsFormGroup(data.nonRecurringCosts),
      benefits: this.createBenefitsFormGroup(data.benefits),
      riskInLaborHours: [isNaN(data.riskInLaborHours) ? '' : data.riskInLaborHours, Validators.compose([])],
      financialSummary: this.createFinancialSummaryFormGroup(data.financialSummary),
      systemStartsImpacted: [isNaN(data.systemStartsImpacted) ? '' : data.systemStartsImpacted, Validators.compose([])],
      systemsWIPFieldImpacted: [isNaN(data.systemsWIPFieldImpacted) ? '' : data.systemsWIPFieldImpacted, Validators.compose([])],
      riskOnEOValue: [isNaN(data.riskOnEOValue) ? '' : data.riskOnEOValue, Validators.compose([])],
      riskOnEORedProposal: [isNaN(data.riskOnEORedProposal) ? '' : data.riskOnEORedProposal, Validators.compose([])],
      riskOnEORedPropCosts: [isNaN(data.riskOnEORedPropCosts) ? '' : data.riskOnEORedPropCosts, Validators.compose([])],
    });
  }

  createStatusTrackerFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      status: [data.status || '', Validators.compose([Validators.maxLength(50)])],
      statusChangeCount: [isNaN(data.statusChangeCount) ? '' : data.statusChangeCount, Validators.compose([])],
      actuals: this.formBuilder.array(data.actuals ? data.actuals.map(res => this.createPeriodFormGroup(res)) : []),
    });
  }

  createDocumentFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      name: [data.name || '', Validators.compose([Validators.maxLength(256)])],
      uploadedBy: this.createUserFormGroup(data.uploadedBy || data.creator),
      uploadedOn: [data.uploadedOn || data.created_on || '', Validators.compose([])],
      tags: [data.tags || '', Validators.compose([Validators.maxLength(50)])],
      ID: [data.ID || data.id || '', Validators.compose([Validators.maxLength(50)])],
      description: [data.description || '', Validators.compose([Validators.maxLength(256)])],
      content: [data.content || '', Validators.compose([])],
      commentID: [data.commentID || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createDocumentFormGroup2(data) {
    data = data || {};
    return this.formBuilder.group({
      name: [data.name || '', Validators.compose([Validators.maxLength(256)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(256)])],
      creator: this.createUserFormGroup(data.uploadedBy || data.creator),
      created_on: [data.uploadedOn || data.created_on || '', Validators.compose([])],
      tags: [data.tags || '', Validators.compose([Validators.maxLength(50)])],
      status: [data.status || '', Validators.compose([Validators.maxLength(256)])],
      status_label: [data.status_label || '', Validators.compose([Validators.maxLength(256)])],
      id: [data.ID || data.id || '', Validators.compose([Validators.maxLength(50)])],
      description: [data.description || '', Validators.compose([Validators.maxLength(256)])],
      content: data.content || ''
    });
  }

  createNoteFormGroup(data?: Note) {
    data = data || {};
    return this.formBuilder.group({
      note: [data.note || data['comment_text'] || '', Validators.compose([])],
      documents: this.formBuilder.array(data.documents ? data.documents.map(res => this.createDocumentFormGroup(res)) : []),
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      createdBy: this.createUserFormGroup(data.createdBy),
      createdOn: [data.createdOn || data['created_on'] || '', Validators.compose([])],
      tags: [data.tags || '', Validators.compose([Validators.maxLength(50)])],
      ID: [data.ID || data['id'] || '', Validators.compose([Validators.maxLength(50)])],
      status: [data.status || '', Validators.compose([])],
      lastModifiedOn: [data.lastModifiedOn || '', Validators.compose([])],
    });
  }

  createChangeRequestDocumentFormGroup(data) {
    data = data || [];
    return this.formBuilder.group({
      documents: this.formBuilder.array(data.length ? data.map(res => this.createDocumentFormGroup2(res[0] ? res[0] : {})) : [])
    });
  }

  createReleasePackageFormGroup(data, mandatoryFieldsConfiguration?: string[], readOnlyFields?: string[]) {
    if (!data) {
      data = {};
    }
    const releasePackageFormGroup = this.formBuilder.group({
      id: [data.id || '', Validators.compose([Validators.maxLength(50)])],
      release_package_number: [data.release_package_number === undefined ? null : data.release_package_number, Validators.compose([Validators.maxLength(50)])],
      title: [data.title === undefined ? null : data.title, Validators.compose([Validators.maxLength(256)])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      status_label: [data.status_label ? data.status_label : '', Validators.compose([])],
      is_secure: [(data.is_secure === true || data.is_secure === false) ? data.is_secure : null, Validators.compose([])],
      change_specialist3: this.createUserFormControl(data.change_specialist3 === undefined ? null : data.change_specialist3),
      executor: this.createUserFormControl(data.executor === undefined ? null : data.executor),
      creator: this.createUserFormControl(data.creator === undefined ? null : data.creator),
      plm_coordinator: this.createUserFormControl(data.plm_coordinator === undefined ? null : data.plm_coordinator),
      change_control_boards: [(data.change_control_boards === undefined || data.change_control_boards === null) ? [] : data.change_control_boards, Validators.compose([Validators.maxLength(50)])],
      created_on: [data.created_on === undefined ? null : data.created_on, Validators.compose([])],
      planned_release_date: [data.planned_release_date === undefined ? null : data.planned_release_date, Validators.compose([])],
      planned_effective_date: [data.planned_effective_date === undefined ? null : data.planned_effective_date, Validators.compose([])],
      sap_change_control: [data.sap_change_control === undefined ? null : data.sap_change_control, Validators.compose([])],
      prerequisites_applicable: [data.prerequisites_applicable === undefined ? null : data.prerequisites_applicable, Validators.compose([Validators.maxLength(50)])],
      prerequisites_detail: [data.prerequisites_detail === undefined ? null : data.prerequisites_detail, Validators.compose([Validators.maxLength(1024)])],
      types: [(data.types === undefined || data.types === null) ? [] : data.types, Validators.compose([Validators.maxLength(256)])],
      product_id: [data.product_id === undefined ? null : data.product_id, Validators.compose([Validators.maxLength(50)])],
      project_id: [data.project_id === undefined ? null : data.project_id, Validators.compose([Validators.maxLength(50)])],
      project_lead: [data.project_lead === undefined ? null : data.project_lead, Validators.compose([Validators.maxLength(50)])],
      my_team: this.createMyTeamFormGroup(data.my_team),
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createContextFormGroup(res)) : []),
      er_valid_from_input_strategy: [data.er_valid_from_input_strategy === undefined ? null : data.er_valid_from_input_strategy, Validators.compose([Validators.maxLength(50)])],
      tags: [data.tags === undefined ? null : data.tags, Validators.compose([Validators.maxLength(50)])],
      prerequisite_release_packages: this.formBuilder.array(data.prerequisite_release_packages ? data.prerequisite_release_packages.map(res => this.createReleasePacakgePrerequisiteFormGroup(res)) : []),
      change_owner_type: [data.change_owner_type === undefined ? null : data.change_owner_type, Validators.compose([Validators.maxLength(256)])],
      change_owner: this.createUserFormControl(data.change_owner === undefined ? null : data.change_owner),

      revision: [data.revision || '', Validators.compose([Validators.maxLength(50)])],
      revisionStatus: [data.revisionStatus || '', Validators.compose([Validators.maxLength(50)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      sourceSystemID: [data.sourceSystemID || '', Validators.compose([Validators.maxLength(50)])],
      notes: this.formBuilder.array(data.notes ? data.notes.map(res => this.createNoteFormGroup(res)) : []),
      documents: this.formBuilder.array(data.documents ? data.documents.map(res => this.createDocumentFormGroup(res)) : []),
      preRequisites: [data.preRequisites || '', Validators.compose([Validators.maxLength(1024)])],
      sourceSystemAliasID: [data.sourceSystemAliasID || '', Validators.compose([Validators.maxLength(50)])],
      statusTrackers: this.formBuilder.array(data.statusTrackers ? data.statusTrackers.map(res => this.createStatusTrackerFormGroup(res)) : []),
      // changeControlBoard: this.createChangeControlBoardFormControl(data.generalInformation),
      // createdBy: this.createUserFormControl(data.generalInformation.createdBy),
      // added by ptummala
      // projectLead: this.createUserFormControl(data.projectLead || new User()),

    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(releasePackageFormGroup,
        this.mcValidationsConfigurationService.getReleasePackageValidatorsConfiguration(), mandatoryFieldsConfiguration, 'ReleasePackage');
    }
    return releasePackageFormGroup;
  }

  createReleasePacakgePrerequisiteFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      release_package_id: [isNaN(data.release_package_id) ? '' : data.release_package_id, Validators.compose([])],
      release_package_number: [data.release_package_number || '', Validators.compose([Validators.maxLength(50)])],
      sequence_number: [isNaN(data.sequence_number) ? '' : data.sequence_number, Validators.compose([])],
    });
  }

  createDependenciesFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      functionalHWDependencies: [data.functionalHWDependencies || '', Validators.compose([Validators.maxLength(50)])],
      functionalHWDepenDet: [data.functionalHWDepenDet || '', Validators.compose([Validators.maxLength(1024)])],
      functionalSWDependencies: [data.functionalSWDependencies || '', Validators.compose([Validators.maxLength(50)])],
      functionalSWDepenDet: [data.functionalSWDepenDet || '', Validators.compose([Validators.maxLength(1024)])],
      HWSWDependenciesAligned: [data.HWSWDependenciesAligned || '', Validators.compose([Validators.maxLength(50)])],
      HWSWDepenAlignedDet: [data.HWSWDepenAlignedDet || '', Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createPermissionFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      group: [data.group || '', Validators.compose([Validators.maxLength(50)])],
      user: this.createUserFormGroup(data.user),
      role: [data.role || '', Validators.compose([Validators.maxLength(50)])],
      level: [data.level || '', Validators.compose([Validators.maxLength(50)])],
      roles: [data.roles || '', Validators.compose([Validators.maxLength(1024)])]
    });
  }

  createNonRecurringCostsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      inventoryReplaceExpense: [isNaN(data.inventoryReplaceExpense) ? '' : data.inventoryReplaceExpense, Validators.compose([])],
      inventoryScrapCosts: [isNaN(data.inventoryScrapCosts) ? '' : data.inventoryScrapCosts, Validators.compose([])],
      supplyChainAdjustments: [isNaN(data.supplyChainAdjustments) ? '' : data.supplyChainAdjustments, Validators.compose([])],
      factoryChangeOrderCosts: [isNaN(data.factoryChangeOrderCosts) ? '' : data.factoryChangeOrderCosts, Validators.compose([])],
      fieldChangeOrderCosts: [isNaN(data.fieldChangeOrderCosts) ? '' : data.fieldChangeOrderCosts, Validators.compose([])],
      updateUpgradeProductDocs: [isNaN(data.updateUpgradeProductDocs) ? '' : data.updateUpgradeProductDocs, Validators.compose([])],
      farmOutDevelopment: [isNaN(data.farmOutDevelopment) ? '' : data.farmOutDevelopment, Validators.compose([])],
      prototypeMaterials: [isNaN(data.prototypeMaterials) ? '' : data.prototypeMaterials, Validators.compose([])],
    });
  }

  createRecurringCostsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      material: [isNaN(data.material) ? '' : data.material, Validators.compose([])],
      labor: [isNaN(data.labor) ? '' : data.labor, Validators.compose([])],
      cycleTime: [isNaN(data.cycleTime) ? '' : data.cycleTime, Validators.compose([])],
    });
  }

  createBenefitsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      revenues: [isNaN(data.revenues) ? '' : data.revenues, Validators.compose([])],
      OPEXReductionFieldLabor: [isNaN(data.OPEXReductionFieldLabor) ? '' : data.OPEXReductionFieldLabor, Validators.compose([])],
      OPEXReductionSpareParts: [isNaN(data.OPEXReductionSpareParts) ? '' : data.OPEXReductionSpareParts, Validators.compose([])],
      customerUptimeImpr: [isNaN(data.customerUptimeImpr) ? '' : data.customerUptimeImpr, Validators.compose([])],
      otherOPEXSavings: [isNaN(data.otherOPEXSavings) ? '' : data.otherOPEXSavings, Validators.compose([])],
    });
  }

  /*createAgendaFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      generalInformation: this.createGeneralInformationFormGroup(data.generalInformation),
      attendeesPresent: this.formBuilder.array(data.attendeesPresent.map(res => this.createUserFormGroup(res))),
      attendeesAbsent: this.formBuilder.array(data.attendeesAbsent.map(res => this.createUserFormGroup(res))),
      actualStartDate: [data.actualStartDate || '', Validators.compose([])],
      actualFinishDate: [data.actualFinishDate || '', Validators.compose([])],
      chairPerson: this.createUserFormGroup(data.chairPerson),
      calendarID: [data.calendarID || '', Validators.compose([Validators.maxLength(256)])],
      category: [data.category || '', Validators.compose([Validators.maxLength(50)])],
      plannedStartDate: [data.plannedStartDate || '', Validators.compose([])],
    });
  }*/
  createAgendaFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      datePicker: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      meetingName: [data.generalInformation ? data.generalInformation.title : '', Validators.compose([Validators.maxLength(256)])],
      selectMeetingName: [data.selectMeetingName || ''],
      userSearch: [data.userNameSearch || '', Validators.compose([])]
    });
  }

  createAgendaItemFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      generalInformation: this.createGeneralInformationFormGroup(data.generalInformation),
      purpose: [data.purpose || '', Validators.compose([Validators.maxLength(50), Validators.required])],
      category: [data.category || '', Validators.compose([Validators.maxLength(50)])],
      subCategory: [data.subCategory || '', Validators.compose([Validators.maxLength(50)])],
      plannedDuration: [data.plannedDuration || '', Validators.compose([])],
      actualDuration: [data.actualDuration || '', Validators.compose([])],
      agendaSequenceNumber: [isNaN(data.agendaSequenceNumber) ? '' : data.agendaSequenceNumber, Validators.compose([])],
      presenter: this.createUserFormControl(data.presenter),
      minutes: this.createMinutesFormGroup(data.minutes),
      notes: this.formBuilder.array(data.notes ? data.notes.map(res => this.createNoteFormGroup(res)) : []),
      specialInvitees: this.formBuilder.array(data.specialInvitees ? data.specialInvitees.map(res => this.createUserFormGroup(res)) : []),
      preferredDate: [data.preferredDate || '', Validators.compose([])],
      presentationDocuments: this.formBuilder.array(data.presentationDocuments ? data.presentationDocuments.map(res => this.createDocumentFormGroup(res)) : []),
      productClusterManager: this.createUserFormControl(data.productClusterManager),
      applicableCBRules: [data.applicableCBRules || [], Validators.compose([Validators.maxLength(1024)])],
      productDevManager: this.createUserFormControl(data.productDevManager),
      topic: [data.topic || '', Validators.compose([Validators.maxLength(50)])],
      applicableCBRulesCat: [data.applicableCBRulesCat || '', Validators.compose([Validators.maxLength(50)])],
      section: [data.section || '', Validators.compose([Validators.maxLength(256)])],
      purposeDetails: [data.purposeDetails || '', Validators.compose([Validators.maxLength(256)])],
      changeBoardRuleSet: [data.changeBoardRuleSet || [], Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createMinutesFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      date: [data.date || '', Validators.compose([])],
      attendeesPresent: this.formBuilder.array(data.attendeesPresent ? data.attendeesPresent.map(res => this.createUserFormGroup(res)) : []),
      minutes: [data.minutes || '', Validators.compose([])],
      conclusion: [data.conclusion || '', Validators.compose([])],
    });
  }

  createPeriodFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      startDate: [data.startDate || '', Validators.compose([])],
      endDate: [data.endDate || '', Validators.compose([])],
    });
  }

  createChangeNoticeImpactAnalysisFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      upgradePackages: [data.upgradePackages || '', Validators.compose([Validators.maxLength(1024)])],
      productBaselinesAffected: [data.productBaselinesAffected || '', Validators.compose([Validators.maxLength(1024)])],
      productionModAffected: [data.productionModAffected || '', Validators.compose([Validators.maxLength(1024)])],
      totalInstancesAffected: [data.totalInstancesAffected || '', Validators.compose([Validators.maxLength(400)])],
      upgradeTime: [data.upgradeTime || '', Validators.compose([])],
      recoveryTime: [data.recoveryTime || '', Validators.compose([])],
      prePostConditions: [data.prePostConditions || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnSequence: [data.impactOnSequence || '', Validators.compose([Validators.maxLength(50)])],
      impactOnFacilities: [data.impactOnFacilities || '', Validators.compose([Validators.maxLength(50)])],
      impactOnAvailability: [data.impactOnAvailability || '', Validators.compose([Validators.maxLength(50)])],
      impactOnSequenceDet: [data.impactOnSequenceDet || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnFacilitiesDet: [data.impactOnFacilitiesDet || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnAvailabilityDet: [data.impactOnAvailabilityDet || '', Validators.compose([Validators.maxLength(1024)])],
      multiplantImpact: [data.multiplantImpact || '', Validators.compose([Validators.maxLength(50)])],
      mandatoryUpgrade: [data.mandatoryUpgrade || '', Validators.compose([Validators.maxLength(50)])],
      mandatoryUpgradeDetails: [data.mandatoryUpgradeDetails || '', Validators.compose([Validators.maxLength(1024)])],
      impactOnCycleTime: [data.impactOnCycleTime || '', Validators.compose([Validators.maxLength(50)])],
      impactOnCycleTimeDetails: [data.impactOnCycleTimeDetails || '', Validators.compose([Validators.maxLength(1024)])],
      developmentLaborHours: [data.developmentLaborHours || '', Validators.compose([])],
      impactOnPreInstall: [data.impactOnPreInstall || '', Validators.compose([Validators.maxLength(50)])],
      investigationLaborHours: [data.investigationLaborHours || '', Validators.compose([])],
      leadingNonLeading: [data.leadingNonLeading || '', Validators.compose([Validators.maxLength(256)])],
      targetedValidConfig: [data.targetedValidConfig || '', Validators.compose([Validators.maxLength(256)])],
      impactOnLaborHours: [data.impactOnLaborHours || '', Validators.compose([Validators.maxLength(50)])],
      impactOnLaborHoursDet: [data.impactOnLaborHoursDet || '', Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createInvestmentsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      factoryInvestments: [isNaN(data.factoryInvestments) ? '' : data.factoryInvestments, Validators.compose([])],
      FSToolingInvestments: [isNaN(data.FSToolingInvestments) ? '' : data.FSToolingInvestments, Validators.compose([])],
      SCManagementInvestments: [isNaN(data.SCManagementInvestments) ? '' : data.SCManagementInvestments, Validators.compose([])],
      supplierInvestments: [isNaN(data.supplierInvestments) ? '' : data.supplierInvestments, Validators.compose([])],
      DEInvestments: [isNaN(data.DEInvestments) ? '' : data.DEInvestments, Validators.compose([])],
    });
  }

  createCustomerImpactAnalysisFormGroup(data) {
    data = data || {};
    this.initializeAssessmentCriteriasWithQuestions(data, 0);
    return this.formBuilder.group({
      assessmentCriterias: this.formBuilder.array(data.assessmentCriterias ? data.assessmentCriterias.map(res => this.createAssessmentCriteriaFormGroup(res)) : []),
      customerImpact: [data.customerImpact || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createAssessmentCriteriaFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      question: [data.question || '', Validators.compose([Validators.maxLength(1024)])],
      answer: [data.answer || '', Validators.compose([Validators.maxLength(50)])],
      motivation: [data.motivation || '', Validators.compose([Validators.maxLength(1024)])],
      explanation: [data.explanation || '', Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createReviewFormGroup(data, mandatoryFieldsConfiguration?: string[], readOnlyFields?: string[]) {
    data = data || {};
    const reviewFormGroup = this.formBuilder.group({
      id: [data.id || '', Validators.compose([])],
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createContextFormGroup(res)) : []),
      due_date: [data.due_date || '', Validators.compose([])],
      executor: this.createUserFormControl(data.executor),
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      title: [data.title || '', Validators.compose([Validators.maxLength(255)])],
      created_on: [data.created_on || '', Validators.compose([])],
      creator: this.createReviewUserFormControl(data.creator),
      completion_date: [data.completion_date || '', Validators.compose([])],

    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(reviewFormGroup,
        this.mcValidationsConfigurationService.getReviewValidatorsConfiguration(), mandatoryFieldsConfiguration, 'Review');
    }
    if (readOnlyFields && readOnlyFields.length > 0) {
      this.setCaseObjectReadOnlyFields(reviewFormGroup, readOnlyFields);
    }
    return reviewFormGroup;
  }

  createReviewEntryFormGroup(data, mandatoryFieldsConfiguration?: string[], readOnlyFields?: string[]) {
    data = data || {};
    const reviewEntryFormGroup = this.formBuilder.group({
      id: [data.id || '', Validators.compose([])],
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createContextFormGroup(res)) : []),
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      description: [data.description || '', Validators.compose([Validators.maxLength(255)])],
      classification: [data.classification || '', Validators.compose([Validators.maxLength(255)])],
      remark: [data.remark || '', Validators.compose([Validators.maxLength(255)])],
      sequence_number: [isNaN(data.sequence_number) ? '' : data.sequence_number, Validators.compose([])],
      created_on: [data.created_on || '', Validators.compose([])],
      creator: this.createUserFormGroup(data.creator),
      assignee: this.createUserFormControl(data.assignee)
    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(reviewEntryFormGroup,
        this.mcValidationsConfigurationService.getReviewEntryValidatorsConfiguration(), mandatoryFieldsConfiguration, 'ReviewEntry');
    }
    if (readOnlyFields && readOnlyFields.length > 0) {
      this.setCaseObjectReadOnlyFields(reviewEntryFormGroup, readOnlyFields);
    }
    return reviewEntryFormGroup;
  }

  createReviewerFormGroup(data, mandatoryFieldsConfiguration?: string[]) {
    data = data || {};
    const reviewEntryFormGroup = this.formBuilder.group({
      id: [data.id || '', Validators.compose([])],
      assignee: this.createReviewUserFormControl(data.assignee),
      assignees: this.formBuilder.control(data.assignees && data.assignees.map(res => new User(res)) || []),
      due_date: [data.due_date || '', Validators.compose([])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      created_on: [data.created_on || '', Validators.compose([])],
      creator: this.createReviewUserFormControl(data.creator),
    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(reviewEntryFormGroup,
        this.mcValidationsConfigurationService.getReviewerValidatorsConfiguration(), mandatoryFieldsConfiguration, 'ReviewEntry');
    }
    return reviewEntryFormGroup;
  }

  createReviewersFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      assignees: this.formBuilder.control(data.assignees && data.assignees.map(res => new User(res)) || []),
      due_date: [data.due_date || '', Validators.compose([])]
    });
  }


  createReviewEntryCommentsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [data.id || '', Validators.compose([])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      comment_text: [data.comment_text || '', Validators.compose([Validators.maxLength(255)])],
      created_on: [data.created_on || '', Validators.compose([])],
      creator: this.createUserFormGroup(data.creator),
    });
  }

  createReviewerNotificationFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      entity_id: [data.entity_id || '', Validators.compose([Validators.maxLength(255)])],
      category: [data.category || '', Validators.compose([Validators.maxLength(255)])],
      role: [data.role || '', Validators.compose([Validators.maxLength(255)])],
      entity: [data.entity || '', Validators.compose([Validators.maxLength(255)])],
      actor: this.createUserFormGroup(data.actor),
      recipient: this.createUserFormGroup(data.recipient),
      timestamp: [data.timestamp || '', Validators.compose([Validators.maxLength(255)])],
      title: [data.title || '', Validators.compose([Validators.maxLength(255)])],
    });
  }

  createReviewEntryCommentDocumentResponseFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [data.id || data.ID || '', Validators.compose([])],
      name: [data.name || '', Validators.compose([Validators.maxLength(255)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(255)])],
      description: [data.description || '', Validators.compose([Validators.maxLength(255)])],
      tags: [data.tags || '', Validators.compose([Validators.maxLength(255)])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
      creator: this.createUserFormGroup(data.creator),
      created_on: [data.created_on || '', Validators.compose([])],
    });
  }

  createReviewItemFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      sourceSystemID: [data.sourceSystemID || '', Validators.compose([Validators.maxLength(50)])],
      name: [data.name || '', Validators.compose([Validators.maxLength(50)])],
    });
  }

  createFinancialSummaryFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      internalRateofReturn: [isNaN(data.internalRateofReturn) ? '' : data.internalRateofReturn, Validators.compose([])],
      BSNLSavings: [isNaN(data.BSNLSavings) ? '' : data.BSNLSavings, Validators.compose([])],
      paybackPeriod: [isNaN(data.paybackPeriod) ? '' : data.paybackPeriod, Validators.compose([])],
      customerOpexSavings: [isNaN(data.customerOpexSavings) ? '' : data.customerOpexSavings, Validators.compose([])],
    });
  }

  createPreInstallImpactAnalysisFormGroup(data) {
    data = data || {};
    this.initializeAssessmentCriteriasWithQuestions(data, 1);
    return this.formBuilder.group({
      assessmentCriterias: this.formBuilder.array(data.assessmentCriterias ? data.assessmentCriterias.map(res => this.createAssessmentCriteriaFormGroup(res)) : []),
      preInstallImpact: [data.preInstallImpact || '', Validators.compose([Validators.maxLength(50)])],
    });
  }


  createApprovalFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      customerApproval: [data.customerApproval || '', Validators.compose([Validators.maxLength(50)])],
      customerApprovalDet: [data.customerApprovalDet || '', Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createCommunicationFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      customerCommunication: [data.customerCommunication || '', Validators.compose([Validators.maxLength(50)])],
      customerCommunicationDet: [data.customerCommunicationDet || '', Validators.compose([Validators.maxLength(1024)])],
    });
  }

  createCustomerPaybackPeriodFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      uptimeImprovement: [data.uptimeImprovement || '', Validators.compose([])],
      FCOImplementation: [data.FCOImplementation || '', Validators.compose([])],
      customerUptimePayback: [data.customerUptimePayback || '', Validators.compose([])],
      uptimeImprovAvail: [isNaN(data.uptimeImprovAvail) ? '' : data.uptimeImprovAvail, Validators.compose([])],
      FCOImplAvailability: [isNaN(data.FCOImplAvailability) ? '' : data.FCOImplAvailability, Validators.compose([])],
      custUptimePaybackAvail: [isNaN(data.custUptimePaybackAvail) ? '' : data.custUptimePaybackAvail, Validators.compose([])],
      custUptimePaybckAvailDur: [data.custUptimePaybckAvailDur || '', Validators.compose([])],
    });
  }

  createDependencyFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50)])],
      revision: [data.revision || '', Validators.compose([Validators.maxLength(50)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      sequenceNumber: [isNaN(data.sequenceNumber) ? '' : data.sequenceNumber, Validators.compose([])],
    });
  }

  createContextFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      context_id: [data.context_id || data.contextID || '', Validators.compose([Validators.maxLength(50)])],
      name: [data.name || '', Validators.compose([Validators.maxLength(256)])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
    });
  }

  createImpactedItemFormGroup(data, mandatoryFieldsConfiguration?) {
    mandatoryFieldsConfiguration = mandatoryFieldsConfiguration || [];
    const impactedItemFormGroup = this.formBuilder.group({
      id: [data.id || '', Validators.compose([])],
      uid: [data.uid || '', Validators.compose([Validators.maxLength(255)])],
      type: [data.type || '', Validators.compose([Validators.maxLength(255)])],
      category: [data.category || '', Validators.compose([Validators.maxLength(255)])],
      name: [data.name || '', Validators.compose([Validators.maxLength(255)])],
      revision: [data.revision || '', Validators.compose([Validators.maxLength(255)])],
      title: [data.title || '', Validators.compose([Validators.maxLength(256)])],
      change_type: [data.change_type || '', Validators.compose([Validators.maxLength(255)])],
      description: [data.description || '', Validators.compose([Validators.maxLength(1024)])],
      // Below condition is create a form control with only a single user object
      creators: this.createUserFormControl(data.creators[0]),
      // creators: this.formBuilder.control(data.creators ? data.creators : []),
      users: this.formBuilder.control(data.users ? data.users : []),
      creator: this.createUserFormControl(data.creator),
      created_on: [data.created_on || '', Validators.compose([])],
      is_change_owner: [coerceBooleanProperty(data.is_change_owner), Validators.compose([])],
      is_modified: [coerceBooleanProperty(data.is_modified), Validators.compose([])],
      sequence: [isNaN(data.sequence) ? '' : data.sequence, Validators.compose([])],
      contexts: this.formBuilder.array(data.contexts ? data.contexts.map(res => this.createContextFormGroup(res)) : []),
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
    //  Added Manually
      new_existing_toggle: [data.new_existing_toggle || '', Validators.compose([])],
      release_package_number: [data.release_package_number || '', Validators.compose([Validators.maxLength(256)])]
    });
    if (mandatoryFieldsConfiguration && mandatoryFieldsConfiguration.length > 0) {
      this.setCaseObjectValidators(impactedItemFormGroup,
        this.mcValidationsConfigurationService.getImpactedItemValidatorsConfiguration(), mandatoryFieldsConfiguration, 'ImpactedItem');
    }
    return impactedItemFormGroup;
  }

  checkAndSetCaseObjectsFieldsEnableState(caseObjectFormGroup: FormGroup, caseActions: string[], isFromChangeNotice: boolean) {
    const generalInfoStatus = 'generalInformation.status';
    if (isFromChangeNotice) {
      if (caseObjectFormGroup.get('requirementsForImpPlan')) {
        caseObjectFormGroup.get('requirementsForImpPlan').disable();
      }
    }
  }

  createAgendaItemRuleFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      label: [data.label || ''],
      text: [data.text || '', Validators.compose([Validators.maxLength(1024)])],
      help: [data.help || '', Validators.compose([Validators.maxLength(1024)])]
    });
  }

  createProductFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      label: [data.label || ''],
      text: [data.text || '', Validators.compose([Validators.maxLength(1024)])]
    });
  }

  createTagFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      label: [data.label || ''],
      name: [data.name || '', Validators.compose([Validators.maxLength(1024)])]
    });
  }

  createNoteSummaryFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      note: this.createNoteFormGroup(data.note),
      attachments: (data.attachments) ? this.formBuilder.array(data.attachments.map(res => this.createAttchmentElementGroup(res))) : [],
      link: data.link || {} as Link
    });
  }

  createReviewCommentFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      note: this.createNoteFormGroup(data.note),
      attachments: (data.attachments) ? this.formBuilder.array(data.attachments.map(res => this.createAttchmentElementGroup(res))) : [],
      link: data.link || {} as Link
    });
  }

  createCommentSummaryFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      note: this.createNoteFormGroup(data.note),
      attachments: (data.attachments) ? this.formBuilder.array(data.attachments.map(res => this.createAttchmentElementGroup(res))) : [],
      link: data.link || {} as Link
    });
  }

  createAttchmentElementGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      contentSize: data.contentSize,
      contentType: data.contentType,
      document: (data.document) ? this.createDocumentFormGroup(data.document) : {}
    });
  }


  createChangeControlBoardFormControl(data: GeneralInformation): FormControl {
    data = data || {};
    const changeControlBoardList = data.permissions ? data.permissions.filter(permission => permission.role === 'CCB') : [];
    return this.formBuilder.control(changeControlBoardList);
  }


  createChangeBoardFormControl(data: GeneralInformation): FormControl {
    data = data || {};
    const changeBoardList = data.permissions ? data.permissions.filter(permission => permission.role === 'CB') : [];
    return this.formBuilder.control(changeBoardList);
  }


  createUserFormControl(data: User): FormControl {
    // data = data || {};
    return this.formBuilder.control(data);
  }

  createReviewUserFormControl(data: MiraiUser): FormControl {
    if (data && data.user_id) {
      const data1 = {} as User;
      data = data || {};
      data1.userID = data['userID'] || data.user_id || '', Validators.compose([Validators.maxLength(50)]),
        data1.fullName = data['fullName'] || data.full_name || '', Validators.compose([Validators.maxLength(128)]),
        data1.email = data.email || '', Validators.compose([Validators.maxLength(128)]),
        data1.abbreviation = data.abbreviation || '', Validators.compose([Validators.maxLength(50)]),
        data1.departmentName = data['departmentName'] || data.department_name || '', Validators.compose([Validators.maxLength(50)]);
      return this.formBuilder.control(data1);
    }
    return this.formBuilder.control(data);
  }

  createUsersFormControl(data: User[]): FormControl {
    return this.formBuilder.control(data || []);
  }

  createUserTypeFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      abbreviation: [data.abbreviation || '', Validators.compose([])],
      department_name: [data.department_name || '', Validators.compose([])],
      email: [data.email || '', Validators.compose([])],
      full_name: [data.full_name || '', Validators.compose([])],
      user_id: [data.user_id || '', Validators.compose([])],
    });
  }

  createCommentsFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      comment_text: [data.comment_text || '', Validators.compose([])],
      created_on: [data.created_on || '', Validators.compose([])],
      creator: this.createUserFormGroup(data.creator),
      documents: this.formBuilder.array(data.documents ? data.documents.map(res => this.createReviewEntryCommentDocumentResponseFormGroup(res)) : []),
      id: [data.id || '', Validators.compose([])],
      is_delete_allowed: [data.is_delete_allowed || false, Validators.compose([])],
      is_edit_allowed: [data.is_edit_allowed || false, Validators.compose([])],
      reply_count: [isNaN(data.reply_count) ? '' : data.reply_count, Validators.compose([])],
      replies: this.formBuilder.array(data.replies ? data.replies.map(res => this.createCommentsFormGroup(res)) : []),
      status: [data.status || '', Validators.compose([])],
      status_label: [data.status_label || '', Validators.compose([])],
      show_replies: [data.show_replies || false, Validators.compose([])],
      reply_label: [data.reply_label || '', Validators.compose([])]
    });
  }

  createCommentsFormArray(data) {
    data = data || [];
    return this.formBuilder.group({
      has_next: [data.has_next || false, Validators.compose([])],
      results: this.formBuilder.array(data.results ? data.results.map(res => this.createCommentsFormGroup(res)) : []),
      total_elements: [data.total_elements || '', Validators.compose([])],
      total_pages: [data.total_pages || '', Validators.compose([])],
    });
  }

  // Added by savs for saving contexts object in the format used in BPM service
  createActionContextFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      type: [data.type || '', Validators.compose([Validators.maxLength(50)])],
      contextID: [data.contextID || '', Validators.compose([Validators.maxLength(50)])],
      name: [data.name || '', Validators.compose([Validators.maxLength(256)])],
      status: [isNaN(data.status) ? '' : data.status, Validators.compose([])],
    });
  }

}
