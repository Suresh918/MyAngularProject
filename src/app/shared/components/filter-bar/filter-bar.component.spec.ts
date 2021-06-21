import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, SimpleChange} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {Store, StoreModule} from '@ngrx/store';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';

import {FilterBarComponent} from './filter-bar.component';
import {FilterPanelComponent} from './filter-panel/filter-panel.component';
import {FilterBarSearchComponent} from './filter-bar-search/filter-bar-search.component';
import {FilterBarSelectedOptionsContainerComponent} from './filter-bar-selected-options-container/filter-bar-selected-options-container.component';
import {metaReducers, reducers} from '../../../store';

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<FilterBarComponent>;
  let component: FilterBarComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatBadgeModule, MatTooltipModule,
        StoreModule.forRoot(reducers, {metaReducers}), MatMenuModule, MatAutocompleteModule, MatButtonModule, HttpClientModule],
      declarations: [FilterBarComponent, FilterPanelComponent, FilterBarSearchComponent,
        FilterBarSelectedOptionsContainerComponent, AALDatePipe],
      providers: [
        {provide: Store}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
  }));
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
