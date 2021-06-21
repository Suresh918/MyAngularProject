import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {of} from 'rxjs';

import {MCAddCbMeetingDialogComponent} from './mc-add-cb-meeting-dialog.component';
import {metaReducers, reducers} from '../../../store';
import {UserImagePipe} from '../../pipes/user-profile-img.pipe';
import {MCAutoCompleteUserMultipleComponent} from '../mc-auto-complete-user-multiple/mc-auto-complete-user-multiple.component';
import {AgendaService} from '../../../core/services/agenda.service';
import {AgendaItemService} from '../../../core/services/agenda-item.service';

describe('MCAddCbMeetingDialogComponent', () => {
  let component: MCAddCbMeetingDialogComponent;
  let fixture: ComponentFixture<MCAddCbMeetingDialogComponent>;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAddCbMeetingDialogComponent, WeekDayDateFormatPipeMock, UserImagePipeMock, MCAutoCompleteUserMultipleComponent, DateDisplayPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [InfiniteScrollModule, MatMenuModule, HttpClientModule, MatDialogModule, ReactiveFormsModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserImagePipe, useClass: UserImagePipeMock},
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: AgendaService, useClass: AgendaServiceMock},
        {provide: AgendaItemService, useClass: AgendaItemServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAddCbMeetingDialogComponent);
    component = fixture.componentInstance;
    component.sectionProgressBar = false;
    component.progressBar = true;
    component.sectionList = ['test'];
    component.caseObjectList = [{ID: 'string',
      title: 'string',
      status: 'string',
      calendarID: 'string',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {
        userID: 'string',
        fullName: 'string',
        email: 'string',
        abbreviation: 'string',
        departmentName: 'string'
      },
      agendaItemCount: 1,
      plannedDuration: 'string'}, {ID: 'string1',
      title: 'string',
      status: 'string',
      calendarID: 'string',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {
        userID: 'string',
        fullName: 'string',
        email: 'string',
        abbreviation: 'string',
        departmentName: 'string'
      },
      agendaItemCount: 1,
      plannedDuration: 'string'}];
    // fixture.detectChanges();
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAgendaOverviewList when ngAfterViewInit is triggered',  () => {
    jasmine.clock().install();
    spyOn(component, 'getAgendaOverviewList');
    component.userSearchControl = new FormControl([{}]);
    component.ngAfterViewInit();
    component.userSearchControl.setValue([{}]);
    fixture.detectChanges();
    jasmine.clock().tick(1100);
    fixture.detectChanges();
    jasmine.clock().uninstall();
    expect(component.getAgendaOverviewList).toHaveBeenCalled();
  });

  it('should set searchControlConfiguration when ngOnInit is triggered',  () => {
    component.ngOnInit();
    expect(component.userSearchControlConfiguration).toEqual({
      'ID': 'creatorSearch',
      'placeholder': 'Creator',
      'label': 'Creator',
      'help': 'Creator Search Help'
    });
  });

  it('should emit total no of agendas when getAgendaOverviewList is triggered',  () => {
    spyOn(component.resultsLengthChange, 'emit');
    component.getAgendaOverviewList();
    expect(component.resultsLengthChange.emit).toHaveBeenCalledWith(502);
  });

  it('should set section when getSectionDetails is triggered', () => {
    component.getSectionDetails('1234');
    expect(component.sectionList).toEqual([{count: '2',
      isUserDefined: true,
      name: 'Section 1'}, {count: '2',
      isUserDefined: true,
      name: 'Online'}, {count: '2',
      isUserDefined: true,
      name: 'offline'}]);
  });

  it('should close dialog when addToMeeting and agendaItemId is set',  () => {
    spyOn(component.dialogRef, 'close');
    const sectionItem = {name: 'Section Name'};
    const agenda = {ID: '123456',
      title: 'agenda title',
      status: 'open',
      calendarID: 'tdjnnbnmbvfe4dfdsfr43dfdsfdsf',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {},
      agendaItemCount: 120,
      plannedDuration: '10h',
      category: 'sectionItem'};
    component.data = {
      agendaItemId: '123456',
      type: 'Offline',
      changeRequestId: '1000123'
    };
    component.addToMeeting(agenda, sectionItem);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });


  it('should close dialog when addToMeeting and agendaItemId is not set',  () => {
    spyOn(component.dialogRef, 'close');
    const sectionItem = {name: 'Section Name'};
    const agenda = {ID: '123456',
      title: 'agenda title',
      status: 'open',
      calendarID: 'tdjnnbnmbvfe4dfdsfr43dfdsfdsf',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {},
      agendaItemCount: 120,
      plannedDuration: '10h',
      category: 'sectionItem'};
    component.data = {
      type: 'Closed',
      changeRequestId: '1000123'
    };
    component.addToMeeting(agenda, sectionItem);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should return agendaItemElement when triggered with agenda item and section', function () {
    const sectionItem = {name: 'Section Name'};
    const agenda = {ID: '123456',
      title: 'agenda title',
      status: 'open',
      calendarID: 'tdjnnbnmbvfe4dfdsfr43dfdsfdsf',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {},
      agendaItemCount: 120,
      plannedDuration: '10h',
      category: 'sectionItem'};
    component.data = {
      type: 'Online',
      changeRequestId: '1000123'
    };
    const returnValue = component.getAgendaItemElement(agenda, sectionItem);
    expect(returnValue).toEqual({ category: 'sectionItem', section: 'Section Name', purpose: 'ONLINE-DECISION' });
  });

  it('should close dialog',  () => {
    spyOn(component.dialogRef, 'close');
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call getAgendaOverviewList when onScrollDown is triggered',  () => {
    spyOn(component, 'getAgendaOverviewList');
    component.totalItems = 110;
    component.caseObjectList = [];
    component.lastUpdatedStartindex = 1;
    component.onScrollDown();
    expect(component.getAgendaOverviewList).toHaveBeenCalled();
  });


});
@Pipe({name: 'weekDayDateFormat'})
class WeekDayDateFormatPipeMock implements PipeTransform {
  transform(value) {
    return 'name(abbr)';
  }
}

