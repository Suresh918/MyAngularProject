import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import { MatDialogImportQuickFilterComponent } from './mat-dialog-import-quick-filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterOptions} from '../../../../models/mc-filters.model';

describe('MatDialogImportQuickFilterComponent', () => {
  let component: MatDialogImportQuickFilterComponent;
  let fixture: ComponentFixture<MatDialogImportQuickFilterComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDialogImportQuickFilterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, FormsModule, ReactiveFormsModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogImportQuickFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close ', () => {
    spyOn(component.dialogRef, 'close');
    component.close(true);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should set quickFilterName from encoded value when decodeQueryString is triggered', () => {
    component.quickFilterQuery = 'eyJmaWx0ZXJOYW1lIjoiU2FtcGxlIHRlc3QiLCJmaWx0ZXJPcHRpb25zIjp7InN0YXRlIjpbXSwic3RhdHVzIjpbXSwiaW1wbGVtZW' +
      '50YXRpb25Qcmlvcml0eSI6W10sImFuYWx5c2lzUHJpb3JpdHkiOltdLCJjdXN0b21lckltcGFjdCI6W10sIlBDQ1NUU' +
      'kFJTUlEcyI6W10sIlBCU0lEcyI6W10sInR5cGUiOltdLCJwdXJwb3NlIjpbXSwicHJvZHVjdElEIjpbXSwicHJvamVjdElEIjpbXSwicGVvcGxlIjpbeyJ1c2VyIjp7InVzZXJJRCI6InEwNHRl' +
      'c3QiLCJmdWxsTmFtZSI6IlEgMDR0ZXN0IiwiZW1haWwiOiJxMDR0ZXN0QGFzbWwucWFzIiwiYWJicmV2aWF0aW9uIjoiUTA0VCIsImRlcGFydG1lbnROYW1l' +
      'IjoiTUkgREUgRUMmSSBUaGVybWFsIEFyY2hpdGVjdHVyZSBEVVYiLCJwaG90b1VSTCI6Imh0dHBzOi8vcGVvcGxlLmFzbWwuY29' +
      'tL19sYXlvdXRzLzE1L3VzZXJwaG90by5hc3B4P3NpemU9TSZhY2NvdW50bmFtZT1hc21sJTJEY29tJTVDcTA0dGVzdCJ9LCJyb2xlIjp7Im5' +
      'hbWUiOiJjcmVhdGVkQnkiLCJsYWJlbCI6IkNyZWF0b3IiLCJzZXF1ZW5jZSI6MX0sInVzZXJzIjpbXX1dLCJhdHRlbmRlZSI6' +
      'W10sImFsbFVzZXJzIjpbXSwicGxhbm5lZFJlbGVhc2VEYXRlIjpudWxsLCJwbGFubmVkRWZmZWN0aXZlRGF0ZSI6bnVsbCw' +
      'iZHVlRGF0ZSI6bnVsbCwibWVldGluZ0RhdGUiOm51bGwsImxpbmtlZEl0ZW1zIjpudWxsLCJyZXZpZXdJdGVtcyI6W10sImN' +
      'sYXNzaWZpY2F0aW9uIjpbXSwiZGVjaXNpb24iOltdLCJrZXl3b3JkcyI6W10sInJvbGUiOltdLCJncm91cCI6W10sImRlcGFydG1l' +
      'bnQiOltdLCJhY3RpdmVEYXRlIjpudWxsLCJwcmlvcml0eSI6W10sImVmZmVjdGl2ZUVuZERhdGUiOm51bGwsImNyZWF0ZWRPbiI6bnVsbCw' +
      'iaXNBY3RpdmUiOltdLCJpZCI6W10sImFjdGlvblR5cGUiOltdLCJsaW5rZWRDaGFuZ2VPYmplY3QiOiIiLCJhZ2VuZGFDYXRlZ29yeSI6IiI' +
      'sImFjdGlvbkRhdGVzIjpbXSwiYWN0aW9uU3RhdHVzIjpbXSwiYWN0aW9uRGlzcGxheVN0YXR1cyI6W10sInRhZ3MiOltdfSwiY2FzZU9iamVjdCI6ImFnZW5kYSJ9';
    component.decodeQueryString();
    expect(component.quickFilterName).toBe('Sample test');
  });

  it('should set firstName of importedFilterObject when importQuery is triggered',  () => {
    component.importedFilterObject = { filterName: '', filterOptions: {} as FilterOptions, caseObject: '' };
    component.data = {
      body: {
        filterStateModel: 'testString'
      }
    };
    component.quickFilterName = 'filter1';
    component.importQuery('testString');
    expect(component.importedFilterObject.filterName).toBe('filter1');
  });

  it('should return true when validateFilterName is triggered and filter name is not valid',  () => {
    component.data = {
      body: {
        filterStateModel: 'testString'
      }
    };
    const returnValue = component.validateFilterName('testingString');
    expect(returnValue).toBe(false);
  });
});
