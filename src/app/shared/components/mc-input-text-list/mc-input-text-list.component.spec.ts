import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { MCInputTextListComponent } from './mc-input-text-list.component';
import {metaReducers, reducers} from '../../../store';
import {MCFieldComponent} from '../mc-field/mc-field.component';

describe('MCInputTextListComponent', () => {
  let component: MCInputTextListComponent;
  let fixture: ComponentFixture<MCInputTextListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MCInputTextListComponent],
      imports: [ StoreModule.forRoot(reducers, {metaReducers}),
        HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputTextListComponent);
    component = fixture.componentInstance;
    spyOn(MCFieldComponent.prototype, 'onAcceptChanges');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set single value in an array', () => {
    component.control = new FormControl('new value');
    const change: AcceptedChange = { ID: 'elementID', oldValue: 'old value', value: 'newValue' };
    component.onAcceptChanges(change);
    expect(MCFieldComponent.prototype.onAcceptChanges).toHaveBeenCalledWith(change);
  });

  it('should set value to control when ngOnChanges trigger',  () => {
    component.control = new FormControl({value: 'old test'});
    component.ngOnChanges({'control': new SimpleChange(null, {value: ['test']}, false)});
    expect(component.control.value).toBe('test');
  });
});
