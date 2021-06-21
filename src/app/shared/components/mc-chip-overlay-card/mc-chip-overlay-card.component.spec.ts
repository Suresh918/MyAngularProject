import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McChipOverlayCardComponent } from './mc-chip-overlay-card.component';

describe('McChipOverlayCardComponent', () => {
  let component: McChipOverlayCardComponent;
  let fixture: ComponentFixture<McChipOverlayCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McChipOverlayCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McChipOverlayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
