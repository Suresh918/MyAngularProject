/*
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';


import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {AgendaService} from '../../../core/services/agenda.service';
import {AgendaOverviewCardComponent} from './agenda-overview-card.component';
import {AgendaSummary} from '../../../shared/models/agenda.model';
import {Categories} from '../../../shared/models/mc-presentation.model';

describe('AgendaOverviewCardComponent', () => {
  let component: AgendaOverviewCardComponent;
  let fixture: ComponentFixture<AgendaOverviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaOverviewCardComponent],
      imports: [RouterTestingModule],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: AgendaService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit agendaItemClicked when onClickAgendaLabel is triggered', () => {
    spyOn(component.agendaItemClicked, 'emit');
    component.caseObject = {
      ID: '123',
      title: 'title',
      status: 'status',
      calendarID: '111',
      finishDate: new Date(),
      startDate: new Date(),
      createdBy: {
        userID: '123'
      }
    };
    component.onClickAgendaLabel();
    expect(component.agendaItemClicked.emit).toHaveBeenCalled();
  });

  it('should emit changeRadioButtonCaseObject when onSelectAgenda is triggered', () => {
    spyOn(component.changeRadioButtonCaseObject, 'emit');
    const $event = {value: 'sample data test'};
    component.onSelectAgenda();
    expect(component.changeRadioButtonCaseObject.emit).toHaveBeenCalled();
  });

  it('should emit agendaItemClicked when navigateToAgenda is triggered', () => {
    spyOn(component.agendaItemClicked, 'emit');
    component.showSelector = false;
    component.caseObject = {ID: '12345', calendarID: '123456'} as AgendaSummary;
    component.navigateToAgenda();
    expect(component.agendaItemClicked.emit).toHaveBeenCalled();
  });

  it('should emit changeRadioButtonCaseObject when navigateToAgenda is triggered', () => {
    spyOn(component.changeRadioButtonCaseObject, 'emit');
    component.showSelector = true;
    component.caseObject = {
      ID: '7125',
      calendarID: 'AAAYAGFuaWwua3VtYXItYWt2ZEBhc21sLmNvbQFRAAgI17Dg1akAAEYAAAAAcUrF6kyBc0CJWwCKNqDy/gcAwg3/fwShYke6yxdih0i2NQAAAJm69wAA7jHZ1lsyvEKRINFzfx4YygAA5Sk1cwAAEA==',
      startDate: new Date('2020-02-14T18:30:00+02:00'),
      title: 'Biggest CB Agenda',
      status: 'ASSIGNED',
      agendaItemCount: 40,
      createdBy: {
        userID: 'anikumar',
        fullName: 'Anil Kumar',
        email: 'anil.kumar-akvd@example.qas',
        abbreviation: 'AKVD',
        departmentName: 'IT Corporate Shared Services',
      },
      finishDate: new Date()
    };
    component.inputElement = {'checked': false};
    component.navigateToAgenda();
    expect(component.changeRadioButtonCaseObject.emit).toHaveBeenCalled();
  });

  it('should return agendaStatus when getAgendaStatusValueByName is triggered', () => {
    const returnValue = component.getAgendaStatusValueByName('text');
    expect(returnValue).toBe('Agenda Status');
  });

  it('should set agendaItemsOverviewData when agendaOverviewPanelOpened is triggered', () => {
    component.caseObject = {ID: '12345', calendarID: '123456'} as AgendaSummary;
    const event = {
      type: 'click',
      stopPropagation: function() {}
    };
    component.agendaOverviewPanelOpened(event);
    expect(component.agendaItemsOverviewData).toEqual({
      TotalItems: 9,
      categories: [{
        name: 'abc',
        subCategories: [{
          items: [{
            ID: '134'
          }]
        }],
        totalItems: 5
      }]
    } as Categories);
  });
});

class ServiceParametersServiceMock {
  getServiceParameterPropertyValueByName(service: string, category?: string, parameter?: string, name?: string) {
    return 'Agenda Status';
  }

  getAgendaItemsOverviewDetails(id: string) {
    return of({
      TotalItems: 9,
      categories: [{
        name: 'abc',
        subCategories: [{
          items: [{
            ID: '134'
          }]
        }],
        totalItems: 5
      }]
    });
  }
}
*/
