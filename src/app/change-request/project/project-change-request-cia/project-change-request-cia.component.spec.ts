import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectChangeRequestCIAComponent } from './project-change-request-cia.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {PageTitleService} from '../../../core/services/page-title.service';

describe('ProjectChangeRequestCIAComponent', () => {
  let component: ProjectChangeRequestCIAComponent;
  let fixture: ComponentFixture<ProjectChangeRequestCIAComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestCIAComponent ],
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
    fixture = TestBed.createComponent(ProjectChangeRequestCIAComponent);
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
