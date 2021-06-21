import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';

import { ActionPanelHeaderComponent } from './action-panel-header.component';

describe('ActionPanelHeaderComponent', () => {
  let component: ActionPanelHeaderComponent;
  let fixture: ComponentFixture<ActionPanelHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPanelHeaderComponent, DateDisplayPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTooltipModule],
      providers: [
        {provide: AALDatePipe, useClass: DateDisplayPipeMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPanelHeaderComponent);
    component = fixture.componentInstance;
    component.caseObject = {ID: 'test123', title: 'test',  totalOpenActions : 10, totalDueSoonActions: 10, totalOverdueActions: 10};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set priorityTooltip when caseObjectType is ChangeRequest ', function () {
    component.caseObjectType = 'ChangeRequest';
    expect(component.priorityTooltip).toBe('Priority Of Analysis');
  });
});
@Pipe({name: 'dateFormat'})
class DateDisplayPipeMock extends DatePipe implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
