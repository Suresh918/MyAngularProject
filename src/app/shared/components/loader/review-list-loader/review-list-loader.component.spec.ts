import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewListLoaderComponent } from './review-list-loader.component';

describe('ReviewListLoaderComponent', () => {
  let component: ReviewListLoaderComponent;
  let fixture: ComponentFixture<ReviewListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
