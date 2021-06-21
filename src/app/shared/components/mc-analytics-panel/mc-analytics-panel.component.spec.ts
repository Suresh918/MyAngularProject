import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCAnalyticsPanelComponent } from './mc-analytics-panel.component';

describe('MCAnalyticsPanelComponent', () => {
  let component: MCAnalyticsPanelComponent;
  let fixture: ComponentFixture<MCAnalyticsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAnalyticsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAnalyticsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
