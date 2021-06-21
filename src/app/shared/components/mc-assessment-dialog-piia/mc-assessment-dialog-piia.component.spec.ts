import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCAssessmentDialogPIIAComponent } from './mc-assessment-dialog-piia.component';

describe('MCAssessmentDialogPIIAComponent', () => {
  let component: MCAssessmentDialogPIIAComponent;
  let fixture: ComponentFixture<MCAssessmentDialogPIIAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAssessmentDialogPIIAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAssessmentDialogPIIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
