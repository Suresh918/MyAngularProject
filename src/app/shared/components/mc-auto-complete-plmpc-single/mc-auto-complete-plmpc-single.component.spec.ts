import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCAutoCompletePlmpcSingleComponent } from './mc-auto-complete-plmpc-single.component';

describe('MCAutoCompletePlmpcSingleComponent', () => {
  let component: MCAutoCompletePlmpcSingleComponent;
  let fixture: ComponentFixture<MCAutoCompletePlmpcSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MCAutoCompletePlmpcSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompletePlmpcSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
