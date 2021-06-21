import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { McInputTextSuffixComponent } from './mc-input-text-suffix.component';
import {metaReducers, reducers} from '../../../store';

describe('McInputTextSuffixComponent', () => {
  let component: McInputTextSuffixComponent;
  let fixture: ComponentFixture<McInputTextSuffixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McInputTextSuffixComponent ],
      imports: [HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McInputTextSuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
