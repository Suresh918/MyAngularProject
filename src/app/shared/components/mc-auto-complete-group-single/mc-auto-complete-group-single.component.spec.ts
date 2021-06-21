import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import { MCAutoCompleteGroupSingleComponent } from './mc-auto-complete-group-single.component';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {metaReducers, reducers} from '../../../store';

describe('MCAutoCompleteGroupSingleComponent', () => {
  let component: MCAutoCompleteGroupSingleComponent;
  let fixture: ComponentFixture<MCAutoCompleteGroupSingleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteGroupSingleComponent ],
      imports: [AALAutoCompleteSingleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteGroupSingleComponent);
    component = fixture.componentInstance;
    component.control = new FormControl({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call super method of onAcceptChanges', function () {
    component.control = new FormControl('new value');
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    const $event: AcceptedChange = {ID: 'elementID', oldValue: {name: 'test'}, value: {name: 'test'}};
    component.onAcceptChanges($event);
    expect(MCFieldComponent.prototype.onAcceptChanges).toHaveBeenCalled();
  });
});
