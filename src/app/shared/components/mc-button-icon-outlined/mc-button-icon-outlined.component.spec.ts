import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatBadgeModule} from '@angular/material/badge';
import {of} from 'rxjs';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {MCButtonIconOutlinedComponent} from './mc-button-icon-outlined.component';
import {metaReducers, reducers} from '../../../store';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCButtonIconOutlinedComponent', () => {
  let component: MCButtonIconOutlinedComponent;
  let fixture: ComponentFixture<MCButtonIconOutlinedComponent>;
  const store = of({});
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonIconOutlinedComponent],
      imports: [AALButtonIconOutlinedModule, MatBadgeModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonIconOutlinedComponent);
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
