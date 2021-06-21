import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MCToolbarFieldComponent} from '../../../shared/components/mc-toolbar/mc-toolbar-field.component';
import {select, Store} from '@ngrx/store';
import {
  CaseObjectLayout,
  MyChangeState, NavBarPayload,
  ParallelUpdateState,
  SidePanelState
} from '../../../shared/models/mc-store.model';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {
  CaseActionDetail,
  CaseActionElement,
  CaseObject, CasePermissions,
  ChangeNotice,
  ChangeRequest,
  ImpactedItem, User
} from '../../../shared/models/mc.model';
import {
  loadCaseActions,
  loadCaseObject,
  loadReadOnlyParameters,
  loadWriteAllowParameters, unloadCaseObject
} from '../../../store/actions/case-object.actions';
import {selectRightNavBarState, setRightSideNavBar} from '../../../side-panel/store';
import {CaseObjectServicePath} from '../../../shared/components/case-object-list/case-object.enum';
import {forkJoin, of, Subject, Subscription, zip} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ChangeRequestService} from '../../change-request.service';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';
import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CerberusService} from '../../../core/services/cerberus.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MandatoryFieldTabMappingService} from '../../../core/utilities/mandatory-field-tab-mapping.service';
import {DIA} from '../../../shared/models/cerberus.model';
import {ChangeRequestFormConfiguration, FormControlEnumeration} from '../../../shared/models/mc-configuration.model';
import {FieldUpdateData} from '../../../shared/models/mc-field-update.model';
import {environment} from '../../../../environments/environment';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {catchError, concatMap, map} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SwitchOwnerConfirmationDialogComponent} from '../../../shared/components/switch-owner-confirmation-dialog/switch-owner-confirmation-dialog.component';
import {
  changeCaseObjectTabStatus,
  refreshNotificationsCount, resetCaseObjectTabStatus,
  selectAllFieldUpdates,
  selectCaseObject,
  selectCaseObjectLayoutState,
  selectMandatoryParameters, userTouch
} from '../../../store';
import {mcFieldUpdated, resetFieldData} from '../../../store/actions/field-update.actions';
import {FieldUpdateStates} from '../../../shared/models/mc-enums';
import {CaseAction, CaseObjectReadOnly, CaseObjectWriteOnly} from '../../../shared/models/case-action.model';
import {UserPermissionService} from '../../../core/services/user-permission.service';


@Component({
  selector: 'mc-change-request-details-core',
  template: ''
})

export class ChangeRequestDetailsCoreComponent extends MCToolbarFieldComponent implements OnInit, OnDestroy {
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  param: string;
  @Input()
  showLoader: boolean;
  @Input()
  isCreatorCR: boolean;
  @Input()
  isProjectCR: boolean;
  @Input()
  changeRequestDocumentsFormGroup: FormGroup;
  @Output()
  readonly updateChangeRequestView: EventEmitter<any> = new EventEmitter<any>();
  changeRequestDetails: ChangeRequest;
  changeRequestResponse: ChangeRequest;
  caseObject: CaseObject;
  changeRequestFormSelectedTab: number;
  changeRequestFormGroup: FormGroup;
  updateChangeRequestSubscription$: Subscription;
  layoutSubscription$: Subscription;
  sideNavSubscription$: Subscription;
  diabom: DIA;
  deepLinkURL: string;
  pictureUrl: string;
  solutionItemsCaseActionsList: any[];
  changeObjectCaseActionsForCR: any[];
  linkedChangeNoticeList: ChangeNotice[];
  linkedChangeNotice: any;
  isStatusApproved: boolean;
  isChangeNoticeListExist: boolean;
  caseActions: string[];
  preSelectedAction: string;
  tooltipText: string;
  previousStatus: string[];
  statusList: FormControlEnumeration[];
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  mandatoryFields: string[];
  openInMode: string;
  defineSolution = `DEFINE-SOLUTION`;
  analyzeImpact = `ANALYZE-IMPACT`;
  submitted: boolean;
  diaRevisions: any[];
  caseObjectLayout: CaseObjectLayout;
  isRightPanelOpen: boolean;
  saveDraftText: string;
  priorityStatus: string;
  parallelUpdateSubscription$: Subscription;
  initialSelectedTabIndex: number;
  changeRequestId: number;
  readOnlyFields: string[];
  writeAllowFields: string[];
  isRightSidePanelFormDirty: boolean;
  showMenuSubscriptions$: Subscription;
  fieldUpdateSubscriptions$: Subscription;
  caseObjectUpdateSubscriptions$: Subscription;
  caseObjectUpdatedDataSubscriptions$: Subscription;
  isExpanded: boolean;
  currentTabIndex: number;
  @ViewChild('crTabGroup') crTabGroup;
  errorTabs: number[];
  busyTabs: number[];
  fieldUpdateData: FieldUpdateData[];
  showCustomerImpactAlert: boolean;
  showDefineScopeAlert: boolean;
  isFormUpdated: boolean;
  isLinkedCNLoading: boolean;
  errorLevel: string;
  infoLevels = InfoLevels;
  mandatoryErrorFieldCount;
  errorFieldCount;
  activeTabSelected: number;
  addOfflineDecisionButtonStatus: string;
  expandTitlePanel: boolean;
  showPartsQuestion = false;
  showOtherPartsQuestions = false;
  decisionStatuses: {};
  crCasePermissions: {};
  caseObjectTabSubscription$: Subscription;
  AIRItems = [];
  PBSItem = [];
  wiCommentsData = [];
  currentStatusLabel: string;
  public crDetailsChange$: Subject<void> = new Subject<void>();
  readonly decisionsScrolled: Subject<void> = new Subject<void>();
  linkedSolutionItems: ImpactedItem[];
  problemItemsData: ImpactedItem[];
  selectedProblemItem: string;
  updateProjectPLFields: boolean;
  isObsoleteAllowed: boolean;

