import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { MCInputLinkComponent } from './mc-input-link.component';
import {metaReducers, reducers} from '../../../store';

describe('MCInputLinkComponent', () => {
  let component: MCInputLinkComponent;
  let fixture: ComponentFixture<MCInputLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputLinkComponent ],
      imports: [AALInputLinkModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
