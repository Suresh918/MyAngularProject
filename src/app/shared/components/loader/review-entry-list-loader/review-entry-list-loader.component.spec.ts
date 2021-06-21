import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewEntryListLoaderComponent } from './review-entry-list-loader.component';

describe('ReviewEntryListComponent', () => {
  let component: ReviewEntryListLoaderComponent;
  let fixture: ComponentFixture<ReviewEntryListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewEntryListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewEntryListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
