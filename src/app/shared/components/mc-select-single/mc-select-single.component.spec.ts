import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Observable} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import {MCSelectSingleComponent} from './mc-select-single.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

describe('MCSelectSingleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCSelectSingleComponent;
  let fixture: ComponentFixture<MCSelectSingleComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCSelectSingleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCSelectSingleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to selectControl when formControl value type is number', () => {
    component.control = new FormControl(123456);
    expect(component.selectControl.value).toBe('123456');
  });

  it('should set value of selectControl to default selection value when component get initialized', () => {
    component.defaultSelection = 'test';
    component.selectControl = new FormControl('');
    component.ngOnInit();
    expect(component.selectControl.value).toBe('test');
  });
});
