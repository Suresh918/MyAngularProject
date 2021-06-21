import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCHelpComponent } from './mc-help.component';

describe('MCHelpComponent', () => {
  let component: MCHelpComponent;
  let fixture: ComponentFixture<MCHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCHelpComponent ],
      imports: [AALOverlayCardHelpModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set help info message when  value is set for message property', () => {
    component.message = 'testing message';
    expect(component.help.message).toBe('testing message');
  });
});
