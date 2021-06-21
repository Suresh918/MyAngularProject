import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {SimpleChange} from '@angular/core';
import {of, throwError} from 'rxjs';


import { MCAutoCompleteProjectMultipleComponent } from './mc-auto-complete-project-multiple.component';
import {metaReducers, reducers} from '../../../store';
import {WorkBreakdownStructureService} from '../../../core/services/work-breakdown-structure.service';

describe('MCAutoCompleteProjectMultipleComponent', () => {
  let component: MCAutoCompleteProjectMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteProjectMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProjectMultipleComponent ],
      imports: [AALAutoCompleteMultipleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteProjectMultipleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    component.projectUpdated$.next('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should set description as empty  when ngOnChanges triggered and service call return error response', () => {
    const simpleChange = {control: new SimpleChange(null, {value:  [{wbsElement: 'NXE3350B-0302', description: '1061000302'}, {wbsElement: 'NXE3350B-0302', description: '1061000302'}]}, false)};
    const xService = fixture.debugElement.injector.get(WorkBreakdownStructureService);
    spyOn(xService, 'getWorkBreakdownStructure$').and.returnValue(throwError(new Error('test')));
    component.ngOnChanges(simpleChange);
    expect(component.control.value.description).toBe(undefined);
  });

  it('should call saveFieldChanges when onAcceptChange triggered',  () => {
    spyOn(component, 'saveFieldChanges');
    const $event: AcceptedChange = { ID: 'elementID', oldValue: 'old value', value: 'newValue' };
    component.onAcceptChange($event);
    expect(component.saveFieldChanges).toHaveBeenCalled();
  });
});
