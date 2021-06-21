import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {Observable} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {MCButtonToggleInputComponent} from './mc-button-toggle-input.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

describe('MCButtonToggleInputComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCButtonToggleInputComponent;
  let fixture: ComponentFixture<MCButtonToggleInputComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonToggleInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCButtonToggleInputComponent);
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