  constructor(public readonly appStore: Store<MyChangeState>,
              public dialog: MatDialog,
              public readonly userProfileService: UserProfileService,
              public readonly changeRequestService: ChangeRequestService,
              public readonly changeNoticeService: ChangeNoticeService,
              public readonly userAuthorizationService: UserAuthorizationService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly helpersService: HelpersService,
              public readonly router: Router,
              public readonly customAlert: MatSnackBar,
              public readonly cerberusService: CerberusService,
              public readonly sidePanelStore: Store<SidePanelState>,
              public readonly parallelUpdateStore: Store<ParallelUpdateState>,
              public readonly pageTitleService: PageTitleService,
              public readonly storeHelperService: StoreHelperService,
              public readonly mandatoryFieldTabMappingService: MandatoryFieldTabMappingService,
              public readonly impactedItemService: ImpactedItemService,
              public readonly userPermissionService: UserPermissionService,
              public readonly configurationService: ConfigurationService) {
    super(userProfileService, appStore);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.changeRequestConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0');
    this.deepLinkURL = this.configurationService.getLinkUrl('DIA-BOM-CR');
    this.pictureUrl = `${environment.rootURL}change-request-service/change-requests/documents`;
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest({}), []);
    this.changeRequestDocumentsFormGroup = this.mcFormGroupService.createChangeRequestDocumentFormGroup([]);
    this.caseActions = [];
    this.changeRequestFormSelectedTab = 0;
    this.isChangeNoticeListExist = true;
    this.tooltipText = 'Create an agenda Item for this ';
    this.previousStatus = [];
    this.mandatoryFields = [];
    this.readOnlyFields = [];
    this.diaRevisions = [];
    this.linkedSolutionItems = [];
    this.problemItemsData = [];
    this.solutionItemsCaseActionsList = [];
    this.changeObjectCaseActionsForCR = [];
    this.submitted = false;
    this.isRightPanelOpen = false;
    this.saveDraftText = 'save-draft';
    this.isRightSidePanelFormDirty = false;
    this.showCustomerImpactAlert = false;
    this.showDefineScopeAlert = false;
    this.isLinkedCNLoading = false;
    this.expandTitlePanel = true;
    this.isObsoleteAllowed = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeChangeRequestDetails(): void {
    zip(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      concatMap(paramsList => {
        const param = paramsList[0]['id'];
        this.param = param;
        this.showLoader = true;
        this.caseObject = new CaseObject(this.param, 'AA', 'ChangeRequest');
        return this.changeRequestService.getChangeRequestDetails$(param);
      }),
      map((changeRequest: ChangeRequest) => {
        this.showLoader = false;
        if (changeRequest) {
          this.changeRequestResponse = changeRequest;
          this.isCreatorCR = changeRequest.change_owner_type && changeRequest.change_owner_type.toUpperCase() === 'CREATOR';
          this.isProjectCR = changeRequest.change_owner_type === null || (changeRequest.change_owner_type && changeRequest.change_owner_type.toUpperCase() === 'PROJECT');
          this.getChangeRequestDocuments(parseInt(this.param, 10));
        }
      }),
      catchError(() => {
        this.showLoader = false;
        this.isProjectCR = true;
        return of([]);
      })).subscribe();
  }

  initializeChangeRequest(): void {
    this.caseObject = new CaseObject(this.param, '', 'ChangeRequest');
    this.getLinkedChangeNotice(this.param);
    this.getCasePermissions(parseInt(this.param, 10));
    // this.getImpactedItemCasePermissions();
    this.changeRequestFormGroup.get('id').setValue(parseInt(this.param, 10));
    const wiComment: any = {};
    if (this.changeRequestData && this.changeRequestData.contexts && this.changeRequestData.contexts.length > 0) {
      this.changeRequestData.contexts.forEach(context => {
        if (context.type === 'AIR') {
          this.AIRItems.push(context);
        } else if (context.type === 'PBS') {
          this.PBSItem.push(context);
        } else if (context.type === 'WI-COMMENT') {
          wiComment.id = context.context_id;
        } else if (context.type === 'AURORA') {
          wiComment.description = context.name;
        }
      });
      if (wiComment.id && wiComment.description) {
        this.wiCommentsData.push(wiComment);
        this.wiCommentsData = [...this.wiCommentsData];
      }
    }
    if (this.changeRequestData && this.changeRequestData.id) {
      this.changeRequestDetails = new ChangeRequest(this.changeRequestData);
      this.getDecisionButtonsStatus(JSON.stringify(this.changeRequestDetails.id), JSON.stringify(this.changeRequestDetails.status));
      if (this.changeRequestDetails && this.changeRequestDetails.status === 1) {
        this.showObsoleteButton(JSON.stringify(this.changeRequestDetails.id));
      }
      if (this.param && (this.param === 'air' || this.param === 'pbs')) {
        this.getCasePermissions(this.changeRequestData.id);
        this.changeRequestFormGroup.get('id').setValue(this.changeRequestData.id);
      }
      this.changeRequestId = this.changeRequestData.id;
      this.caseObject = new CaseObject(JSON.stringify(this.changeRequestData.id), '', 'ChangeRequest');
      this.isStatusApproved = (this.changeRequestData.status === 5);
      this.isFormUpdated = true;
      this.appStore.dispatch(loadCaseObject({caseObject: this.changeRequestData, caseObjectType: 'ChangeRequest'}));
      this.pageTitleService.getPageTitleObject('ChangeRequest', 'CR', this.changeRequestData.id,
        this.changeRequestData.title, '');
      this.crDetailsChange$.next();
    }
  }

  showObsoleteButton(crId) {
    this.isObsoleteAllowed = false;
    this.changeRequestService.getObsoleteButtonVisibility(crId).subscribe(res => {
      if (res) {
        this.isObsoleteAllowed = res['is_first_draft'] ? res['is_first_draft'] : false;
      }
    });
  }

  onTabBodyLoad() {
    this.currentTabIndex = this.crTabGroup.selectedIndex;
  }

  getImsTabSelected() {
    this.activatedRoute.params.subscribe(params => {
      this.activeTabSelected = params['tab'] ? params['tab'] : '';
    });
  }

  getLinkedChangeNotice(changeRequestId: string): void {
    this.isLinkedCNLoading = true;
    this.changeNoticeService.getLinkedChangeNotice$(changeRequestId, 'CHANGEREQUEST').subscribe({
      next: (ChangeNoticeSummaryElement) => {
        this.linkedChangeNotice = ChangeNoticeSummaryElement;
        this.isChangeNoticeListExist = !(Object.keys(this.linkedChangeNotice).length > 0);
        this.isLinkedCNLoading = false;
      },
      error: err => {
        if (err.status === 401) {
          this.isChangeNoticeListExist = false;
        }
        this.isLinkedCNLoading = false;
      }
    });
  }

