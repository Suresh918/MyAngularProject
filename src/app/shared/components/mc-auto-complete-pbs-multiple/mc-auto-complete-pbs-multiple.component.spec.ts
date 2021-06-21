import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { MCAutoCompletePbsMultipleComponent } from './mc-auto-complete-pbs-multiple.component';
import {metaReducers, reducers} from '../../../store';


describe('MCAutoCompletePbsMultipleComponent', () => {
  let component: MCAutoCompletePbsMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompletePbsMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompletePbsMultipleComponent ],
      imports: [AALAutoCompleteMultipleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompletePbsMultipleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
