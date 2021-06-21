import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {FormControl, Validators} from '@angular/forms';

import { MCFieldCompositeComponent } from './mc-field-composite.component';
import {metaReducers, reducers} from '../../../store';

describe('MCFieldCompositeComponent', () => {
  let component: MCFieldCompositeComponent;
  let fixture: ComponentFixture<MCFieldCompositeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCFieldCompositeComponent ],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCFieldCompositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to selectControl as string when control value is set as number', () => {
    component.control = new FormControl(123456);
    expect(component.selectControl.value).toBe('123456');
  });

  it('should call updateDescriptionControl when component gets initialized', () => {
    spyOn(component, 'updateDescriptionControl');
    component.controlUpdated$.next('test');
    component.ngOnInit();
    expect(component.updateDescriptionControl).toHaveBeenCalled();
  });

  it('should set value to descriptionControlData when onRevertedChanges triggered',  () => {
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.onRevertedChanges(changeObj);
    expect(component.descriptionControlData).toBe(null);
  });

  it('should call bubbledAcceptChanges only when fieldSaveNotApplicable is set and fieldConfiguration id is equal to accept changes id', function () {
    spyOn(component.bubbledAcceptChanges, 'emit');
    const $event: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.fieldSaveNotApplicable = true;
    component.bubbleAcceptChanges = true;
    component.fieldConfiguration = {ID: 'fieldId'};
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.onAcceptChanges($event);
    expect(component.bubbledAcceptChanges.emit).toHaveBeenCalled();
  });

  it('should return nothing when caseObject is not set', () => {
    const $changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    expect(component.onAcceptChanges($changeObj)).toBe(undefined);
  });

  it('should set disable true descriptionControl  when clearDescriptionOnControlValueChange ' +
    'is set and descriptionControlConfiguration of ID and AcceptChanges ID should be same', () => {
    const $event: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.clearDescriptionOnControlValueChange = true;
    component.descriptionControl = new FormControl('', Validators.compose([
      Validators.required
    ]));
    component.descriptionControlConfiguration = {ID: 'fieldId1'};
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.onAcceptChanges($event);
    expect(component.descriptionControl.disable).toBeTruthy();
  });

  it('should call onAcceptChanges when descriptionControlData  and descriptionControlConfiguration of ID and AcceptedChanges ID is not same ', function () {
    spyOn(component, 'onAcceptChanges');
    const $event: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.descriptionControlData = {ID: 'test', value: 'test', oldValue: 'test'};
    component.descriptionControlConfiguration = {ID: 'testID'};
    component.descriptionControl = new FormControl();
    component.updateDescriptionControl($event);
    expect(component.onAcceptChanges).toHaveBeenCalled();
  });
});
