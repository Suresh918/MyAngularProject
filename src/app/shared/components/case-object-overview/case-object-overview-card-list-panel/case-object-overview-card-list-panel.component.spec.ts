import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseObjectOverviewCardListPanelComponent } from './case-object-overview-card-list-panel.component';

describe('CaseObjectOverviewCardListPanelComponent', () => {
  let component: CaseObjectOverviewCardListPanelComponent;
  let fixture: ComponentFixture<CaseObjectOverviewCardListPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectOverviewCardListPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectOverviewCardListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
