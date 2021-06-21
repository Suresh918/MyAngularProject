import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCInputTimeComponent } from './mc-input-time.component';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';

describe('MCInputTimeComponent', () => {
  let component: MCInputTimeComponent;
  let fixture: ComponentFixture<MCInputTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputTimeComponent ],
      imports: [ HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
