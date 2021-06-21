import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';
import { MCInputDurationComponent } from './mc-input-duration.component';

describe('MCInputDurationComponent', () => {
  let component: MCInputDurationComponent;
  let fixture: ComponentFixture<MCInputDurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputDurationComponent ],
      imports: [AALInputDurationModule,
        HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
