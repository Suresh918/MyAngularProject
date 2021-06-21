import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';

import {MCButtonIconComponent} from './mc-button-icon.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {Value} from '../../models/service-parameters.model';

describe('MCButtonIconComponent', () => {
  let component: MCButtonIconComponent;
  let fixture: ComponentFixture<MCButtonIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonIconComponent],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, AALButtonIconModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonIconComponent);
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
