import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';


import {MCAutoCompleteUserMultipleComponent} from './mc-auto-complete-user-multiple.component';
import {metaReducers, reducers} from '../../../store';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {User} from '../../models/mc.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';

describe('MCAutoCompleteUserMultipleComponent', () => {

  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  class ServiceParametersServiceMock {
    getServiceParameter(): any[] {
      return [{name: 'http://imagepath.jpg/{USER-ID}'}];
    }
  }

  let component: MCAutoCompleteUserMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteUserMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCAutoCompleteUserMultipleComponent],
      imports: [AALAutoCompleteMultipleModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteUserMultipleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    component.predefinedUsersList = [{userID: '123TEST', abbreviation: 'VJ', fullName: 'testUser'}];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set datasource on initialization',  () => {
    component.predefinedUsersList = '';
    component.ngOnInit();
    expect(component.dataSource.length).toBeGreaterThanOrEqual(0);
  });

  it('should return no response as observable  when getPredefinedUsersList is triggered',  () => {
    const returnValue = component.getPredefinedUsersList('12345');
    returnValue.subscribe((result) => {
      expect(result.length).toBe(0);
    });
  });

  it('should return observable response when getPredefinedUsersList is triggered',  () => {
    const returnValue = component.getPredefinedUsersList('');
    returnValue.subscribe((result) => {
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should transform value by removing empty keys', () => {
    const oldValue = {fullName: 'Erik van Boekel', userID: 'eboekel', abbreviation: 'EVBK'} as User;
    const newValue = {fullName: 'Erik', userID: 'erikb', abbreviation: 'EVBKK', departmentName: ''} as User;
    const acceptedChange = new AcceptedChange('multiUserControl', oldValue, newValue);
    const value = component.transformEvent(acceptedChange);
    expect(value.value.departmentName).toBeFalsy();
  });

  it('should create image url', () => {
    const value = {fullName: 'Erik van Boekel', userID: 'eboekel', abbreviation: 'EVBK'} as User;
    expect(component.createImageUrl(value)).toBeTruthy();
    const otherValue = {};
    expect(component.createImageUrl(otherValue)).toBe('');
  });

  it('should call accept changes of field component', () => {
    const value = {fullName: 'Erik van Boekel', userID: 'eboekel', abbreviation: 'EVBK'} as User;
    const acceptedChange = {ID: 'id', oldValue: {}, value: value} as AcceptedChange;
    component.onAcceptChanges(acceptedChange);
    expect(MCFieldComponent.prototype.onAcceptChanges).toHaveBeenCalledWith(component.transformEvent(acceptedChange));
  });
});
class UserSearchServiceMock {
  getUsers$() {
    return [{userID: '123TEST', abbreviation: 'VJ', fullName: 'testUser'}];
  }
}
