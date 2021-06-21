import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import { Router } from '@angular/router';
import {of} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

import { MCAgendaListOverlayCardComponent } from './mc-agenda-list-overlay-card.component';
import {MCButtonOverlayCardComponent} from '../mc-button-overlay-card/mc-button-overlay-card.component';
import {PersonNamePipe} from '../../pipes/person-name.pipe';
import {metaReducers, reducers} from '../../../store';
import {AgendaService} from '../../../core/services/agenda.service';


describe('MCAgendaListOverlayCardComponent', () => {
  let component: MCAgendaListOverlayCardComponent;
  let fixture: ComponentFixture<MCAgendaListOverlayCardComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate').and.returnValue('')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAgendaListOverlayCardComponent, MCButtonOverlayCardComponent,
        PersonNamePipeMock, DurationPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule, RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: AALDurationPipe, useClass: DurationPipeMock},
        {provide: PersonNamePipe, useClass: PersonNamePipeMock},
        {provide: Router, useValue: mockRouter},
        {provide: AgendaService, useClass: AgendaServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAgendaListOverlayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set totalItems of agendaItemsOverviewData when trigger agendaOverviewPanelOpened', () => {
    component.category = 'CCB';
    event = createSpyObj('event', ['stopPropagation', 'stopPropagation']);
    fixture.detectChanges();
    component.agendaOverviewPanelOpened();
    expect(component.agendaItemsOverviewData[0].TotalItems).toBe('1');
  });

  it('should set navigate when agendaListItemClicked is triggered',  () => {
    const spy = (<jasmine.Spy>mockRouter.navigate).and.returnValue(Promise.resolve());
    const $option = {ID: '12345'};
    component.agendaListItemClicked($option);
    expect(spy).toHaveBeenCalled();
  });

});
@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}
@Pipe({name: 'personName'})
class PersonNamePipeMock implements PipeTransform {
  transform(value) {
    return 'name(abbr)';
  }
}
class AgendaServiceMock {
  getAgendaItemsOverviewDetails(id) {
    return of([{ TotalItems: '1', name: 'name1' }]);
  }
}
