import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Observable} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {MCRichTextAreaComponent} from './mc-rich-text-area.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';

describe('MCRichTextAreaComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCRichTextAreaComponent;
  let fixture: ComponentFixture<MCRichTextAreaComponent>;
  let controlConfig: FormControlConfiguration;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCRichTextAreaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALRichTextAreaModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCRichTextAreaComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call super method ngOnInit on trigger of ngOnInit', () => {
    spyOn(MCFieldComponent.prototype, 'ngOnInit');
    component.fieldConfiguration = {
      validatorConfiguration: {
        maxLength: 20
      }
    };
    component.ngOnInit();
    expect(MCFieldComponent.prototype.ngOnInit).toHaveBeenCalled();
  });
});
