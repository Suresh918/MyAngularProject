import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MCAutoCompleteUserSingleComponent } from './mc-auto-complete-user-single.component';
import { UpdateFieldService } from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {UserSearchService} from '../../../core/services/user-search.service';

describe('MCAutoCompleteUserSingleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  class ServiceParametersServiceMock {
    getServiceParameter(): any[] { return [{name: 'http://imagepath.jpg/{USER-ID}'}]; }
  }

  let component: MCAutoCompleteUserSingleComponent;
  let fixture: ComponentFixture<MCAutoCompleteUserSingleComponent>;
  let controlConfig: FormControlConfiguration;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteUserSingleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALAutoCompleteSingleModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: UpdateFieldService, useClass: UpdateFieldServiceMock },
        { provide: ServiceParametersService, useClass: ServiceParametersServiceMock },
        {provide: UserSearchService, useClass: UserSearchServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MCAutoCompleteUserSingleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set call super method of ngOnInit on initialization',  () => {
    spyOn(MCFieldComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    expect(MCFieldComponent.prototype.ngOnInit).toHaveBeenCalled();
  });

  it('should call super method onAcceptChange on trigger onAcceptChange', () => {
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    component.control = new FormControl('new value');
    const change: AcceptedChange = { ID: 'elementID', oldValue: 'old value', value: 'newValue' };
    component.onAcceptChange(change);
    expect(MCFieldComponent.prototype.onAcceptChanges).toBeTruthy();
  });

  it('check if createImageUrl functional return url', () => {
    const res = {
      userID: '1234'
    };
    expect(component.createImageUrl(res)).toBe('http://imagepath.jpg/1234');
  });

  it('should return empty when createImageUrl is triggered', () => {
    const res = '';
    const returnValue = component.createImageUrl(res);
    expect(returnValue).toBe('');
  });
});
class UserSearchServiceMock {
  getUsers$() {
    return [{userID: '123TEST', abbreviation: 'VJ', fullName: 'testUser'}];
  }
}
