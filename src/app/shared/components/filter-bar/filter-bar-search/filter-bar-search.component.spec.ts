import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';

import {FilterBarSearchComponent} from './filter-bar-search.component';

describe('FilterBarSearchComponent', () => {
  let fixture: ComponentFixture<FilterBarSearchComponent>;
  let component: FilterBarSearchComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatButtonModule],
      declarations: [FilterBarSearchComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FilterBarSearchComponent);
    component = fixture.componentInstance;
    component['caseObject'] = 'trackerBoard';
    component['searchControl'] = new FormControl('initial');
  }));
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should component be initialized', () => {
    component.ngOnInit();
    expect(component.searchControl.value).toEqual(null);
  });
  it('on Enter', () => {
    component.onEnter();
    expect(component.searchControl.value).toEqual('');
  });
  it('on clear entry', () => {
    component.searchControl.setValue('actualVal');
    component.clearEntry();
    expect(component.searchControl.value).toEqual('');
  });
});
