import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CreatorChangeRequestCIAComponent} from './creator-change-request-cia.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {of} from 'rxjs';

describe('ChangeRequestCustomerImpactAssessmentComponent', () => {
  let component: CreatorChangeRequestCIAComponent;
  let fixture: ComponentFixture<CreatorChangeRequestCIAComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorChangeRequestCIAComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {
          provide: ActivatedRoute, useValue: {
            params: of([{id: 1}]),
          }
        },
        {provide: ChangeRequestService, useValue: {}},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: Router, useValue: mockRouter},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: PageTitleService, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChangeRequestCIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MCFormGroupServiceMock {
  createChangeRequestFormGroup(data, mandatoryFieldsConfiguration, readOnlyFields?) {
    return new FormGroup({});
  }
}

class ConfigurationServiceMock {
  getFormFieldParameters(caseObject?, subObject1?) {
    return {};
  }
}

class UserProfileServiceMock {
  getStatesData() {
    return {
      changeRequestState: {
        ciaPageState: {
          fontSize: 'large',
          viewState: 'expanded'
        }
      }
    };
  }
}
