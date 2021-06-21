import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';
import {CreatorChangeRequestDecisionsComponent} from './creator-change-request-decisions.component';
import {AgendaItemDetail} from '../../../../../agenda/agenda.model';


describe('ChangeRequestDecisionsComponent', () => {
  let component: CreatorChangeRequestDecisionsComponent;
  let fixture: ComponentFixture<CreatorChangeRequestDecisionsComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorChangeRequestDecisionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChangeRequestDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit agendaItemLinked, when clicked on onAgendaItemLinked', () => {
    spyOn(component.agendaItemLinked, 'emit');
    component.onAgendaItemLinked({} as AgendaItemDetail);
    expect(component.agendaItemLinked.emit).toHaveBeenCalledWith({} as AgendaItemDetail);
  });
  it('should emit decisionUpdated, when  clicked on onDecisionUpdated', () => {
    spyOn(component.decisionUpdated, 'emit');
    component.onDecisionUpdated();
    expect(component.decisionUpdated.emit).toHaveBeenCalled();
  });
});
