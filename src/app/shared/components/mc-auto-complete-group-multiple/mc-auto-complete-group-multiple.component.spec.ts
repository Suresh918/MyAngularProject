import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Observable} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';


import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MCAutoCompleteGroupMultipleComponent} from './mc-auto-complete-group-multiple.component';

describe('MCAutoCompleteGroupMultipleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCAutoCompleteGroupMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteGroupMultipleComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCAutoCompleteGroupMultipleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCAutoCompleteGroupMultipleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call super method of ngOnInit on initialization', () => {
    spyOn(MCFieldComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    expect(MCFieldComponent.prototype.ngOnInit).toHaveBeenCalled();
  });

  it('should call super method of onAcceptChanges', () => {
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    component.control = new FormControl('new value');
    const change: AcceptedChange = {ID: 'elementID', oldValue: ['group', 'role', {name: 'test'}], value: ['group', 'role', {name: 'test'}]};
    component.groupType = 'CCB';
    component.onAcceptChanges(change);
    spyOn(component, 'transformEvent').and.returnValue(undefined);
    expect(MCFieldComponent.prototype.onAcceptChanges).toHaveBeenCalled();
  });
});
