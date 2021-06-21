import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {of, Subject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MemoizedSelector, StoreModule} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';


import {UserProfileService} from '../../../core/services/user-profile.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ChangeRequestService} from '../../change-request.service';
import {metaReducers, reducers, selectShowFullMenu} from '../../../store';
import {FormsConfigurationService} from '../../../core/services/configurations/services/forms-configuration.service';
import {selectNavBarState} from '../../../side-panel/store';
import {MyChangeState, NavBarPayload, NavBarState} from '../../../shared/models/mc-store.model';
import {CreatorImplementationStrategyComponent} from './creator-implementation-strategy.component';



describe('ImplementationStrategyComponent', () => {
  let component: CreatorImplementationStrategyComponent;
  let fixture: ComponentFixture<CreatorImplementationStrategyComponent>;
  let params: Subject<Params>;
  let mockStore: MockStore;
  let mockUsernameSelector: MemoizedSelector<MyChangeState, Boolean>;
  let mockNavBarSelector: MemoizedSelector<NavBarState, {}>;
  beforeEach(waitForAsync(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [ CreatorImplementationStrategyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: ActivatedRoute, useValue: {params: params}},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: FormsConfigurationService, useClass: FormsConfigurationServiceMock},
        {provide: MatDialogRef,  useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorImplementationStrategyComponent);
    mockStore = TestBed.inject(MockStore);
    mockUsernameSelector = mockStore.overrideSelector(
      selectShowFullMenu,
      true
    );
    mockNavBarSelector = mockStore.overrideSelector(
      selectNavBarState,
      {
        'leftNavBarState': {
          'isOpen': false,
          'panelMode': '',
          'isPanelFormDirty': false
        } as NavBarPayload,
        'rightNavBarState': {
          'isOpen': true,
          'panelMode': '',
          'isPanelFormDirty': false
        } as NavBarPayload,
      }
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
class UserProfileServiceMock {
  getState() {
    return {
      myTeamManagementState: {
        commonCaseObjectState: {
          filters: {
            filtersModel: {
              currentDefaultFilter: {
                people: {}
              }
            }
          }
        }
      }
    };
  }

  updateUserProfileStates(state) {
    return {};
  }

  updateCaseObjectSortInState(sort, filterObject, isOverviewType) {
    return {};
  }

  getStatesData() {
    return {
      changeRequestState: {
        imsPageState: {
          fontSize: '12px',
          viewState: 'active'
        },
      },
    };
  }
}
class ServiceParametersServiceMock {
  getCaseObjectMetaData(service, category) {
    return 'myTeamManagementFormConfiguration';
  }
}
class ChangeRequestServiceMock {
  getChangeRequestDetails$(id) {
    return of({
      id: 123456,
      revision: 'string',
      contexts: [],
      title: 'string',
      status: 'active',
      status_label: 'status'
    });
  }
}

class FormsConfigurationServiceMock {
  createChangeRequestFormGroup(changeRequestOj, emptyArray1, emptyArray2) {
    return {};
  }
  getFormParameters(caseObject) {
    return {};
  }
}
