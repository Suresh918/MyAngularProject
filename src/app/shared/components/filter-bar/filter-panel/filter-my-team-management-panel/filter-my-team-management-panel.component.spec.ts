import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterMyTeamManagementPanelComponent } from './filter-my-team-management-panel.component';

describe('FilterMyTeamManagementPanelComponent', () => {
  let component: FilterMyTeamManagementPanelComponent;
  let fixture: ComponentFixture<FilterMyTeamManagementPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterMyTeamManagementPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMyTeamManagementPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
