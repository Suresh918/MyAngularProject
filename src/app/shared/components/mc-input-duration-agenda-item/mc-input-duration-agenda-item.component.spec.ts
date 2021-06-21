import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {MCInputDurationAgendaItemComponent} from './mc-input-duration-agenda-item.component';
import {metaReducers, reducers} from '../../../store';
import {MCInputDurationComponent} from '../mc-input-duration/mc-input-duration.component';
import {AgendaItemDurationChange} from '../../models/mc-store.model';
import {AgendaItemDetail} from '../../../agenda/agenda.model';

describe('MCInputDurationAgendaItemComponent', () => {
  let component: MCInputDurationAgendaItemComponent;
  let fixture: ComponentFixture<MCInputDurationAgendaItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputDurationAgendaItemComponent ],
      imports: [AALInputDurationModule, StoreModule.forRoot(reducers, {metaReducers}),
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputDurationAgendaItemComponent);
    component = fixture.componentInstance;
    component.startDateTime = new Date();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify stateDateTime when agendaItemStartTime is trigger', () => {
    component.agendaItemStartTime = '2020-04-30T06:30:00Z';
    expect(component.startDateTime.getDay()).toBe(4);
  });

  it('should call dispatchAgendaItemDurationChangeSuccessful when ngOnInit is trigger', () => {
    spyOn(component, 'dispatchAgendaItemDurationChangeSuccessful');
    component.dataUpdated$.next('test');
    component.ngOnInit();
    expect(component.dispatchAgendaItemDurationChangeSuccessful).toHaveBeenCalled();
  });

  it('should call super method saveFieldChanges on trigger onAcceptChange',  () => {
    spyOn(MCInputDurationComponent.prototype, 'saveFieldChanges');
    const $event = {ID: '1234', oldValue: 'test old', value: 'test'};
    component.onAcceptChange($event);
    expect(MCInputDurationComponent.prototype.saveFieldChanges).toHaveBeenCalled();
  });

  it('should call getDurationChange when triggered dispatchAgendaItemDurationChangeSuccessful',  () => {
    spyOn(component, 'getDurationChange');
    component.caseObject = {
      ID: '123456',
      type: 'ChangeRequest',
      revision: 'AA'
    };
    component.eventInProcess = {
      ID: '12345',
      value: 'test value',
      oldValue: 'old test value'
    };
    component.agendaSequence = 1;
    component.dispatchAgendaItemDurationChangeSuccessful();
    expect(component.getDurationChange).toHaveBeenCalled();
  });

  it( 'should return nothing when triggered onAgendaItemDurationChange',  () => {
    const agendaItemDurationChange:  AgendaItemDurationChange = {};
    expect(component.onAgendaItemDurationChange(agendaItemDurationChange)).toBeUndefined();
  });
  it('should set call startDateTime when trigger onAgendaItemDurationChange',  () => {
    spyOn(component, 'setNewTime');
    const agendaItemDurationChange:  AgendaItemDurationChange = {
      agendaItemID: '12345',
      agendaSequence: 1,
      changeInDurationOfAgendaItem: '1'
    };
    component.agendaSequence  = 4;
    component.onAgendaItemDurationChange(agendaItemDurationChange);
    expect(component.setNewTime).toHaveBeenCalled();
  });

  it('should set startDateTime of agendaItemData when setNewTime is triggered',  () => {
    component.startDateTime = new Date('2020-05-05T19:08:36.027Z');
    component.agendaItemData = {
      agenda: {},
      startDateTime: ''
    } as AgendaItemDetail;
    component.setNewTime('10');
    expect(component.agendaItemData.startDateTime).toBe('Tue, 05 May 2020 19:08:36 GMT');
  });

  it('should return changeInDuration when getDurationChange is triggered',  () => {
    component.eventInProcess = {
      oldValue : '2020-05-05T19:08:36.027Z',
      value: '2020-05-05T19:09:36.027Z',
      ID: '123456'
    };
    const returnValue = component.getDurationChange();
    expect(returnValue).toBe('P0D');
  });
});
