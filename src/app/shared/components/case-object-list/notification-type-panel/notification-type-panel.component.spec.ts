import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import {NotificationTypePanelComponent} from './notification-type-panel.component';

describe('NotificationTypePanelComponent', () => {
  let component: NotificationTypePanelComponent;
  let fixture: ComponentFixture<NotificationTypePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTypePanelComponent ],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTypePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.onStatusCardSelection({checked: true});
    expect(component).toBeTruthy();
  });
});
