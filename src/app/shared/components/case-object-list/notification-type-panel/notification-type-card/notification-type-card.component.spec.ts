import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationTypeCardComponent } from './notification-type-card.component';

describe('NotificationTypeCardComponent', () => {
  let component: NotificationTypeCardComponent;
  let fixture: ComponentFixture<NotificationTypeCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when checked triggered',  () => {
    spyOn(component.cardChecked, 'emit');
    component.checked();
    expect(component.cardChecked.emit).toHaveBeenCalled();
  });
});
