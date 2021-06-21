import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {ActivatedRoute, Params} from '@angular/router';
import {of} from 'rxjs';
import {MemoizedSelector, StoreModule} from '@ngrx/store';

import { ChangeRequestImplementationStrategyComponent } from './change-request-implementation-strategy.component';
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

describe('ChangeRequestImplementationStrategyComponent', () => {
  let component: ChangeRequestImplementationStrategyComponent;
  let fixture: ComponentFixture<ChangeRequestImplementationStrategyComponent>;
  let mockStore: MockStore;
  let mockAppSelector: MemoizedSelector<MyChangeState, {}>;
  let mockSidePanelSelector: MemoizedSelector<SidePanelState, {}>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestImplementationStrategyComponent ],
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
            params: of([{id: 1}]),
          }
        },
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: PageTitleService, useClass: PageTitleServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestImplementationStrategyComponent);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class ChangeRequestServiceMock {
  getChangeRequestDetails$(id) {
    return of({
      id: 1,
      change_owner_type: 'PROJECT'
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
}

class ConfigurationServiceMock {
  getFormFieldParameters(data) {
    return {
      status: {
        options: [{
          label: 'New',
          value: 'NEW'
        }]
      }
    } as ChangeRequestFormConfiguration;
  }
}

class MCFormGroupServiceMock {
  createChangeRequestFormGroup(data, mandatory) {
    return new FormGroup({
      id: new FormControl(1),
      change_owner_type: new FormControl('PROJECT')
    });
  }
}

class PageTitleServiceMock {

}
