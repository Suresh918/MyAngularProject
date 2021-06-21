import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { MCButtonContainedComponent } from './mc-button-contained.component';
import {metaReducers, reducers} from '../../../store';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCButtonContainedComponent', () => {
  let component: MCButtonContainedComponent;
  let fixture: ComponentFixture<MCButtonContainedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonContainedComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, AALButtonContainedModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonContainedComponent);
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
