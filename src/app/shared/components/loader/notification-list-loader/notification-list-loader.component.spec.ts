import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationListLoaderComponent } from './notification-list-loader.component';

describe('NotificationListLoaderComponent', () => {
  let component: NotificationListLoaderComponent;
  let fixture: ComponentFixture<NotificationListLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationListLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
