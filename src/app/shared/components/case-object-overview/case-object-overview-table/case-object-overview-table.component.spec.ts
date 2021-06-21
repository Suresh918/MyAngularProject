import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCCaseObjectOverviewTableComponent } from './case-object-overview-table.component';

describe('MCCaseObjectOverviewTableComponent', () => {
  let component: MCCaseObjectOverviewTableComponent;
  let fixture: ComponentFixture<MCCaseObjectOverviewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCaseObjectOverviewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
