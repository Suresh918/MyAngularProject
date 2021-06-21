import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {ActionPanelIconComponent} from './action-panel-icon.component';
import {HelpersService} from '../../../../core/utilities/helpers.service';


describe('ActionPanelIconComponent', () => {
  let component: ActionPanelIconComponent;
  let fixture: ComponentFixture<ActionPanelIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPanelIconComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: HelpersService, useClass: HelpersServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPanelIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return value should be type number when triggered getEnDateDaysLeft',  () => {
    const returnValue = component.getEnDateDaysLeft(new Date());
    expect(returnValue).toBe(0);
  });
});

class HelpersServiceMock {
  getDaysLeftFromNow(actionDeadline) {
    return 10;
  }
}