  getCasePermissions(changeRequestId: number): void {
    if (changeRequestId) {
      this.mcState = this.userProfileService.getStatesData();
      this.openInMode = this.mcState.changeRequestState.airPbsDialogType;
      this.mcState.changeRequestState.airPbsDialogType = undefined;
      this.userProfileService.updateUserProfileStates(this.mcState);
      this.userAuthorizationService.getCasePermissionsById(changeRequestId, CaseObjectServicePath['ChangeRequest']).subscribe(res => {
        this.crCasePermissions = res;
        this.crDetailsChange$.next();
        this.setRightSideNavBar();
      }, () => {
        this.crCasePermissions = null;
        this.crDetailsChange$.next();
      });
    }
  }

  getChangeRequestDocuments(changeRequestId: number): void {
    const serviceList = [this.changeRequestService.getChangeRequestDocuments(changeRequestId, 'AS-IS-PICTURE'),
      this.changeRequestService.getChangeRequestDocuments(changeRequestId, 'TO-BE-PICTURE')];
    forkJoin(serviceList).subscribe(resList => {
      if (resList.length > 1) {
        this.changeRequestDocumentsFormGroup = this.mcFormGroupService.createChangeRequestDocumentFormGroup(resList);
      }
    });
  }

  getDecisionButtonsStatus(CRId?: string, status?: string) {
    if (!CRId) {
      CRId = this.changeRequestFormGroup.get('id').value;
      status = this.changeRequestFormGroup.get('status').value;
    }
    // When creating CN, CRID becomes undefined, below condition added to prevent service call
    if (CRId) {
      this.changeRequestService.getDecisionButtonStatus(CRId, status).subscribe(res => {
        this.decisionStatuses = res;
        this.addOfflineDecisionButtonStatus = res['offlineDecision'];
      });
    }
  }

  subscribeAppStore(): void {
    this.layoutSubscription$ = this.appStore.pipe(select(selectCaseObjectLayoutState)).subscribe((res: CaseObjectLayout) => {
      if (res) {
        this.caseObjectLayout = res;
      }
    });
    this.sideNavSubscription$ = this.sidePanelStore.pipe(select(selectRightNavBarState)).subscribe((res: NavBarPayload) => {
      if (res && res.hasOwnProperty('isOpen')) {
        this.isRightPanelOpen = res.isOpen.valueOf();
      }
      if (res && res.hasOwnProperty('isPanelFormDirty')) {
        this.isRightSidePanelFormDirty = res.isPanelFormDirty.valueOf();
      }
    });
    this.caseObjectUpdateSubscriptions$ = this.appStore.pipe(select(selectCaseObject)).subscribe((changeRequest) => {
      if (this.isFormUpdated) {
        this.isFormUpdated = false;
      } else if (changeRequest && changeRequest['id'] && typeof changeRequest === 'object' && Object.keys(changeRequest).includes('error')) {
        this.onChangeRequestUpdatedSuccessfully(this.changeRequestFormGroup.getRawValue());
      } else if (changeRequest && changeRequest['id'] && typeof changeRequest === 'object' && Object.keys(changeRequest).length > 0) {
        this.onChangeRequestUpdatedSuccessfully(changeRequest as ChangeRequest);
      }
    });
    this.subscribeToFieldUpdateStore();
  }

  subscribeToFieldUpdateStore() {
    this.fieldUpdateSubscriptions$ = this.appStore.pipe(select(selectAllFieldUpdates)).subscribe((fieldUpdateData: FieldUpdateData[]) => {
      if (fieldUpdateData) {
        this.fieldUpdateData = fieldUpdateData;
        this.showBusyErrorTabs();
      }
    });
  }

  getImpactedItemCasePermissions() {
    this.impactedItemService.getMandatoryProperties().subscribe(res => {
      if (res && res.length > 1) {
        const impactedItemCasePermissions = res;
        const caseAction = {};
        impactedItemCasePermissions.forEach((caseActionObj) => {
          caseAction[caseActionObj['case_action']] = caseActionObj['mandatory_properties_regexps'];
        });
        this.storeImpactedItemCaseActions(impactedItemCasePermissions);
      }
    });
  }

