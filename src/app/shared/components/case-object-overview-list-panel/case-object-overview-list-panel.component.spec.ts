import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {CaseObjectOverviewListPanelComponent} from './case-object-overview-list-panel.component';
import {MCButtonIconOutlinedComponent} from '../mc-button-icon-outlined/mc-button-icon-outlined.component';
import {MCCaseObjectCardListComponent} from '../case-object-list/case-object-overview-list/case-object-card-list.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('CaseObjectOverviewListPanelComponent', () => {
  let component: CaseObjectOverviewListPanelComponent;
  let fixture: ComponentFixture<CaseObjectOverviewListPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectOverviewListPanelComponent, MCButtonIconOutlinedComponent, MCCaseObjectCardListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDividerModule, AALButtonIconOutlinedModule, BrowserAnimationsModule, MatBadgeModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectOverviewListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteItem when onDeleteItem is triggered', () => {
    spyOn(component.deleteItem, 'emit');
    component.onDeleteItem({});
    expect(component.deleteItem.emit).toHaveBeenCalled();
  });

  it('should emit addItem when onAddItem is triggered', () => {
    spyOn(component.addItem, 'emit');
    component.onAddItem();
    expect(component.addItem.emit).toHaveBeenCalled();
  });

  it('should emit caseObjectListIdPanel when onCaseObjectListId is triggered', () => {
    spyOn(component.caseObjectListIdPanel, 'emit');
    component.onCaseObjectListId({});
    expect(component.caseObjectListIdPanel.emit).toHaveBeenCalled();
  });
});
class ServiceParametersServiceMock {
  getServiceParameter() {
    return [{ 'name': 'name1' }];
  }
}
