import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCOverviewConfigurableCardComponent } from './mc-overview-configurable-card.component';

describe('MCOverviewConfigurableCardComponent', () => {
  let component: MCOverviewConfigurableCardComponent;
  let fixture: ComponentFixture<MCOverviewConfigurableCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCOverviewConfigurableCardComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCOverviewConfigurableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit overviewCardClicked when cardClick is triggered', () => {
    spyOn(component.overviewCardClicked, 'emit');
    const event = {};
    component.cardClick();
    expect(component.overviewCardClicked.emit).toHaveBeenCalled();
  });
});
