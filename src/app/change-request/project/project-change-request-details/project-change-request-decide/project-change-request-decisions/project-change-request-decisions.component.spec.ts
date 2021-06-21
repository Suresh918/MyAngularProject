import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {ProjectChangeRequestDecisionsComponent} from './project-change-request-decisions.component';
import {AgendaItemDetail} from '../../../../../agenda/agenda.model';


describe('ProjectChangeRequestDecisionsComponent', () => {
  let component: ProjectChangeRequestDecisionsComponent;
  let fixture: ComponentFixture<ProjectChangeRequestDecisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectChangeRequestDecisionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: {} },
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit getAddDecisionState, when  AgendaItem is Linked', () => {
    const agendaItemDetail = {
      agendaItem: {ID: '123'}
    } as AgendaItemDetail;
    spyOn(component.agendaItemLinked, 'emit');
    component.onAgendaItemLinked(agendaItemDetail);
    expect(component.agendaItemLinked.emit).toHaveBeenCalled();
  });

  it('should emit getAddDecisionState, when  clicked on AddOfflineDecision', () => {
    spyOn(component.decisionUpdated, 'emit');
    component.onDecisionUpdated();
    expect(component.decisionUpdated.emit).toHaveBeenCalled();
  });
});
