import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';


import { MCAutoCompleteAirMultipleComponent } from './mc-auto-complete-air-multiple.component';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';
import {FormControl} from '@angular/forms';

describe('MCAutoCompleteAirMultipleComponent', () => {
  let component: MCAutoCompleteAirMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteAirMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteAirMultipleComponent ],
      imports: [AALAutoCompleteMultipleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteAirMultipleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
