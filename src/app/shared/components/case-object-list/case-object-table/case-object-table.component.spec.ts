import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {Store, StoreModule} from '@ngrx/store';
import {By} from '@angular/platform-browser';

import {CaseObjectTableComponent} from './case-object-table.component';
import {metaReducers, reducers} from '../../../../store';
import {UserProfileService} from '../../../../core/services/user-profile.service';

describe('CaseObjectTableComponent', () => {
  let component: CaseObjectTableComponent;
  let fixture: ComponentFixture<CaseObjectTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CaseObjectTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTableModule, RouterTestingModule, RouterModule, MatMenuModule, HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers}), MatDialogModule],
      providers: [FormBuilder,
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {
          provide: Store,
          useValue: jasmine.createSpyObj('Store', ['dispatch', 'pipe']),
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectTableComponent);
    component = fixture.componentInstance;
    component.sort = fixture.debugElement.query(By.css('.mat-table')).nativeElement;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});

class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }

  getState() {
    return {};
  }

  getCaseObjectState() {
    return {};
  }
}
