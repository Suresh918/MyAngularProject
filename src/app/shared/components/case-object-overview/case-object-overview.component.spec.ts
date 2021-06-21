import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCCaseObjectOverviewComponent } from './case-object-overview.component';

describe('MCCaseObjectOverviewComponent', () => {
  let component: MCCaseObjectOverviewComponent;
  let fixture: ComponentFixture<MCCaseObjectOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCaseObjectOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
