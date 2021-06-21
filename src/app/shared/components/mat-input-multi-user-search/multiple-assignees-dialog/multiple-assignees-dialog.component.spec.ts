import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {MatTableDataSource} from '@angular/material/table';
import {of, throwError} from 'rxjs';

import {MultipleAssigneesDialogComponent} from './multiple-assignees-dialog.component';
import {metaReducers, reducers} from '../../../../store';
import {UserGroupService} from '../../../../core/services/user-group.service';

describe('MultipleAssigneesDialogComponent', () => {
  let component: MultipleAssigneesDialogComponent;
  let fixture: ComponentFixture<MultipleAssigneesDialogComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleAssigneesDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: UserGroupService, useClass: UserGroupServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleAssigneesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return isAllSelected when isAllSelected is triggered',  () => {
    component.dataSource = new MatTableDataSource();
    component.selection = new SelectionModel(true, ['test']);
    const returnValue = component.isAllSelected();
    expect(returnValue).toBe(false);
  });

  it('should be datasource length greater then zero when onGroupSelected is triggered',  () => {
    const group = {value: 'test'};
    component.onGroupSelected(group);
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should be datasource length should be zero when onGroupSelected is triggered',  () => {
    const group = {value: ''};
    component.onGroupSelected(group);
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should call onError when onGroupSelected is triggered',  () => {
    const xService = fixture.debugElement.injector.get(UserGroupService);
    spyOn(xService, 'getGroupUserList').and.returnValue(throwError('test'));
    spyOn(component, 'onError');
    const group = {value: 'test'};
    component.onGroupSelected(group);
    expect(component.onError).toHaveBeenCalled();
  });

  it('should close dialog when onSelectUsers is triggered',  () => {
    spyOn(component.dialogRef, 'close');
    component.selection = new SelectionModel(true, []);
    component.onSelectUsers();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog when onCancelPress is triggered',  () => {
    spyOn(component.dialogRef, 'close');
    component.onCancelPress();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should set progressBar false when onError is triggered ',  () => {
    component.onError({});
    expect(component.progressBar).toBe(false);
  });

  it('should when masterToggle is triggered',  () => {
    spyOn(component.selection, 'clear');
    component.dataSource = new MatTableDataSource();
    component.masterToggle();
    expect(component.selection.clear).toHaveBeenCalled();
  });
});
class UserGroupServiceMock {
  getGroupUserList(value) {
    return of({users: [{userid: 'testUser'}]});
  }
}
