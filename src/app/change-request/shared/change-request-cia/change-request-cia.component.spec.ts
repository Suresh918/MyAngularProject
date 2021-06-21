import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeRequestCIAComponent} from './change-request-cia.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ChangeRequestService} from '../../change-request.service';
import {of, Subject} from 'rxjs';
import {MCFormGroupService} from "../../../core/utilities/mc-form-group.service";
import {PageTitleService} from "../../../core/services/page-title.service";

describe('ChangeRequestCIAComponent', () => {
  let component: ChangeRequestCIAComponent;
  let fixture: ComponentFixture<ChangeRequestCIAComponent>;
  let params: Subject<Params>;
  beforeEach(async () => {
    params = new Subject<Params>();
    params.next({id: 1});
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestCIAComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
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
        {provide: PageTitleService, useClass: PageTitleServiceMock},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestCIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
