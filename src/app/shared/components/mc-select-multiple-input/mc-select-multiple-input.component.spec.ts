import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {Observable} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {MCSelectMultipleInputComponent} from './mc-select-multiple-input.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';


describe('MCSelectMultipleInputComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCSelectMultipleInputComponent;
  let fixture: ComponentFixture<MCSelectMultipleInputComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCSelectMultipleInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCSelectMultipleInputComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
