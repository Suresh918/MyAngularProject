import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {StoreModule} from '@ngrx/store';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { MCInputTextComponent } from './mc-input-text.component';
import { UpdateFieldService } from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';

describe('MCInputTextComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCInputTextComponent;
  let fixture: ComponentFixture<MCInputTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCInputTextComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: UpdateFieldService, useClass: UpdateFieldServiceMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputTextComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    component.controlConfiguration = {
      help: 'This gives you more information about the field'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
