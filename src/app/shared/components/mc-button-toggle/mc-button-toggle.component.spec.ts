import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import { MCButtonToggleComponent } from './mc-button-toggle.component';
import {metaReducers, reducers} from '../../../store';

describe('MCButtonToggleComponent', () => {
  let component: MCButtonToggleComponent;
  let fixture: ComponentFixture<MCButtonToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonToggleComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), AALButtonToggleModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to toggleControl value when formControl value is assign to control', function () {
    component.control = new FormControl('test');
    expect(component.toggleControl.value).toBe('test');
  });

  it('should set boolean to  toggleControl when formControl value is assign to control', function () {
    component.control = new FormControl(true);
    expect(component.toggleControl.value).toBe('true');
  });
});
