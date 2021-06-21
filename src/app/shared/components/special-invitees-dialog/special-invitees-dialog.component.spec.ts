import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {of} from 'rxjs';

import { SpecialInviteesDialogComponent } from './special-invitees-dialog.component';
import {UserImagePipe} from '../../pipes/user-profile-img.pipe';
import {metaReducers, reducers} from '../../../store';
import {AgendaService} from '../../../core/services/agenda.service';
import {AgendaItemService} from '../../../core/services/agenda-item.service';

describe('SpecialInviteesDialogComponent', () => {
  let component: SpecialInviteesDialogComponent;
  let fixture: ComponentFixture<SpecialInviteesDialogComponent>;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialInviteesDialogComponent, UserImagePipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserImagePipe  , useClass: UserImagePipeMock},
        {provide: MatDialogRef, useValue: dialogMock },
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: AgendaService, useClass: AgendaServiceMock},
        {provide: AgendaItemService, useClass: AgendaItemServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialInviteesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.dialogRef.close();
  });

  it('should call fetchAttendees on initialization',  () => {
    spyOn(component, 'fetchAttendees');
    component.data = {displayAttendees: true};
    component.ngOnInit();
    expect(component.fetchAttendees).toHaveBeenCalled();
  });

  it('should be length of currentInviteesCount greater then zero when fetchAttendees is triggered', () => {
    component.data = {ID: '1234'};
    component.fetchAttendees();
    expect(component.currentInviteesCount).toBeGreaterThan(0);
  });

  it('should be length of currentInviteesCount greater then zero when onUserSelect is triggered',  () => {
    const data = {};
    component.currentInvitees = [{
      userID: 'string',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }];
    component.onUserSelect(data);
    expect(component.currentInviteesCount).toBeGreaterThan(0);
  });

  it('should close the dialog', () => {
    const dialogCloseSpy = spyOn(component.dialogRef, 'close');
    fixture.detectChanges();
    component.close();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  it('should set true for showAddSection', () => {
    component.showAddSection = false;
    component.onAddPress();
    expect(component.showAddSection).toBe(true);
  });

  it('should call resetSearchControl if isSameSetOfUsers found when onSave is triggered', () => {
    spyOn(component, 'resetSearchControl');
    component.currentInvitees = [{
      userID: 'string',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }];
    component.onSave();
    expect(component.resetSearchControl).toHaveBeenCalled();
  });

  it('should be greater then zero for currentInviteesCount when onSave is triggered',  () => {
    component.currentInvitees = [{
      userID: 'string',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }];
    component.userSearchControl.setValue([{
      userID: '1234User',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }]);
    component.onSave();
    expect(component.currentInviteesCount).toBeGreaterThan(0);
  });

  it('should update the count of currentInviteesCount when onDeleteInvitee is triggered', () => {
    component.data = {ID: '12345'};
    component.currentInvitees = [{
      userID: 'string',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }, {
      userID: '1234User',
      fullName: 'string',
      email: 'string@email.com',
      abbreviation: 'string',
      departmentName: 'string'
    }];
    component.onDeleteInvitee(0);
    expect(component.currentInviteesCount).toBe(1);
  });

});
@Pipe({name: 'userImage'})
class UserImagePipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '/image-url';
  }
}

class AgendaServiceMock {
  getSpecialInvitees() {
    return of({});
  }
  addSpecialInvitee() {
    return of({});
  }
  deleteSpecialInvitee() {
    return of({});
  }
}

class AgendaItemServiceMock {
  getAgendaItemAttendees(ID, isLookupRequired) {
    return of({selectedAttendeesCount: 5, selected: { Attendees: [{UserElement: {test: 'test'}}]}});
  }
}
