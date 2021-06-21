import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MCButtonDynamicComponent} from './mc-button-dynamic.component';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {metaReducers, reducers} from '../../../store';

describe('McButtonDynamicComponent', () => {
  let component: MCButtonDynamicComponent;
  let fixture: ComponentFixture<MCButtonDynamicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonDynamicComponent],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, AALButtonDynamicModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class ServiceParametersServiceMock {
  getServiceParameter(type: string, category: string, action: string) {
    return [] as Value[];
  }
}
