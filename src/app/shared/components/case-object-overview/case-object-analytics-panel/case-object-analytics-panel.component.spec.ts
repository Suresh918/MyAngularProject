import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseObjectAnalyticsPanelComponent } from './case-object-analytics-panel.component';

describe('CaseObjectAnalyticsPanelComponent', () => {
  let component: CaseObjectAnalyticsPanelComponent;
  let fixture: ComponentFixture<CaseObjectAnalyticsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectAnalyticsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectAnalyticsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
