import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {ActivatedRoute, Params} from '@angular/router';
import {of} from 'rxjs';
import {MemoizedSelector, StoreModule} from '@ngrx/store';

import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {metaReducers, reducers, selectShowFullMenu} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequest} from '../../../shared/models/mc.model';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeRequestFormConfiguration} from '../../../shared/models/mc-configuration.model';
import {selectRightNavBarState} from '../../../side-panel/store';
import {ChangeRequestImplementationStrategyCoreComponent} from './change-request-implementation-strategy-core.component';
import {McStatesModel} from '../../../shared/models/mc-states-model';

describe('ChangeRequestImplementationStrategyCoreComponent', () => {
  let component: ChangeRequestImplementationStrategyCoreComponent;
  let fixture: ComponentFixture<ChangeRequestImplementationStrategyCoreComponent>;
  let mockStore: MockStore;
  let mockAppSelector: MemoizedSelector<MyChangeState, {}>;
  let mockSidePanelSelector: MemoizedSelector<SidePanelState, {}>;
  const tabGroup = jasmine.createSpyObj('MatTabGroup', ['realignInkBar']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestImplementationStrategyCoreComponent ],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef,  useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 1}),
          }
        },
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: PageTitleService, useClass: PageTitleServiceMock}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestImplementationStrategyCoreComponent);
    mockStore = TestBed.inject(MockStore);
    mockAppSelector = mockStore.overrideSelector(
      selectShowFullMenu, {showFullMenu: true}
    );
    mockSidePanelSelector = mockStore.overrideSelector(
      selectRightNavBarState, {rightNavBarState: {
          isOpen: false,
          panelMode: 'test',
          isPanelFormDirty: false}
      }
    );
    component = fixture.componentInstance;
    component.changeRequestData = {
      id: 123,
      status: 1
    };
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(123),
      status: new FormControl(1),
      impact_analysis: new FormGroup({
        customer_impact: new FormGroup({
          customer_impact_result: new FormControl('MINOR')
        }),
        cbp_strategies: new FormControl(['NA']),
        implementation_ranges: new FormControl('NA')
      }),
      solution_definition: new FormGroup({
        aligned_with_fo: new FormControl('YES'),
        aligned_with_fo_details: new FormControl('description')
      })
    });
    component.changeRequestConfiguration = {
      status: {
        options: [{
          label: 'Draft',
          value: '1'
        }]
      }
    } as ChangeRequestFormConfiguration;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call realignInkBar, when imsTabGroup exists and ngOnInit is triggered', () => {
    jasmine.clock().install();
    component.imsTabGroup = tabGroup;
    component.ngOnInit();
    jasmine.clock().tick(450);
    jasmine.clock().uninstall();
    expect(component.imsTabGroup.realignInkBar).toHaveBeenCalled();
  });
  it('should call updateUserProfileStates, when fonstSizeChanged is triggered', () => {
    spyOn(component.userProfileService, 'updateUserProfileStates');
    component.fontSizeChanged('large');
    expect(component.userProfileService.updateUserProfileStates).toHaveBeenCalledWith({
      changeRequestState: {
        imsPageState: {
          fontSize: 'large',
          viewState: 'expanded'
        }
      }
    } as McStatesModel);
  });
  it('should call updateUserProfileStates, when onLayoutChange is triggered', () => {
    spyOn(component.userProfileService, 'updateUserProfileStates');
    component.onLayoutChange('collapsed');
    expect(component.userProfileService.updateUserProfileStates).toHaveBeenCalledWith({
      changeRequestState: {
        imsPageState: {
          fontSize: 'small',
          viewState: 'collapsed'
        }
      }
    } as McStatesModel);
  });
  it('should navigate to CR details page, when editCaseObject is triggered', () => {
    spyOn(window, 'open');
    component.editCaseObject('1');
    expect(window.open).toHaveBeenCalledWith('/change-requests/123/1/IMS', '_blank');
  });
  it('should toggle showFullScreenButton value, toggleButton is triggered', () => {
    component.showFullScreenButton = false;
    component.toggleButton();
    expect(component.showFullScreenButton).toEqual(true);
  });
  it('should return label, when the control value is a string and getLabel is triggered', () => {
    const label = component.getLabel('impact_analysis.customer_impact.customer_impact_result');
    expect(label).toEqual('Minor');
  });
  it('should return label, when the control value is an Array and getLabel is triggered', () => {
    const label = component.getLabel('impact_analysis.cbp_strategies');
    expect(label).toEqual('None');
  });
  it('should return return empty, when changeRequestFormGroup doesnt have the control and getLabel is triggered', () => {
    component.changeRequestFormGroup = new FormGroup({});
    const label = component.getLabel('impact_analysis.customer_impact.customer_impact_result');
    expect(label).toEqual('');
  });
  it('should return description+Label, when getLabelAndDescription is triggered', () => {
    const label = component.getLabelAndDescription('solution_definition.aligned_with_fo', 'solution_definition.aligned_with_fo_details');
    expect(label).toEqual('Yes, description');
  });
  it('should return empty, when changeRequestFormGroup doesnt have the control and getLabelAndDescription is triggered', () => {
    component.changeRequestFormGroup = new FormGroup({});
    const label = component.getLabelAndDescription('solution_definition.aligned_with_fo', 'solution_definition.aligned_with_fo_details');
    expect(label).toEqual('');
  });
  it('should set isUpgradeExpanded as false, when checkImplementationRanges is triggered', () => {
    component.checkImplementationRanges(false);
    expect(component.isUpgradeExpanded).toEqual(false);
  });
  it('should set isUpgradeExpanded as true, when checkImplementationRanges is triggered', () => {
    component.changeRequestFormGroup.get('impact_analysis.implementation_ranges').patchValue('FCO');
    component.checkImplementationRanges(false);
    expect(component.isUpgradeExpanded).toEqual(true);
  });
  it('should set isUpgradeExpanded as true, when changeRequestFormGroup is undefined and checkImplementationRanges is triggered', () => {
    component.changeRequestFormGroup = undefined;
    component.checkImplementationRanges(false);
    expect(component.isUpgradeExpanded).toEqual(true);
  });
  it('should return statusLabel, when getStatusLabelFromStatus is triggered', () => {
    const statusLabel = component.getStatusLabelFromStatus(1);
    expect(statusLabel).toEqual('Draft');
  });
});

