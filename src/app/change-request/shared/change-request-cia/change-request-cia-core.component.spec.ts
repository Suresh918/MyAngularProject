import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ActivatedRoute, Params, Router, RouterModule} from '@angular/router';
import {ChangeRequestService} from '../../change-request.service';
import {of, Subject} from 'rxjs';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequestCIACoreComponent} from './change-request-cia-core.component';
import {RouterTestingModule} from '@angular/router/testing';
import {McStatesModel} from '../../../shared/models/mc-states-model';

describe('ChangeRequestCIACoreComponent', () => {
  let component: ChangeRequestCIACoreComponent;
  let fixture: ComponentFixture<ChangeRequestCIACoreComponent>;
  let params: Subject<Params>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(async () => {
    params = new Subject<Params>();
    params.next({id: 1});
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestCIACoreComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, RouterModule, RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 1}),
          }
        },
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: PageTitleService, useClass: PageTitleServiceMock},
        {provide: Router, useValue: mockRouter},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestCIACoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateUserProfileStates, when onLayoutChange is triggered', () => {
    spyOn(component.userProfileService, 'updateUserProfileStates');
    component.onLayoutChange('collapsed');
    expect(component.userProfileService.updateUserProfileStates).toHaveBeenCalledWith({
      changeRequestState: {
        ciaPageState: {
          fontSize: 'small',
          viewState: 'collapsed'
        }
      }
    } as McStatesModel);
  });

  it('should call updateUserProfileStates, when fonstSizeChanged is triggered', () => {
    spyOn(component.userProfileService, 'updateUserProfileStates');
    component.fontSizeChanged('large');
    expect(component.userProfileService.updateUserProfileStates).toHaveBeenCalledWith({
      changeRequestState: {
        ciaPageState: {
          fontSize: 'large',
          viewState: 'expanded'
        }
      }
    } as McStatesModel);
  });

  it('should change toggle button, when it is click', () => {
    component.toggleButton();
    expect(component.showFullScreenButton).toBe(false);
  });

  it('should navigate when editCaseObject is triggered',  () => {
    component.changeRequestData = {id: 123};
    component.editCaseObject();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/change-requests/123']);
  });
});

class ChangeRequestServiceMock {
  getReadOnlyCIAData(id) {
    return of({
      change_request: {
        id: 123456,
        revision: 'string',
        contexts: [],
        title: 'string',
        status: 'active',
        status_label: 'status',
        change_owner_type: 'CREATOR'
      }
    });
  }
}

class PageTitleServiceMock {
  getPageTitleObject() {
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

class UserProfileServiceMock {
  getStatesData() {
    return {
      changeRequestState: {
        ciaPageState: {
          fontSize: 'small',
          viewState: 'expanded'
        }
      }
    };
  }
  updateUserProfileStates() {

  }
}