  storeImpactedItemCaseActions(caseActionsList: CaseActionElement[]) {
    const caseActionsAllowed = [];
    for (let count = 0; count < caseActionsList.length; count++) {
      caseActionsAllowed.push(new CaseAction(this.caseObject.ID, '',
        'ImpactedItem', caseActionsList[count]['is_allowed'], caseActionsList[count]['case_action'], caseActionsList[count]['mandatory_properties_regexps']));
    }
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  setRightSideNavBar() {
    if (this.caseObjectLayout && this.caseObjectLayout.showActionsPanel) {
      this.sidePanelStore.dispatch(setRightSideNavBar(true, 'actions'));
    } else {
      const navBarState = this.userProfileService.getStatesData().navBarState;
      if (navBarState.caseObjectNavBarState.length !== 0 && navBarState.caseObjectNavBarState.find(item => item.caseObjectType === 'ChangeRequest')) {
        const sidePanelObject = navBarState.caseObjectNavBarState.find(item => item.caseObjectType === 'ChangeRequest');
        if (sidePanelObject.isRightPanelOpen) {
          this.sidePanelStore.dispatch(setRightSideNavBar(true, sidePanelObject.rightPanelMode));
        }
      } else if (navBarState.isRightPanelOpen) {
        this.sidePanelStore.dispatch(setRightSideNavBar(true, navBarState.rightPanelMode));
      }
    }
  }

  getDIABOM(changeRequestId: string): void {
    this.cerberusService.getDIABOMDetails(changeRequestId, CaseObjectServicePath[this.caseObject.type])
      .subscribe((res) => {
        this.diabom = res;
      });
  }

  openDIABOM(dia): void {
    if (dia.revision === 'Working') {
      window.open(`${this.deepLinkURL}${this.changeRequestFormGroup.get('id').value}`, '_blank', '', false);
    } else {
      window.open(`${this.deepLinkURL}${this.changeRequestFormGroup.get('id').value}&revId=${dia.revision}`, '_blank', '', false);
    }
  }

  initializeChangeRequestWithCaseActions() {
    this.replaceObjectsIfExists(this.changeRequestDetails);
    const tempCaseActionsList = [];
    const caseAction = {};
    if (this.crCasePermissions['case_actions']) {
      this.crCasePermissions['case_actions'].forEach(caseActionObj => {
        if (this.isProjectCR && !(caseActionObj['filter'] && caseActionObj['filter'].includes('isCreatorTypeCR()'))) {
          tempCaseActionsList.push(caseActionObj);
          caseAction[caseActionObj['case_action']] = caseActionObj['mandatory_properties_regexps'];
        } else if (this.isCreatorCR && !(caseActionObj['filter'] && caseActionObj['filter'].includes('isProjectTypeCR()'))) {
          tempCaseActionsList.push(caseActionObj);
          caseAction[caseActionObj['case_action']] = caseActionObj['mandatory_properties_regexps'];
        }
      });
    }
    this.readOnlyFields = this.crCasePermissions['case_properties']['unupdatable_property_regexps'] || [];
    this.writeAllowFields = this.crCasePermissions['case_properties']['updatable_property_regexps'] || [];
    this.caseActions = Object.keys(caseAction);
    this.storeCaseActions(tempCaseActionsList);
    this.storeReadOnlyFields();
    this.storeWriteAllowFields();
    this.setMandatoryFields(this.helpersService.getNextStatus(this.changeRequestDetails.status));
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(
      new ChangeRequest(this.changeRequestDetails), this.mandatoryFields, this.readOnlyFields
    );
    this.currentStatusLabel = this.getStatusLabelFromStatus(this.changeRequestDetails.status);
    this.setProjectLeadFieldStatus();
    this.mcFormGroupService.checkAndSetCaseObjectsFieldsEnableState(this.changeRequestFormGroup, this.caseActions, false);
    this.setSelectedTabByChangeRequestType(this.changeRequestDetails);
  }

  replaceObjectsIfExists(changeRequest: ChangeRequest) {
    // if already set, take the value from form group, as the value is set in respective components
    changeRequest.project_id = this.changeRequestFormGroup.get('project_id').value || changeRequest.project_id;
    changeRequest.functional_cluster_id =
      (this.changeRequestFormGroup.get('functional_cluster_id').value && this.changeRequestFormGroup.get('functional_cluster_id').value.number) ?
        this.changeRequestFormGroup.get('functional_cluster_id').value : changeRequest.functional_cluster_id;
    changeRequest.project_lead = this.changeRequestFormGroup.get('project_lead').value || changeRequest['project_lead'];
    changeRequest.product_id = this.changeRequestFormGroup.get('product_id').value || changeRequest.product_id;
  }

  setProjectLeadFieldStatus() {
    if (!this.changeRequestFormGroup.get('project_id').value) {
      this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
        caseObject: this.caseObject, fieldId: 'projectLead', tab: 0, serviceStatus: FieldUpdateStates.success
      })));
    }
  }

  setSelectedTabByChangeRequestType(changeRequest: ChangeRequest): void {
    this.setFormSelectedTab(changeRequest.status);
    if (this.activeTabSelected) {
      this.changeRequestFormSelectedTab = this.activeTabSelected;
    }
  }

  setMandatoryFields(action?: string): void {
    // Set mandatory fields according to the regexps obtained from case permissions call, for CLOSE no mandatory_regexps are returned hence mapping previous state mandtory_regexps
    const caseAction = (action === 'CLOSE' ? 'APPROVE' : action) || '';
    this.appStore.pipe(select(selectMandatoryParameters,
      this.storeHelperService.getButtonSelector(this.caseObject.type, caseAction, String(this.caseObject.ID), ''))).subscribe((data) => {
      this.mandatoryFields = data;
    });
  }

  preProcessFormObject(changeRequest): void {
    changeRequest.project_id = changeRequest.project_id && (changeRequest.project_id.wbs_element || changeRequest.project_id.wbs_id || '');
    changeRequest.product_id = changeRequest.product_id && (changeRequest.product_id.project_definition || '');
    changeRequest.functional_cluster_id = changeRequest.functional_cluster_id && changeRequest.functional_cluster_id.number || '';
    changeRequest.notes = changeRequest && changeRequest.notes || [];
    const pbsIds = changeRequest.PBSIDs;
    if (pbsIds) {
      changeRequest.PBSIDs = pbsIds.filter((item, index, pbsIdList) => index === pbsIdList.findIndex((newItem) => (newItem.ID === item.ID)));
    }
    delete changeRequest.decisions;
  }

  onChangeRequestFormSubmit(action: string, changeRequestData?: any): void {
    this.submitted = (action.toLowerCase() !== 'save' && action.toLowerCase() !== this.saveDraftText &&
      action.toLowerCase() !== 'obsolete' &&
      action.toLowerCase() !== this.saveDraftText && action.toLowerCase() !== 'reject');
    if (!this.changeRequestFormGroup.valid) {
      this.setStatusForInValidControls();
    }
    if (this.changeRequestFormGroup.valid || (action.toLowerCase() === 'save' ||
      action.toLowerCase() === this.saveDraftText ||
      action.toLowerCase() === 'obsolete' || action.toLowerCase() === 'approve' ||
      action.toLowerCase() === this.saveDraftText || action.toLowerCase() === 'reject')) {
      const value = changeRequestData || this.changeRequestFormGroup.getRawValue();
      if (!changeRequestData) {
        this.preProcessFormObject(value);
      }
      this.showLoader = true;
      this.updateChangeRequestSubscription$ = this.changeRequestService.updateChangeRequest$(value.id, action).subscribe({
        next: res => {
          if (res) {
            this.crCasePermissions = res['case_permissions'];
            this.changeRequestDetails = value;
            this.changeRequestDetails.status = res['status'];
            this.changeRequestDetails.status_label = res['status_label'];
            this.currentStatusLabel = res['status_label'];
            if (action.toLowerCase() === 'reject') {
              this.changeRequestService.getChangeRequestDetails$(this.changeRequestDetails.id).subscribe(response => {
                if (response && response.id) {
                  this.changeRequestDetails = response;
                  this.initializeChangeRequestWithCaseActions();
                  this.onUpdateChangeRequest(this.changeRequestDetails);
                }
              });
            } else {
              this.initializeChangeRequestWithCaseActions();
              this.onUpdateChangeRequest(this.changeRequestDetails);
            }
          }
          this.appStore.dispatch(refreshNotificationsCount(true));
          this.showLoader = false;
        },
        error: err => {
          const errCode = this.helpersService.getErrorCode(err);
          if (errCode === 'ITEM-ERR-006') {
            this.impactedItemService.createItemContainer(JSON.stringify(this.changeRequestFormGroup.get('id').value), this.helpersService.getItemContainerPayload('ChangeRequest', this.changeRequestFormGroup.value)).subscribe(res => {
              if (res) {
                this.onChangeRequestFormSubmit('SUBMIT');
              }
            });
          }
          this.showLoader = false;
        }
      });
    } else {
      this.appStore.dispatch(userTouch(true));
      this.mandatoryFields.forEach((res) => {
        if (this.changeRequestFormGroup.get(res)) {
          this.changeRequestFormGroup.get(res).markAsTouched();
        }
      });
    }
  }

  setStatusForInValidControls(): void {
    const controls = this.changeRequestFormGroup.controls;
    const changeRequest = this.changeRequestFormGroup.getRawValue();
    const caseObject = new CaseObject(changeRequest.id, '', 'ChangeRequest');
    this.checkForControlValidity(controls, caseObject, this.changeRequestConfiguration);
    this.showDefineScopeAlert = !(this.changeRequestFormGroup.get('scope.parts').valid && this.changeRequestFormGroup.get('scope.tooling').valid
      && this.changeRequestFormGroup.get('scope.packaging').valid);
    this.customAlert.open('Status of CR not changed. Fill all required fields and try again', '', {duration: 2000});
  }

  checkForControlValidity(controls, caseObject, configuration) {
    for (const key in controls) {
      if (controls.hasOwnProperty(key) && controls[key] instanceof FormGroup && controls[key].invalid) {
        this.checkForControlValidity(controls[key].controls, caseObject, configuration[key]);
      } else if (controls[key].invalid) {
        this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
          caseObject: caseObject,
          fieldId: configuration[key].ID,
          tab: this.mandatoryFieldTabMappingService.getTabIndex(configuration[key].ID, 'ChangeRequest'),
          mandatoryState: FieldUpdateStates.error
        })));
      }
    }
  }

  onUpdateChangeRequest(changeRequest: ChangeRequest) {
    this.isFormUpdated = true;
    this.appStore.dispatch(loadCaseObject({caseObject: changeRequest, caseObjectType: 'ChangeRequest'}));
    this.onChangeRequestUpdatedSuccessfully(changeRequest);
  }

  onChangeRequestUpdatedSuccessfully(changeRequest: ChangeRequest) {
    this.changeRequestFormGroup.markAsPristine();
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest({}), []);
    if (changeRequest && changeRequest.id) {
      this.caseObject = new CaseObject(JSON.stringify(changeRequest.id), '', 'ChangeRequest');
    }
    this.changeRequestDetails = changeRequest;
    if (this.changeRequestDetails && this.changeRequestDetails.status === 1) {
      this.showObsoleteButton(JSON.stringify(this.changeRequestDetails.id));
    }
    this.getCasePermissions(changeRequest.id);
    this.getDecisionButtonsStatus(JSON.stringify(changeRequest.id), JSON.stringify(changeRequest.status));
    this.preSelectedAction = '';
    this.isStatusApproved = (changeRequest.status === 5);
    this.customAlert.open(`State ${this.getStatusByLabel(changeRequest.status)} for Change request with ID: `
      + `${changeRequest.id} updated successfully`, '', {duration: 2000});
    // this.getLinkedSolutionItems(JSON.stringify(changeRequest.id));
    if (changeRequest.status === 1 || changeRequest.status === 2) {
      this.userPermissionService.getMyTeamMembersByCaseObject$(JSON.stringify(changeRequest.id), CaseObjectServicePath['ChangeRequest']).subscribe(myTeamList => {
        const usersList = [];
        if (myTeamList && myTeamList.length > 0) {
          myTeamList.forEach(listItem => {
            if (listItem['user'] && listItem['user']['user_id']) {
              listItem['user']['roles'] = listItem['roles'] ? listItem['roles'] : [];
              usersList.push({'member': listItem});
            }
          });
        }
        const my_team = JSON.parse(JSON.stringify(this.changeRequestFormGroup.get('my_team').value));
        my_team.members = usersList;
        this.changeRequestFormGroup.get('my_team').patchValue(my_team);
      });
      // this.getLinkedProblemItems(JSON.stringify(changeRequest.id));
    }
  }

  getStatusByLabel(status) {
    const currentStatus = this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0',
      'status', status.toString(), 'label');
    return (currentStatus) ? currentStatus : status;
  }

  setFormSelectedTab(status: number): void {
    switch (status) {
      case 1:
        this.changeRequestFormSelectedTab = 0;
        break;
      case 2:
        this.changeRequestFormSelectedTab = 1;
        break;
      case 3:
        this.changeRequestFormSelectedTab = 2;
        break;
      case 4:
      case 5:
        this.changeRequestFormSelectedTab = 3;
        break;
      case 6:
      case 7:
        this.changeRequestFormSelectedTab = 4;
        break;
      default:
        this.changeRequestFormSelectedTab = 0;
        break;
    }
    this.initialSelectedTabIndex = this.changeRequestFormSelectedTab;
    this.appStore.dispatch(changeCaseObjectTabStatus({
      caseObject: 'ChangeRequest',
      currentTab: this.changeRequestFormSelectedTab
    }));
  }

  goToCreateChangeNotice(): void {
    this.showLoader = true;
    this.changeRequestService.getChangeRequestDetails$(this.changeRequestFormGroup.get('id').value).subscribe(crResponse => {
      if (crResponse && crResponse.id) {
        this.changeNoticeService.createChangeNotice$(this.getPayloadForCN(crResponse)).subscribe(res => {
          if (res) {
            this.showLoader = false;
            const cnId = res.ID;
            this.appStore.dispatch(loadCaseObject({caseObject: res, caseObjectType: 'ChangeNotice'}));
            this.router.navigate(['change-notices/' + res.ID]);
            /*this.changeNoticeService.createChangeObjectForCN(this.changeRequestDetails.id, cnId, 'ChangeRequest').subscribe(response => {
              if (response) {
                this.appStore.dispatch(loadCaseObject({caseObject: response, caseObjectType: 'ChangeNotice'}));
              } else {
                this.appStore.dispatch(loadCaseObject({caseObject: res, caseObjectType: 'ChangeNotice'}));
              }
              this.router.navigate(['change-notices/' + res.ID]);
            });*/
          } else {
            this.showLoader = false;
          }
        });
      } else {
        this.showLoader = false;
      }
    },
      error => {
        this.showLoader = false;
      });
  }

  updateChangeRequestToStatus(changeRequestID: number, action: string): any {
    this.changeRequestService.updateChangeRequestStatus$(changeRequestID, action).subscribe((changeRequest: ChangeRequest) => {
      if (changeRequest) {
        this.appStore.dispatch(loadCaseObject({caseObject: changeRequest, caseObjectType: 'ChangeRequest'}));
      }
    });
  }

  handleEnterKeyPress(event): boolean {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'textarea') {
      return false;
    }
    return true;
  }

  performCaseAction(caseAction: string): void {
    this.updateChangeRequestToStatus(this.changeRequestFormGroup.get('id').value, caseAction);
  }

  crLinkUnlinkEvent(event) {
    this.onUpdateChangeRequest(event);
  }

  changeNoticeUnLinkEvent(changeRequest: ChangeRequest) {
    this.onUpdateChangeRequest(changeRequest);
    this.getLinkedChangeNotice(JSON.stringify(changeRequest.id));
  }

  onSelectTab(event) {
    this.appStore.dispatch(changeCaseObjectTabStatus({
      caseObject: 'ChangeRequest',
      currentTab: event.index
    }));
    this.currentTabIndex = event.index;
    this.showBusyErrorTabs();
  }

  showBusyErrorTabs() {
    this.errorTabs = [];
    this.busyTabs = [];
    this.mandatoryErrorFieldCount = {};
    this.errorFieldCount = {};
    this.fieldUpdateData.forEach((field: FieldUpdateData) => {
      if (this.currentTabIndex !== field.tab && (field.serviceStatus === FieldUpdateStates.error || field.mandatoryState === FieldUpdateStates.error)) {
        if (field.mandatoryState === FieldUpdateStates.error) {
          this.mandatoryErrorFieldCount[field.tab] = this.mandatoryErrorFieldCount[field.tab] ? this.mandatoryErrorFieldCount[field.tab]++ : 1;
        } else if (field.serviceStatus === FieldUpdateStates.error) {
          this.errorFieldCount[field.tab] = this.errorFieldCount[field.tab] ? this.errorFieldCount[field.tab]++ : 1;
        }
        this.errorTabs.push(field.tab);
        this.errorLevel = (this.errorLevel === InfoLevels.ERROR) ? this.errorLevel : (field.errorInfo && field.errorInfo.severity === -2 ? InfoLevels.WARN : InfoLevels.ERROR);
      }
      if (this.currentTabIndex !== field.tab && field.serviceStatus === FieldUpdateStates.progress) {
        this.busyTabs.push(field.tab);
      }
    });
  }

  storeCaseActions(caseActionsList: CaseActionElement[]) {
    const caseActionsAllowed = [];
    for (let count = 0; count < caseActionsList.length; count++) {
      caseActionsAllowed.push(new CaseAction(this.caseObject.ID, '',
        'ChangeRequest', caseActionsList[count]['is_allowed'], caseActionsList[count]['case_action'], caseActionsList[count]['mandatory_properties_regexps']));
    }
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  storeReadOnlyFields() {
    const caseActionReadOnly = new CaseObjectReadOnly(
      String(this.caseObject.ID), '', 'ChangeRequest', this.readOnlyFields);
    this.appStore.dispatch(loadReadOnlyParameters({readOnlyParameters: [caseActionReadOnly]}));
  }

  storeWriteAllowFields() {
    const caseActionWriteOnly = new CaseObjectWriteOnly(
      String(this.caseObject.ID), '', 'ChangeRequest', this.writeAllowFields);
    this.appStore.dispatch(loadWriteAllowParameters({writeAllowParameters: [caseActionWriteOnly]}));
  }

  getErrorMessageOnTab(tabIndex: number) {
    const errorMessages = [];
    if (this.mandatoryErrorFieldCount[tabIndex]) {
      errorMessages.push(this.mandatoryErrorFieldCount[tabIndex] + (this.mandatoryErrorFieldCount[tabIndex] === 1 ? ' Required Field Empty' : ' Required Fields Empty'));
    }
    if (this.errorFieldCount[tabIndex]) {
      errorMessages.push(this.errorFieldCount[tabIndex] + (this.errorFieldCount[tabIndex] === 1 ? ' Update Failed' : ' Updates Failed'));
    }
    return errorMessages.join(',\n');
  }

  changeRequestDataChanged(data: ChangeRequest): void {
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(data), this.mandatoryFields, this.readOnlyFields);
  }

  onScrollDown() {
    if (this.changeRequestFormSelectedTab === 3) {
      this.decisionsScrolled.next();
    }
  }

  updateFormWithScopeData(data: ChangeRequest) {
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(data), this.mandatoryFields, this.readOnlyFields);
    this.showPartsQuestion = data['scope_fields_visibility_factor']['show_existing_part_question'];
    this.showOtherPartsQuestions = data['scope_fields_visibility_factor']['show_other_questions'];
  }

  onMyTeamListChange(myTeamList) {
    if (myTeamList) {
      this.changeRequestFormGroup.get('my_team').patchValue({
        ...this.changeRequestFormGroup.get('my_team').value,
        members: myTeamList
      });
    }
  }

  getStatusLabelFromStatus(status): string {
    if (status && this.changeRequestConfiguration) {
      return this.changeRequestConfiguration.status.options
        .filter((enumStatus) => JSON.stringify(status) === enumStatus.value)[0].label;
    }
  }

  getPayloadForCN(res: ChangeRequest) {
    const CCBList = [];
    const CBList = [];
    res.change_control_boards.forEach(ccb => {
      CCBList.push({'group': ccb, 'role': 'CCB'});
    });
    res.change_boards.forEach(cb => {
      CBList.push({'group': cb, 'role': 'CB'});
    });
    const groups = CBList.concat(CCBList);
    const users = this.processMyTeam(res.my_team);
    const CNElement = {
      contexts: {
        contextID: res.id,
        type: 'CHANGEREQUEST',
        status: res.status,
        name: res.title
      },
      generalInformation: {
        title: res.title,
        permissions: groups.concat(users)
      },
      productID: res.product_id,
      changeOwnerType: res.change_owner_type,
      changeOwner: new User(res.change_owner),
      projectID: res.project_id,
      changeSpecialist2: new User(res.change_specialist2),
      implementationPriority: res.implementation_priority,
      testAndReleaseStrategy: res.solution_definition.test_and_release_strategy,
      phaseOutSparesTools: res.impact_analysis.phase_out_spares_tools,
      phaseOutSparesToolsDet: res.impact_analysis.phase_out_spares_tools_details,
      customerImpact: res.impact_analysis.customer_impact.customer_impact_result,
      secure: res.is_secure,
      CBC: {
        risk: res.complete_business_case.risk,
        HWCommitment: res.complete_business_case.hardware_commitment,
        investments: {
          factoryInvestments: res.complete_business_case.factory_investments,
          FSToolingInvestments: res.complete_business_case.fs_tooling_investments,
          SCManagementInvestments: res.complete_business_case.supply_chain_management_investments,
          supplierInvestments: res.complete_business_case.supplier_investments,
          DEInvestments: res.complete_business_case.de_investments,
        },
        recurringCosts: {
          material: res.complete_business_case.material_recurring_costs,
          cycleTime: res.complete_business_case.cycle_time_recurring_costs,
          labor: res.complete_business_case.labor_recurring_costs
        },
        nonRecurringCosts: {
          inventoryReplaceExpense: res.complete_business_case.inventory_replace_nonrecurring_costs,
          inventoryScrapCosts: res.complete_business_case.inventory_scrap_nonrecurring_costs,
          supplyChainAdjustments: res.complete_business_case.supply_chain_adjustments_nonrecurring_costs,
          factoryChangeOrderCosts: res.complete_business_case.factory_change_order_nonrecurring_costs,
          fieldChangeOrderCosts: res.complete_business_case.field_change_order_nonrecurring_costs,
          updateUpgradeProductDocs: res.complete_business_case.update_upgrade_product_documentation_nonrecurring_costs,
          farmOutDevelopment: res.complete_business_case.farm_out_development_nonrecurring_costs,
          prototypeMaterials: res.complete_business_case.prototype_materials_nonrecurring_costs
        },
        benefits: {
          OPEXReductionFieldLabor: res.complete_business_case.opex_reduction_field_labor_benefits,
          OPEXReductionSpareParts: res.complete_business_case.opex_reduction_spare_parts_benefits,
          customerUptimeImpr: res.complete_business_case.customer_uptime_improvement_benefits,
          otherOPEXSavings: res.complete_business_case.other_opex_savings_benefits,
          revenues: res.complete_business_case.revenues_benefits
        },
        riskInLaborHours: res.complete_business_case.risk_in_labor_hours,
        financialSummary: {
          internalRateofReturn: res.complete_business_case.internal_rate_of_return,
          ExampleSavings: res.complete_business_case.example_savings,
          paybackPeriod: res.complete_business_case.payback_period,
          customerOpexSavings: res.complete_business_case.customer_opex_savings
        },
        systemStartsImpacted: res.complete_business_case.system_starts_impacted,
        systemsWIPFieldImpacted: res.complete_business_case.systems_in_wip_and_field_impacted,
        riskOnEOValue: res.complete_business_case.risk_on_excess_and_obsolescence,
        riskOnEORedProposal: res.complete_business_case.risk_on_excess_and_obsolescence_reduction_proposal,
        riskOnEORedPropCosts: res.complete_business_case.risk_on_excess_and_obsolescence_reduction_proposal_costs,
      },
      dependencies: {
        HWSWDependenciesAligned: res.solution_definition.hardware_software_dependencies_aligned,
        HWSWDepenAlignedDet: res.solution_definition.hardware_software_dependencies_aligned_details,
        functionalSWDependencies: res.solution_definition.functional_software_dependencies,
        functionalSWDepenDet: res.solution_definition.functional_software_dependencies_details,
        functionalHWDependencies: res.solution_definition.functional_hardware_dependencies,
        functionalHWDepenDet: res.solution_definition.functional_hardware_dependencies_details,
      },
      impactAnalysis: {
        upgradePackages: res.impact_analysis.upgrade_packages,
        productBaselinesAffected: res.solution_definition.products_affected,
        productionModAffected: res.solution_definition.products_module_affected,
        totalInstancesAffected: res.impact_analysis.total_instances_affected,
        upgradeTime: res.impact_analysis.upgrade_time,
        recoveryTime: res.impact_analysis.recovery_time,
        prePostConditions: res.impact_analysis.pre_post_conditions,
        impactOnSequence: res.impact_analysis.impact_on_sequence,
        impactOnSequenceDet: res.impact_analysis.impact_on_sequence_details,
        impactOnAvailability: res.impact_analysis.impact_on_availability,
        multiplantImpact: res.impact_analysis.multi_plant_impact,
        impactOnCycleTime: res.impact_analysis.impact_on_cycle_time,
        impactOnCycleTimeDetails: res.impact_analysis.impact_on_cycle_time_details,
        developmentLaborHours: res.impact_analysis.development_labor_hours,
        impactOnPreInstall: res.impact_analysis.preinstall_impact.preinstall_impact_result,
        investigationLaborHours: res.impact_analysis.investigation_labor_hours,
        impactOnLaborHours: window['isEnvironmentTST'] ? res.impact_analysis.impact_on_labor_hours : null,
        impactOnLaborHoursDet: window['isEnvironmentTST'] ? res.impact_analysis.impact_on_labor_hours_details : null,
        leadingNonLeading: res.impact_analysis.calendar_dependency,
        targetedValidConfig: res.impact_analysis.targeted_valid_configurations,
      },
      implementationRanges: res.impact_analysis.implementation_ranges,
      implementationRangesDet: res.impact_analysis.implementation_ranges_details,
      testAndReleaseStratDet: res.solution_definition.test_and_release_strategy_details,
      requirementsForImpPlan: res.requirements_for_implementation_plan,
      CBPStrategies: res.impact_analysis.cbp_strategies,
      CBPStrategiesDetails: res.impact_analysis.cbp_strategies_details,
      FCOTypes: res.impact_analysis.fco_types,
    };
    return this.helpersService.removeEmptyKeysFromObject(CNElement);
  }

  processMyTeam(data) {
    const userData: any[] = [];
    data.members.forEach(member => {
      const roleData = member.member.roles.join(',');
      if (member.member.roles.length > 1) {
        if (roleData.includes('changeOwner') || roleData.includes('changeSpecialist2') || roleData.includes('changeSpecialist1') || roleData.includes('submitterRequestor')) {
          const filteredRoles = member.member.roles.filter(role => (role !== 'changeOwner' && role !== 'changeSpecialist1' && role !== 'changeSpecialist2' && role !== 'submitterRequestor'));
          if (filteredRoles.length > 0) {
            userData.push({
              'user': new User(member.member.user),
              'roles': filteredRoles
            });
          }
        } else {
          userData.push({
            'user': new User(member.member.user),
            'roles': member.member.roles
          });
        }
      } else {
        if (!(roleData.includes('changeOwner') || roleData.includes('changeSpecialist2') || roleData.includes('changeSpecialist1') || roleData.includes('submitterRequestor'))) {
          userData.push({
            'user': new User(member.member.user),
            'roles': member.member.roles
          });
        }
      }
    });
    return userData;
  }

  getLinkedSolutionItems(id: string) {
    this.impactedItemService.getImpactedItems(id, 'scope-items', 'ChangeRequest').subscribe(res => {
      this.linkedSolutionItems = res;
      this.getChangeOwnerCaseActions(this.changeRequestFormGroup.get('id').value, 'CHANGEREQUEST');
      this.handleSolutionItemsCaseActions(res);
      const caseAction = {};
      const tempCaseActionsList = JSON.parse(JSON.stringify(res));
      tempCaseActionsList.forEach(item => {
        item['case_permissions']['case_actions'].forEach((caseActionObj) => {
          caseAction[caseActionObj['case_action']] = caseActionObj['is_allowed'];
        });
        this.solutionItemsCaseActionsList.push(caseAction);
      });
    });
  }

  getChangeOwnerCaseActions(caseObjectId, caseObjectType) {
    this.changeObjectCaseActionsForCR = [];
    this.impactedItemService.getChangeOwnerCaseAction(caseObjectId, caseObjectType).subscribe(res => {
      this.changeObjectCaseActionsForCR = JSON.parse(JSON.stringify(res));
    });
  }

  getLinkedProblemItems(id: string) {
    this.impactedItemService.getImpactedItems(id, 'problem-items', 'ChangeRequest').subscribe((res) => {
      this.problemItemsData = res;
      this.updateChangeOwner(this.problemItemsData);
    });
  }

  updateChangeOwner(problemItems) {
    const value = problemItems.filter(item => item.is_change_owner === true)[0];
    if (value && value.creators[0]) {
      this.changeRequestFormGroup.get('change_owner').setValue(value.creators[0]);
      this.selectedProblemItem = value.name ? value.name : '';
    }
  }

  handleSolutionItemsCaseActions(solutionItemsList: ImpactedItem[]) {
    for (let count = 0; count < solutionItemsList.length; count++) {
      this.linkedSolutionItems[count]['caseObject'] = new CaseObject(solutionItemsList[count].id.toString(), '', 'SolutionItem');
      this.storeSolutionItemsCaseActions(solutionItemsList[count]['case_permissions'], solutionItemsList[count].id.toString());
    }
  }

  storeSolutionItemsCaseActions(casePermissions: CasePermissions, solutionItemId: string) {
    const caseActionsAllowed = [];
    const caseActions: CaseActionDetail[] = casePermissions.case_actions;
    caseActions.forEach(caseAction => {
      caseActionsAllowed.push(new CaseAction(solutionItemId, '',
        'SolutionItem', caseAction.is_allowed, caseAction.case_action, caseAction.mandatory_properties_regexps));
    });
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  updateChangeOwnerField(event) {
    if (event && event.creators[0]) {
      this.changeRequestFormGroup.get('change_owner').setValue(event.creators[0]);
      this.selectedProblemItem = event.name ? event.name : '';
    }
  }

  getCrDetails(crId) {
    this.updateProjectPLFields = false;
    this.changeRequestService.fetchCrDetails(crId).subscribe(res => {
      this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(res), this.mandatoryFields, this.readOnlyFields);
      this.updateProjectPLFields = true;
      if (res.contexts && res.contexts.length > 0) {
        res.contexts.forEach(context => {
          if (context.type === 'AIR') {
            this.AIRItems.push(context);
          } else if (context.type === 'PBS') {
            this.PBSItem.push(context);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.appStore.dispatch(resetFieldData());
    this.appStore.dispatch(unloadCaseObject());
    this.appStore.dispatch(resetCaseObjectTabStatus());
    if (this.updateChangeRequestSubscription$) {
      this.updateChangeRequestSubscription$.unsubscribe();
    }
    if (this.layoutSubscription$) {
      this.layoutSubscription$.unsubscribe();
    }
    if (this.sideNavSubscription$) {
      this.sideNavSubscription$.unsubscribe();
    }
    if (this.parallelUpdateSubscription$) {
      this.parallelUpdateSubscription$.unsubscribe();
    }
    if (this.showMenuSubscriptions$) {
      this.showMenuSubscriptions$.unsubscribe();
    }
    if (this.fieldUpdateSubscriptions$) {
      this.fieldUpdateSubscriptions$.unsubscribe();
    }
    if (this.caseObjectUpdateSubscriptions$) {
      this.caseObjectUpdateSubscriptions$.unsubscribe();
    }
    if (this.caseObjectUpdatedDataSubscriptions$) {
      this.caseObjectUpdatedDataSubscriptions$.unsubscribe();
    }
  }
}