class ChangeRequestServiceMock {
  getChangeRequestDetails$(id) {
    return of({
      id: 1,
      change_owner_type: 'PROJECT',
      status: 1
    } as ChangeRequest);
  }
  getAirListOnCRID(id) {
    return of([{number: 1}]);
  }
  getPBSListOnCRID(id) {
    return of([{id: 1}]);
  }
}

class UserProfileServiceMock {
  getStatesData() {
    return {
      changeRequestState: {
        imsPageState: {
          fontSize: 'small',
          viewState: 'expanded'
        }
      }
    };
  }
  updateUserProfileStates() {

  }
}

class ConfigurationServiceMock {
  getFormFieldParameters(data) {
    return {
      status: {
        options: [{
          label: 'Draft',
          value: '1'
        }]
      }
    } as ChangeRequestFormConfiguration;
  }
  getFormFieldOptionDataByValue(caseObject, subObject1, subObject2, subObject2Parameter) {
    switch (subObject2) {
      case 'MINOR': return 'Minor';
      case 'NA': return 'None';
      case 'YES': return 'Yes';
    }
  }
}

class MCFormGroupServiceMock {
  createChangeRequestFormGroup(data, mandatory) {
    return new FormGroup({
      id: new FormControl(1),
      change_owner_type: new FormControl('PROJECT'),
      impact_analysis: new FormGroup({
        implementation_ranges: new FormControl('NA')
      })
    });
  }
}

class PageTitleServiceMock {
  getPageTitleObject() {

  }
}
