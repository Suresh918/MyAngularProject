import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';

import { MCInputTextAreaComponent } from './mc-input-text-area.component';
import {metaReducers, reducers} from '../../../store';


describe('MCInputTextAreaComponent', () => {
  let component: MCInputTextAreaComponent;
  let fixture: ComponentFixture<MCInputTextAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputTextAreaComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