@Pipe({name: 'userImage'})
class UserImagePipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '/image-url';
  }
}
@Pipe({name: 'aalDate'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
class AgendaServiceMock {
  getSectionDetails(agendaID) {
    return of([{count: '2',
      isUserDefined: true,
      name: 'Section 1'}, {count: '2',
      isUserDefined: true,
      name: 'Online'}, {count: '2',
      isUserDefined: true,
      name: 'offline'}]);
  }

  getAgendasList(param1, param2, listStartIndex, listSize, filterQuery, orderQuery) {
    return of({
      aggregatedAgendas: [{ID: '3177',
        agendaItemCount: 2,
        calendarID: 'AAAYAGFuaWwua3VtYXItYWt2ZEBhc21sLmNvbQFRAAgI2AKaEJ8AAEYAAAAAcUrF6kyBc0CJWwCKNqDy/gcAwg3/fwShYke6yxdih0i2NQAAAJm69wAA7jHZ1lsyvEKRINFzfx4YygACWBmsvwAAEA==',
        category: 'CB',
        createdBy: {userID: 'anikumar', fullName: 'Anil Kumar', email: 'anil.kumar-akvd@example.qas', abbreviation: 'AKVD', departmentName: 'IT Corporate Shared Services'},
        createdOn: '2020-05-05T19:08:36.027Z',
        finishDate: '2020-05-28T10:00:00+02:00',
        startDate: '2020-05-28T10:00:00+02:00',
        status: 'ASSIGNED',
        statusLabel: 'Linked',
        title: 'myChange Daily Standup'}],
      totalItems: 502
    });
  }


}
class AgendaItemServiceMock {
  updateOfflineAgendaItem(aggregatedElement, id) {
    return of({
      Offline: {
        agendaItemsOverview: [{
          agendaItemDetails: [{
            agendaItem: {
              ID: '123456'
            }
          }]
        }]
      }});
  }

  createAgendaItem() {
    return of({
      Online: {
        agendaItemsOverview: [{
          agendaItemDetails: [{
            agendaItem: {
              ID: '123456'
            }
          }]
        }]
      }});
  }
}
