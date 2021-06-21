import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {Observable} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';

import {McAutoCompleteUserSingleCardComponent} from './mc-auto-complete-user-single-card.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';

describe('McAutoCompleteUserSingleCardComponent', () => {
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

  let component: McAutoCompleteUserSingleCardComponent;
  let fixture: ComponentFixture<McAutoCompleteUserSingleCardComponent>;
  let controlConfig: FormControlConfiguration;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McAutoCompleteUserSingleCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(McAutoCompleteUserSingleCardComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Component should be call super method of ngOnInit when Trigger ngOnInit', () => {
    spyOn(MCFieldComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    expect(MCFieldComponent.prototype.ngOnInit).toHaveBeenCalled();
  });

  it('Should call super method  onAcceptChanges when trigger onAcceptChange', () => {
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    component.control = new FormControl('new value');
    const change: AcceptedChange = {ID: 'elementID', oldValue: 'old value', value: 'newValue'};
    component.onAcceptChange(change);
    expect(MCFieldComponent.prototype.onAcceptChanges).toHaveBeenCalled();
  });

  it('check if createImageUrl functional return url', () => {
    const res = {
      userID: '1234'
    };
    expect(component.createImageUrl(res)).toBe('http://imagepath.jpg/1234');
  });

  it('check if createImageUrl return null when null value set', () => {
    const res = '';
    expect(component.createImageUrl(res)).toBe('');
  });
});
