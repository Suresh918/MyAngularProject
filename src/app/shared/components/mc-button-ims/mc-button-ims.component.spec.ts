import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {MCButtonImsComponent} from './mc-button-ims.component';
import {metaReducers, reducers} from '../../../store';
import {MCButtonContainedComponent} from '../mc-button-contained/mc-button-contained.component';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCButtonImsComponent', () => {
  let component: MCButtonImsComponent;
  let fixture: ComponentFixture<MCButtonImsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonImsComponent, MCButtonContainedComponent],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), AALButtonContainedModule, HttpClientModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonImsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open window when openImplementationStrategy is triggered', () => {
    component.changeRequestID = '123456';
    spyOn(window, 'open');
    component.openImplementationStrategy();
    expect(window.open).toHaveBeenCalled();
  });
});

class ServiceParametersServiceMock {
  getServiceParameter(type: string, category: string, action: string) {
    return [] as Value[];
  }
}
