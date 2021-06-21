import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCButtonOverlayIconComponent } from './mc-button-overlay-icon.component';

describe('MCButtonOverlayIconComponent', () => {
  let component: MCButtonOverlayIconComponent;
  let fixture: ComponentFixture<MCButtonOverlayIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonOverlayIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonOverlayIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
