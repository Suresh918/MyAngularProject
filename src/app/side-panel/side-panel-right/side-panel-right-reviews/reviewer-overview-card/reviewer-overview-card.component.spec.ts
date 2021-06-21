import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewerOverviewCardComponent } from './reviewer-overview-card.component';

describe('ReviewerOverviewCardComponent', () => {
  let component: ReviewerOverviewCardComponent;
  let fixture: ComponentFixture<ReviewerOverviewCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewerOverviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
