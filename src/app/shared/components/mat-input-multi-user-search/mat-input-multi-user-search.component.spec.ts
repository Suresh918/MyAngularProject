import { MultiUserSearchComponent } from './mat-input-multi-user-search.component';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControlConfiguration } from '../../models/mc-configuration.model';
import { MatTableModule } from '@angular/material/table';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { User } from '../../models/mc.model';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../store';
import {MultipleAssigneesDialogComponent} from './multiple-assignees-dialog/multiple-assignees-dialog.component';

describe('MultiUserSearchComponent', function () {
  let fixture: ComponentFixture<MultiUserSearchComponent>;
  let component: MultiUserSearchComponent;
  let controlConfig: FormControlConfiguration;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatChipsModule, BrowserModule, MatAutocompleteModule, ReactiveFormsModule, HttpClientModule,
        MatDialogModule, BrowserAnimationsModule, MatTableModule, StoreModule.forRoot(reducers, {metaReducers})],
      declarations: [MultiUserSearchComponent, AALDisableControlDirective, MultipleAssigneesDialogComponent]
    }).compileComponents();
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MultipleAssigneesDialogComponent]
      }
    });
    fixture = TestBed.createComponent(MultiUserSearchComponent);
    component = fixture.componentInstance;
    component.control = new FormArray([]);
    component.stateCtrl = new FormControl('', Validators.compose([Validators.required]));
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
    component.userchipList = {};
  }));
  it('should create', () => {
   expect(component).toBeTruthy();
 });
  it('should return user object', () => {
    const userObjFn = component.onUserSelected();
    expect(typeof userObjFn).toBe('function');
    const user = userObjFn({
      'fullName': 'Full name',
      'abbreviation': 'ABBR'
    });
    expect(user).toBe('Full name - ABBR');
  });
  it('should empty state control', () => {
    component.stateCtrl.setValue('test');
    component.emptyStateCtrl();
    expect(component.stateCtrl.value).toBe('');
  });
  it('component after init should be called', () => {
    component.disabled = true;
    component.ngAfterViewInit();
    expect(component.stateCtrl.disabled).toBe(true);
  });
  it('add chip functionality should work', () => {
    const autoCOmpleteEl = fixture.debugElement.query(By.css('mat-autocomplete')).nativeElement;
    const event = new Event('optionSelected');
    event['option'] = {};
    event['option'].value = 1;
    autoCOmpleteEl.value = 1;
    component.controlConfiguration.tag = 'CB';
    autoCOmpleteEl.dispatchEvent(event, component.stateCtrl);
    expect(component.control.controls[0].value).toBeTruthy();
  });
  it('open group dialog should work', () => {
    component.openGroupSelect();
    expect(component.stateCtrl.value).toBe('');
  });
  it('new user should be added to group', () => {
    component.addUserFromGroup(new User());
    expect(component.control.controls[0].value).toBeTruthy();
  });
  it('remove chip should work', () => {
    component.addUserFromGroup(new User());
    component.removeChip(0, component.userGroups);
    expect(component.control.controls[0]).toBeFalsy();
  });
  it('validator should return the validator value', () => {
    expect(component.hasValidator()).toBe(false);
    component.stateCtrl.clearValidators();
    expect(component.hasValidator()).toBe(false);
  });
  it('should return the placeholder value', () => {
    component.controlConfiguration.label = 'placeholder';
    expect(component.getPlaceHolder()).toBe('placeholder');
  });
});
