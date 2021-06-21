import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';

import { MatDialogInputUserSearchComponent } from './mat-dialog-input-user-search.component';
import {metaReducers, reducers} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';



describe('MatDialogInputUserSearchComponent', () => {
  let component: MatDialogInputUserSearchComponent;
  let fixture: ComponentFixture<MatDialogInputUserSearchComponent>;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDialogInputUserSearchComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule,
        StoreModule.forRoot(reducers, { metaReducers })],
      providers: [FormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: UserProfileService, useClass: UserProfileServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogInputUserSearchComponent);
    component = fixture.componentInstance;
    component.usersControlConfiguration = {
      myTeam: {
        addMyTeamMember: 'test'
      }
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close ', () => {
    spyOn(component.dialogRef, 'close');
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should setUserList',  () => {
    spyOn(component.dialogRef, 'close');
    component.userSearchControl = new FormControl([{userID: 'user1'}, {userID: 'user2'}], []);
    component.setUserList();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
class UserProfileServiceMock {
  updateUserPermissions(string) {
    return of({test: 'test1'});
  }
}
