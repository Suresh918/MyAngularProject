import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import { MCToolbarFieldComponent } from './mc-toolbar-field.component';
import {metaReducers, reducers} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ChangeRequestState} from '../../models/mc-states-model';

describe('MCToolbarFieldComponent', () => {
  let component: MCToolbarFieldComponent;
  let fixture: ComponentFixture<MCToolbarFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCToolbarFieldComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserProfileService, useClass: UserProfileServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCToolbarFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isExpanded  to true on triggered onLayoutChange', () => {
    component.onLayoutChange('expanded');
    expect(component.isExpanded).toBe(true);
  });

  it('should call appStore dispatch when size and standardFontsize is not same', () => {
    spyOn(component.appStore, 'dispatch');
    component.mcState = {
      changeRequestState: {
        detailsPageState: {
          fontSize: '12',
          viewState: 'test'
        }
      } as ChangeRequestState
    };
    component.standardFontSize = '12';
    component.fontSizeChanged('14');
    expect(component.appStore.dispatch).toHaveBeenCalled();
  });
});
class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }
  getState() {
    return {};
  }
  updateUserProfileStates(state) {
    return {};
  }
}
