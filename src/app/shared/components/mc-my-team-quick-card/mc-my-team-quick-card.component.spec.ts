import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MemoizedSelector, StoreModule} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl, FormGroup} from '@angular/forms';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {of, Subscription} from 'rxjs';
import {Router} from '@angular/router';

import { MCMyTeamQuickCardComponent } from './mc-my-team-quick-card.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {UserPermissionService} from '../../../core/services/user-permission.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MyChangeState} from '../../models/mc-store.model';
import {metaReducers, reducers, selectCaseObject, selectFieldDataState} from '../../../store';

describe('MyTeamQuickCardComponent', () => {
  let component: MCMyTeamQuickCardComponent;
  let fixture: ComponentFixture<MCMyTeamQuickCardComponent>;
  let mockStore: MockStore;
  let mockCaseObjectSelector: MemoizedSelector<MyChangeState, {}>;
  let mockSelectFieldSelector: MemoizedSelector<MyChangeState, {}>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCMyTeamQuickCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALButtonOverlayTabbedModule, StoreModule.forRoot(reducers, {metaReducers}), RouterTestingModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: UserAuthorizationService, useClass: UserAuthorizationServiceMock},
        {provide: UserPermissionService, useClass: UserPermissionServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: StoreHelperService, useClass: StoreHelperServiceMock},
        {provide: Router, useValue: mockRouter},
        provideMockStore()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCMyTeamQuickCardComponent);
    mockStore = TestBed.inject(MockStore);
    mockCaseObjectSelector = mockStore.overrideSelector(
      selectCaseObject, {caseObject: {ID: '1234', revision: 'AA'}, caseObjectType: 'ChangeRequest'}
    );
    mockSelectFieldSelector = mockStore.overrideSelector(
      selectFieldDataState, {}
    );
    component = fixture.componentInstance;
    component.myTemCard = {
      nativeElement:  {
        offsetTop: '0'
      }
    };
    component.caseObjectDetailsSubscription$ = new Subscription();
    component.cs1ValueChangeSubscription$ = new Subscription();
    component.cs2ValueChangeSubscription$ = new Subscription();
    component.cs3ValueChangeSubscription$ = new Subscription();
    component.executorValueChangeSubscription$ = new Subscription();
    component.projectLeadValueChangeSubscription$ = new Subscription();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/

  /*it('should set formGroup ', () => {
    mockCaseObjectSelector.setResult({caseObject: {ID: '1234', revision: 'AA'}, caseObjectType: 'ChangeRequest'});
    mockStore.refreshState();
    component.formGroup = new FormGroup({
      ID: new FormControl('test'),
      changeBoard: new FormControl('CB'),
      changeControlBoard: new FormControl('CCB'),
      changeSpecialist1: new FormControl(''),
      changeSpecialist2: new FormControl(''),
      changeSpecialist3: new FormControl(''),
      executor: new FormControl(''),
      projectLead: new FormControl(''),
    });
    expect(component.subscribeToCaseObjectDetails).toHaveBeenCalled();
  });*/

  /*it ('should emit myTeamUsersList, when ngOnInit is triggered', () => {
    spyOn(component.myTeamUsersList, 'emit');
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectID = '1234';
    component.isListView = false;
    component.ngOnInit();
    expect(component.myTeamUsersList.emit).toHaveBeenCalled();
  });*/

  it ('should set yPosition, when ngAfterViewInit is triggered', () => {
    component.ngAfterViewInit();
    expect(component.yPosition).toEqual('above');
  });

  it ('should navigate to respective case object page, when navigateToMyMateView is triggered', () => {
    component.caseObjectID = '1234';
    component.caseObjectRouterPath = 'change-notices';
    component.navigateToMyMateView();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['my-team/change-notices/1234']);
  });

  /*it ('should display badgeData based on badgeCount', () => {
    component.usersList = [{user: {}}, {user: {}}];
    component.badgeCount = 10;
    component.isListView = true;
    component.helpText = 'Testing Help String $MYTEAM-COUNT';
    const res = component.getBadgeData();
    expect(res).toEqual(10);
  });*/

  /*it ('should display badgeData based on usersList', () => {
    component.usersList = [{user: {}}, {user: {}}];
    component.badgeCount = 0;
    component.isListView = false;
    component.helpText = 'Testing Help String $MYTEAM-COUNT Sample';
    const res = component.getBadgeData();
    expect(res).toEqual(2);
  });*/
});

class HelpersServiceMock {
  getCardVerticalPosition(p) {
    return 'above';
  }

}

class UserAuthorizationServiceMock {

}

class UserPermissionServiceMock {
  getPermissionListByCaseObject$(caseObjectID: string, caseObjectType: string, view: string) {
    return of([{
      addedToMyMates: true,
      user: {userId: '1234'},
      roles: ['test', 'test1']
    }, {
      addedToMyMates: true,
      user: {userId: '2345'},
      roles: ['test3']
    }]);
  }
}

class ServiceParametersServiceMock {
  getServiceParameter(service: string, category?: string, parameter?: string) {
    return [{name: 'test'}];
  }
  getCaseObjectMetaData(service, category) {
    return 'myTeamManagementFormConfiguration';
  }
}

class StoreHelperServiceMock {

}
