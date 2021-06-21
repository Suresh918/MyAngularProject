import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MemoizedSelector, StoreModule} from '@ngrx/store';

import {UserProfileService} from '../../../core/services/user-profile.service';
import {ChangeRequestService} from '../../change-request.service';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';
import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CerberusService} from '../../../core/services/cerberus.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MandatoryFieldTabMappingService} from '../../../core/utilities/mandatory-field-tab-mapping.service';
import {UserPermissionService} from '../../../core/services/user-permission.service';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {
  metaReducers,
  reducers,
  selectAllFieldUpdates,
  selectCaseObject,
  selectCaseObjectLayoutState,
  selectCaseObjectTabStatus,
  selectShowFullMenu
} from '../../../store';
import {selectRightNavBarState} from '../../../side-panel/store';
import {ProjectChangeRequestDetailsComponent} from './project-change-request-details.component';


describe('ProjectChangeRequestDetailsComponent', () => {
  let component: ProjectChangeRequestDetailsComponent;
  let fixture: ComponentFixture<ProjectChangeRequestDetailsComponent>;
  let mockStore: MockStore;
  let mockCaseObjectLayoutSelector: MemoizedSelector<MyChangeState, {}>;
  let mockCaseObjectSelector: MemoizedSelector<MyChangeState, {}>;
  let mockAllFieldUpdatesSelector: MemoizedSelector<MyChangeState, {}>;
  let mockRightNavBarSelector: MemoizedSelector<SidePanelState, {}>;
  let mockUsernameSelector: MemoizedSelector<MyChangeState, Boolean>;
  let mockCaseObjectTabStatusSelector: MemoizedSelector<MyChangeState, {}>;
  const tabGroup = jasmine.createSpyObj('MatTabGroup', ['realignInkBar']);
  const mockRouter = {
    routeReuseStrategy: {},
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectChangeRequestDetailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, MatSnackBarModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: Router, useValue: mockRouter},
        {
          provide: ActivatedRoute, useValue: {
            params: of([{id: 1}]),
            routeReuseStrategy: {}
          }
        },
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: ChangeNoticeService, useClass: ChangeNoticeServiceMock},
        {provide: UserAuthorizationService, useClass: UserAuthorizationServiceMock},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: CerberusService, useClass: CerberusServiceMock},
        {provide: PageTitleService, useClass: PageTitleServiceMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: StoreHelperService, useClass: StoreHelperServiceMock},
        {provide: MandatoryFieldTabMappingService, useClass: MandatoryFieldTabMappingServiceMock},
        {provide: UserPermissionService, useClass: UserPermissionServiceMock},
        {provide: ImpactedItemService, useClass: ImpactedItemServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestDetailsComponent);
    mockStore = TestBed.inject(MockStore);
    mockCaseObjectLayoutSelector = mockStore.overrideSelector(selectCaseObjectLayoutState, {});
    mockCaseObjectSelector = mockStore.overrideSelector(selectCaseObject, {});
    mockAllFieldUpdatesSelector = mockStore.overrideSelector(selectAllFieldUpdates, []);
    mockRightNavBarSelector = mockStore.overrideSelector(selectRightNavBarState, {});
    mockUsernameSelector = mockStore.overrideSelector(selectShowFullMenu, true);
    mockCaseObjectTabStatusSelector = mockStore.overrideSelector(selectCaseObjectTabStatus, {currentTab: 0});
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(1)
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call realignInkBar, when ngOnInit is triggered', () => {
    component.crTabGroup = tabGroup;
    jasmine.clock().install();
    component.ngOnInit();
    jasmine.clock().tick(650);
    jasmine.clock().uninstall();
    expect(component.crTabGroup.realignInkBar).toHaveBeenCalled();
  });
  it('should call replaceObjectsIfExists, when crCasePermissions is empty and crDetailsChange$ subscription is triggered', () => {
    spyOn(component, 'replaceObjectsIfExists');
    component.changeRequestDetails = {};
    component.crCasePermissions = {};
    component.crTabGroup = tabGroup;
    jasmine.clock().install();
    component.ngOnInit();
    jasmine.clock().tick(650);
    jasmine.clock().uninstall();
    component.crDetailsChange$.next();
    fixture.detectChanges();
    expect(component.replaceObjectsIfExists).toHaveBeenCalled();
  });
  it('should call initializeChangeRequestWithCaseActions, when crCasePermissions exists and crDetailsChange$ subscription is triggered', () => {
    spyOn(component, 'initializeChangeRequestWithCaseActions');
    component.changeRequestDetails = {};
    component.crCasePermissions = {case_actions: []};
    component.crTabGroup = tabGroup;
    jasmine.clock().install();
    component.ngOnInit();
    jasmine.clock().tick(650);
    jasmine.clock().uninstall();
    component.crDetailsChange$.next();
    fixture.detectChanges();
    expect(component.initializeChangeRequestWithCaseActions).toHaveBeenCalled();
  });
  it('should emit updateChangeRequestView, when updateCRView is triggered', () => {
    spyOn(component.updateChangeRequestView, 'emit');
    component.updateCRView({});
    expect(component.updateChangeRequestView.emit).toHaveBeenCalled();
  });
  it('should return a value, when canDeactivate is triggered', () => {
    const returnValue = component.canDeactivate();
    expect(returnValue).toEqual(true);
  });
});

class UserProfileServiceMock {
  getStatesData() {
    return {
      changeRequestState: {
        airPbsDialogType: undefined
      },
      navBarState: {

      }
    };
  }
  updateUserProfileStates(state) {

  }
}

class ChangeRequestServiceMock {

}

class ChangeNoticeServiceMock {
  getLinkedChangeNotice$(id, caseObjectType) {
    return of({});
  }
}

class UserAuthorizationServiceMock {
  getCasePermissionsById(id, path) {
    return of ({});
  }
}

class MCFormGroupServiceMock {
  createChangeRequestFormGroup(data, mandatoryParams) {
    return new FormGroup({id: new FormControl(1)});
  }

  createChangeRequestDocumentFormGroup(data) {
    return new FormGroup({});
  }

  checkAndSetCaseObjectsFieldsEnableState(FormGroup, caseActions, flag) {

  }
}

class HelpersServiceMock {

}

class PageTitleServiceMock {

}

class ConfigurationServiceMock {
  getFormFieldParameters(caseObject) {
    return {};
  }

  getLinkUrl(linkName) {
    return '';
  }
}

class StoreHelperServiceMock {

}

class MandatoryFieldTabMappingServiceMock {

}

class UserPermissionServiceMock {

}

class ImpactedItemServiceMock {

}

class CerberusServiceMock {

}


