import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';

import {MCButtonIconContainedComponent} from './mc-button-icon-contained.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {Value} from '../../models/service-parameters.model';

describe('MCButtonIconComponent', () => {
  let component: MCButtonIconContainedComponent;
  let fixture: ComponentFixture<MCButtonIconContainedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonIconContainedComponent],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, AALButtonIconContainedModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonIconContainedComponent);
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
