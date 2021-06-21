import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidePanelRightReviewsComponent } from './side-panel-right-reviews.component';

describe('SidePanelRightReviewsComponent', () => {
  let component: SidePanelRightReviewsComponent;
  let fixture: ComponentFixture<SidePanelRightReviewsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidePanelRightReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelRightReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
