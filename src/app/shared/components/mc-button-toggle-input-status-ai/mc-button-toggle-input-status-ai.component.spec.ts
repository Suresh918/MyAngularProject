import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {of, throwError} from 'rxjs';
import {FormControl} from '@angular/forms';
import { McButtonToggleInputStatusAiComponent } from './mc-button-toggle-input-status-ai.component';
import {metaReducers, reducers} from '../../../store';
import {AgendaItem, CaseObject, Decision} from '../../models/mc.model';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {MCFieldCompositeComponent} from '../mc-field-composite/mc-field-composite.component';

describe('MCButtonToggleInputDecisionAIComponent', () => {
  let component: McButtonToggleInputStatusAiComponent;
  let fixture: ComponentFixture<McButtonToggleInputStatusAiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McButtonToggleInputStatusAiComponent ],
      providers: [
        {provide: AgendaItemService, useClass: AgendaItemServiceMock}
      ],
      imports: [AALButtonToggleInputModule, MatIconModule, AALButtonToggleModule, HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McButtonToggleInputStatusAiComponent);
    component = fixture.componentInstance;
    component['caseObject'] = new CaseObject('Decision', '', '');
    component.agendaItemData = {ID: 'string',
      generalInformation: {
        status: 'DISCUSSED'
      },
      purpose: 'string',
      category: 'string',
      subCategory: 'string',
      plannedDuration: 'string',
      agendaItem: {
        minutes: {
          conclusion: 'test'
        },
        generalInformation: {
          status: 'DISCUSSED'
        },
      }} as AgendaItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.descriptionControl = new FormControl({enable: () => {}});
    expect(component).toBeTruthy();
  });

  it('should set value for help when value is assign to control configuration', () => {
    component.descriptionControl = new FormControl({enable: () => {}});
    component.controlConfiguration = {enumeration: ['test', 'test1', 'test2'], help: 'test help message'};
    expect(component.help.message).toBe('test help message');
  });

  it('should call changeAgendaItemStatus when subscribeToStatusUpdates is triggered ', () => {
    spyOn(component, 'changeAgendaItemStatus');
    component.statusAcceptedChange = {oldValue: '', value: 'test', ID: 'test'};
    component.conclusionUpdated$.next('test');
    component.conclusionUpdateError$.next(new Info('test'));
    component.descriptionControl = new FormControl({enable: () => {}});
    component.secondaryControlOnlyUpdated$.next('test secondary control');
    expect(component.changeAgendaItemStatus).toHaveBeenCalled();
  });

  it('should call super method saveFieldChanges when trigger onAcceptStatusChanges',  () => {
    spyOn(MCFieldCompositeComponent.prototype, 'saveFieldChanges');
    component.selectControl = new FormControl('active');
    component.descriptionControl = new FormControl('test control value');
    component.descriptionControl = new FormControl({enable: () => {}});
    component.descriptionControlConfiguration = {ID: '1234', validator: 'test'};
    const $event: AcceptedChange = {ID: '1234', oldValue: 'test', value: 'test'};
    component.descriptionControl = new FormControl({enable: () => {}});
    component.conclusionUpdated$.next('test');
    component.conclusionUpdateError$.next(new Info('test'));
    component.onAcceptStatusChanges($event);
    expect(MCFieldCompositeComponent.prototype.saveFieldChanges).toHaveBeenCalled();
  });

  it('should emit bubbledAcceptChanges when changeAgendaItemStatus is trigger', () => {
    spyOn(component.bubbledAcceptChanges, 'emit');
    component.caseObject = {ID: '123456', revision: 'AA', type: 'ChangeRequest'};
    component.descriptionControl = new FormControl('testValue');
    component.descriptionControl = new FormControl({enable: () => {}});
    component.secondaryControlOnlyUpdated$.next('test');
    component.changeAgendaItemStatus('DISCUSSED');
    expect(component.bubbledAcceptChanges.emit).toHaveBeenCalled();
  });

  it('should performActionOnAgendaItem return error instead of success response when changeAgendaItemStatus is trigger', () => {
    component.caseObject = {ID: '12345', revision: 'AA', type: 'ChangeRequest'};
    component.descriptionControl = new FormControl({enable: () => {}});
    component.secondaryControlOnlyUpdated$.next('test');
    component.changeAgendaItemStatus('DISCUSSED');
    expect(component.statusError.message).toContain('myChange did not work as expected');
  });

  it('should call super method saveFieldChanges on trigger of onAcceptSecondaryControlChanges  ',  () => {
    spyOn(MCFieldCompositeComponent.prototype, 'saveFieldChanges');
    component.descriptionControl = new FormControl('test control value');
    component.descriptionControl = new FormControl({enable: () => {}});
    component.selectControl = new FormControl('DISCUSSED');
    component.descriptionControlConfiguration = {ID: 'test'};
    const $event = {ID: '123', oldValue: 'test old', value: 'test'};
    component.onAcceptSecondaryControlChanges($event);
    expect(MCFieldCompositeComponent.prototype.saveFieldChanges).toHaveBeenCalled();
  });

});
class AgendaItemServiceMock {
  performActionOnAgendaItem(id, state) {
    if (id === '12345') {
      return throwError({error: 'error'});
    } else {
      return of({agendaItem: 'test'});
    }
  }
}
