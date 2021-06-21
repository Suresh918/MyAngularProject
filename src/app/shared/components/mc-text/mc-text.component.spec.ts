import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCTextComponent } from './mc-text.component';

describe('MCTextComponent', () => {
  let component: MCTextComponent;
  let fixture: ComponentFixture<MCTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCTextComponent ],
      imports: [AALTextFieldModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set helpMsg when value is set for help',  () => {
    component.help = 'test';
    expect(component.helpMsg.message).toBe('test');
  });
});
