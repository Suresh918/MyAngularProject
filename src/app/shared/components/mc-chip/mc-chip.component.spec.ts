import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCChipComponent } from './mc-chip.component';

describe('MCChipComponent', () => {
  let component: MCChipComponent;
  let fixture: ComponentFixture<MCChipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCChipComponent ],
      imports: [AALChipModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit remove when onRemove triggered',  () => {
    spyOn(component.remove, 'emit');
    const event = {}
    component.onRemove(event);
    expect(component.remove.emit).toHaveBeenCalled();
  });

  it('should emit chipClick when onChipClick triggered',  () => {
    spyOn(component.chipClick, 'emit');
    const event = {}
    component.onChipClick(event);
    expect(component.chipClick.emit).toHaveBeenCalled();
  });
});
