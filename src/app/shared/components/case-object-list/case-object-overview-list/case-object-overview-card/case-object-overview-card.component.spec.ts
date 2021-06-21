import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

import {CaseObjectOverviewCardComponent} from './case-object-overview-card.component';
import {CaseObjectDetailsHeaderComponent} from '../../../case-object-details-header/case-object-details-header.component';
import {ActionPanelComponent} from '../../../action-panel/action-panel.component';
import {ServiceParametersService} from '../../../../../core/services/service-parameters.service';

describe('CaseObjectOverviewCardComponent', () => {
  let component: CaseObjectOverviewCardComponent;
  let fixture: ComponentFixture<CaseObjectOverviewCardComponent>;
  class ServiceParametersServiceMock {
    getCaseObjectMetaData(service: string, category: string) {
      return {};
    }
    getServiceParameter() {
      return [{ 'name': 'name1' }];
    }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectOverviewCardComponent, DateDisplayPipeMock,
        CaseObjectDetailsHeaderComponent, ActionPanelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatTooltipModule, RouterTestingModule, HttpClientModule, MatDialogModule],
      providers: [
        {provide: AALDatePipe, useClass: DateDisplayPipeMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call emit when onDeleteItem is triggered',  () => {
    spyOn(component.deleteItem, 'emit');
    const events = {};
    component.onDeleteItem(events);
    expect(component.deleteItem.emit).toHaveBeenCalled();
  });
});
@Pipe({name: 'aalDate'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
