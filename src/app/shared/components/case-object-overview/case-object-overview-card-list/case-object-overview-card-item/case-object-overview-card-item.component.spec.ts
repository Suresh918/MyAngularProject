import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCCaseObjectOverviewCardItemComponent } from './case-object-overview-card-item.component';

describe('MCCaseObjectOverviewCardItemComponent', () => {
  let component: MCCaseObjectOverviewCardItemComponent;
  let fixture: ComponentFixture<MCCaseObjectOverviewCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCaseObjectOverviewCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectOverviewCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
