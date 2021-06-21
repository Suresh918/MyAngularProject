import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router, RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';

import {metaReducers, reducers} from '../../../store';
import { MCExpansionPanelListMeetingsComponent } from './mc-expansion-panel-list-meetings.component';
import {AgendaService} from '../../../core/services/agenda.service';


describe('MCExpansionPanelListMeetingsComponent', () => {
  let component: MCExpansionPanelListMeetingsComponent;
  let fixture: ComponentFixture<MCExpansionPanelListMeetingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCExpansionPanelListMeetingsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALExpansionPanelListModule, HttpClientModule, RouterModule, RouterTestingModule, BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: AgendaService, useClass: AgendaServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCExpansionPanelListMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createItemsList when trigger ngOnChanges', () => {
    spyOn(component, 'createItemsList');
    const simpleChange = {meetingsList: new SimpleChange(null, [{agendaItem: {ID: 'IDTest', subCategory: 'testSubcategory', decision: 'testedOk', generalInformation: {status: 'approved'}}}, {agendaItem: {ID: 'IDTest1', subCategory: 'testSubcategory1', decision: 'testedOk1', generalInformation: {status: 'approved'}}}], false)};
    component.ngOnChanges(simpleChange);
    expect(component.createItemsList).toHaveBeenCalled();
  });

  it('should set expansionPanelItemConfiguration on triggered createItemsList ', () => {
    component.meetingsList = [{agendaItem: {ID: 'IDTest', subCategory: 'testSubcategory', decision: 'testedOk', generalInformation: {status: 'approved'}}}, {agendaItem: {ID: 'IDTest1', subCategory: 'testSubcategory1', decision: 'testedOk1', generalInformation: {status: 'approved'}}}];
    component.createItemsList();
    expect(component.expansionPanelItemConfigurationList).toBeTruthy();
  });

  it('should navigate to the agendas details page when agenda id return from service', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.onItemClick('12345');
    expect(router.navigate).toHaveBeenCalledWith(['agendas/', '12345']);
  }));
});
class AgendaServiceMock {
  getAgendaForAgendaItem(id) {
    return of(id);
  }
}
