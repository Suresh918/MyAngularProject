import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {merge, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';

import {CaseObject, ChangeRequest} from '../../../shared/models/mc.model';
import {loadCaseObject} from '../../../store/actions/case-object.actions';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {environment} from '../../../../environments/environment';
import {ChangeRequestFormConfiguration} from '../../../shared/models/mc-configuration.model';
import {selectShowFullMenu, showFullMenu} from '../../../store';
import {selectRightNavBarState} from '../../../side-panel/store';
import {McStatesModel} from '../../../shared/models/mc-states-model';

@Component({
  selector: 'mc-change-request-implementation-strategy-core',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeRequestImplementationStrategyCoreComponent implements OnInit {

  changeRequestFormGroup: FormGroup;
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  changeRequestData: ChangeRequest;
  CRId: string;
  showLoader: boolean;
  elem: any;
  fontSize: string;
  mcState: McStatesModel;
  standardFontSize: string;
  viewState: string;
  pictureUrl: string;
  showFullScreenButton: boolean;
  isExpanded: boolean;
  showMenuSubscription$: Subscription;
  caseObject: CaseObject;
  @ViewChild('imsTabGroup') imsTabGroup;
  isUpgradeExpanded: boolean;
  AIRItems: any[];
  PBSItem: any[];
  currentStatusLabel: string;
  isCreatorCR: boolean;
  isProjectCR: boolean;

  constructor(public readonly userProfileService: UserProfileService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly changeRequestService: ChangeRequestService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly appStore: Store<MyChangeState>,
              public readonly configurationService: ConfigurationService,
              public readonly sidePanelStore: Store<SidePanelState>,
              public readonly pageTitleService: PageTitleService) {
    this.standardFontSize = 'small';
    this.isCreatorCR = false;
    this.isProjectCR = false;
    this.AIRItems = this.PBSItem = [];
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest({}), []);
    this.activatedRoute.params.pipe(filter((params) => {
        return 'id' in params;
      }),
      map((params) => {
        return params.id;
      }),
      distinctUntilChanged())
      .subscribe(id => {
        this.CRId = id;
        this.showLoader = true;
        this.changeRequestService.getChangeRequestDetails$(id).subscribe((res) => {
          this.changeRequestData = res;
          this.showLoader = false;
          this.isCreatorCR = res.change_owner_type && res.change_owner_type.toUpperCase() === 'CREATOR';
          this.isProjectCR = res.change_owner_type === null || (res.change_owner_type && res.change_owner_type.toUpperCase() === 'PROJECT');
          this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(this.changeRequestData), [], []);
          this.caseObject = new CaseObject(this.changeRequestFormGroup.getRawValue().id,
            this.changeRequestFormGroup.getRawValue().revision, 'ChangeRequest');
          this.currentStatusLabel = this.getStatusLabelFromStatus(this.changeRequestData.status);
          this.changeRequestService.getAirListOnCRID(id).subscribe(items => {
            this.AIRItems = items;
          });
          this.changeRequestService.getPBSListOnCRID(id).subscribe(item => {
            this.PBSItem = item;
          });

          this.pageTitleService.getPageTitleObject('ChangeRequest', 'IMS - CR-', this.changeRequestData.id,
            this.changeRequestData.title, '');
          this.appStore.dispatch(loadCaseObject({caseObject: res, caseObjectType: 'ChangeRequest'}));
          this.checkImplementationRanges(true);
        });
      });

    this.pictureUrl = `${environment.rootURL}change-request-service/change-requests/documents`;
    this.changeRequestConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0') as ChangeRequestFormConfiguration;
    this.isExpanded = true;
    this.getPreviousStoredStates();
  }

  ngOnInit() {
    this.showFullScreenButton = true;
    this.elem = document.documentElement;
    this.showMenuSubscription$ = merge(this.appStore.pipe(select(selectShowFullMenu)), this.sidePanelStore.pipe(select(selectRightNavBarState))).subscribe((res: Boolean) => {
      setTimeout(() => {
        if (this.imsTabGroup) {
          this.imsTabGroup.realignInkBar();
        }
      }, 400);
    });
  }

  getPreviousStoredStates() {
    this.mcState = this.userProfileService.getStatesData();
    this.fontSize = this.mcState.changeRequestState.imsPageState.fontSize || this.standardFontSize;
    this.viewState = this.mcState.changeRequestState.imsPageState.viewState || 'expanded';
    this.isExpanded = this.viewState === 'expanded';
  }

  fontSizeChanged(size) {
    this.fontSize = size;
    this.mcState.changeRequestState.imsPageState.fontSize = size;
    if (size !== this.standardFontSize) {
      this.appStore.dispatch(showFullMenu(false));
    }
    this.userProfileService.updateUserProfileStates(this.mcState);
  }

  onLayoutChange(selectedState) {
    this.viewState = selectedState;
    this.mcState.changeRequestState.imsPageState.viewState = selectedState;
    this.userProfileService.updateUserProfileStates(this.mcState);
    this.isExpanded = this.viewState === 'expanded';
    this.isUpgradeExpanded = this.isExpanded;
  }

  editCaseObject(value) {
    const url = '/change-requests/' + this.changeRequestData.id + '/' + value + '/IMS';
    window.open(url, '_blank');
  }

  toggleButton() {
    this.showFullScreenButton = !this.showFullScreenButton;
  }

  getLabel(parameter: string): string {
    if (this.changeRequestFormGroup && this.changeRequestFormGroup.get(parameter)) {
      const value = this.changeRequestFormGroup.get(parameter).value;
      let labelValue = '';
      if (value) {
        if (typeof value === 'string') {
          return this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0', parameter, value, 'label');
        }
        for (let count = 0; count < value.length; count++) {
          labelValue += this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0', parameter, value[count], 'label') + (count < value.length - 1 ? ', ' : '');
        }
        return labelValue || parameter;
      }
    }
    return '';
  }

  getLabelAndDescription(parameter: string, explainParameter: string): string {
    if (this.changeRequestFormGroup && this.changeRequestFormGroup.get(explainParameter)) {
      const explainValue = this.changeRequestFormGroup.get(explainParameter).value;
      const fieldValue = this.getLabel(parameter);
      return explainValue ? fieldValue + ', ' + explainValue : fieldValue;
    }
    return '';
  }

  checkImplementationRanges(isOnload: boolean) {
    if (this.changeRequestFormGroup) {
      const implementationRanges = this.changeRequestFormGroup.get('impact_analysis.implementation_ranges').value;
      if (!isOnload && implementationRanges && (implementationRanges.indexOf('NA') && implementationRanges.indexOf('SUPPLY-CHAIN')
        && implementationRanges.indexOf('BSNL-OR-CUSTOMER-STOCKS')) > -1) {
        this.isUpgradeExpanded = false;
      } else if (isOnload && implementationRanges && (implementationRanges.indexOf('NA') && implementationRanges.indexOf('SUPPLY-CHAIN')
        && implementationRanges.indexOf('BSNL-OR-CUSTOMER-STOCKS')) > -1) {
        this.isUpgradeExpanded = false;
      } else {
        this.isUpgradeExpanded = true;
      }
    } else {
      this.isUpgradeExpanded = true;
    }
  }

  getStatusLabelFromStatus(status): string {
    if (status && this.changeRequestConfiguration) {
      return this.changeRequestConfiguration.status.options
        .filter((enumStatus) => JSON.stringify(status) === enumStatus.value)[0].label;
    }
  }
}
