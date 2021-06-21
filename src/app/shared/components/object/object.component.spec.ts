import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';

import { ObjectComponent } from './object.component';

describe('Object component test', () => {
  let fixture: ComponentFixture<ObjectComponent>;
  let component: ObjectComponent;
  let element: HTMLElement;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ObjectComponent],
      imports: [MatTooltipModule]
    });
    fixture = TestBed.createComponent(ObjectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  }));

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  it('should use row as default direction', waitForAsync(() => {
    expect(component.direction).toEqual('row');
  }));
});
