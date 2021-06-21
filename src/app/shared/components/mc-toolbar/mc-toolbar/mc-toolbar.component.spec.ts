import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCToolbarComponent } from './mc-toolbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../../store';
import {UserProfileService} from '../../../../core/services/user-profile.service';

describe('MCToolbarComponent', () => {
  let component: MCToolbarComponent;
  let fixture: ComponentFixture<MCToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCToolbarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserProfileService, useClass: UserProfileServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }
  getState() {
    return {changeRequestState: { imsPageState: {}}};
  }
}
