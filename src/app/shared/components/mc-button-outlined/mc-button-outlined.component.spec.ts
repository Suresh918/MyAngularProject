import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';

import { MCButtonOutlinedComponent } from './mc-button-outlined.component';
import {metaReducers, reducers} from '../../../store';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCButtonOutlinedComponent', () => {
  let component: MCButtonOutlinedComponent;
  let fixture: ComponentFixture<MCButtonOutlinedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCButtonOutlinedComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, AALButtonOutlinedModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonOutlinedComponent);
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
