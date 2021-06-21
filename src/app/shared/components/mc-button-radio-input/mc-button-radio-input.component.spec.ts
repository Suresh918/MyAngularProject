import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';


import { MCButtonRadioInputComponent } from './mc-button-radio-input.component';
import {metaReducers, reducers} from '../../../store';

describe('MCButtonRadioInputComponent', () => {
  let component: MCButtonRadioInputComponent;
  let fixture: ComponentFixture<MCButtonRadioInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonRadioInputComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}),
        AALButtonRadioInputModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonRadioInputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
