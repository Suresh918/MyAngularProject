import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {of} from 'rxjs';

import {HelpersService} from '../../../../../core/utilities/helpers.service';
import {ProjectMatDialogLinkedChangeRequestsComponent} from './project-mat-dialog-linked-change-requests.component';
import {ProjectLinkedChangeRequestDialogService} from './project-mat-dialog-linked-change-requests.service';

describe('MatDialogLinkedChangeRequestsComponent', () => {
  let component: ProjectMatDialogLinkedChangeRequestsComponent;
  let fixture: ComponentFixture<ProjectMatDialogLinkedChangeRequestsComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMatDialogLinkedChangeRequestsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, MatPaginatorModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: dialogMock},
        {
          provide: MAT_DIALOG_DATA, useValue: {
            workingChangeRequestID: 12345,
            caseObjectListId: ['123', '124']
          }
        },
        {provide: HelpersService, useClass: HelpersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMatDialogLinkedChangeRequestsComponent);
    component = fixture.componentInstance;
    component.paginator = {page: new EventEmitter<PageEvent>()} as MatPaginator;
    component.paginator.pageIndex = 1;
    component.paginator.pageSize = 25;
    component.changeRequestSearchForm = new FormGroup({
      changeRequestSearchControl: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog, when linkProblems is triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.selectedChangeRequestItems = [{selected: true}, {selected: true}, {selected: false}];
    component.linkProblems();
    expect(component.dialogRef.close).toHaveBeenCalledWith([{selected: true}, {selected: true}]);
  });

  it('should close the dialog, when onClose is triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onClose();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should set disableOthers, when disableOtherCheckboxes is triggered', () => {
    component.selectedChangeRequestItems = [{selected: true}];
    component.disableOtherCheckboxes({checked: false});
    expect(component.disableOthers).toEqual(false);
  });

  it('should set results, when linkedChangeRequests$ service call returns successful response', () => {
    jasmine.clock().install();
    component.paginator = {page: new EventEmitter<PageEvent>()} as MatPaginator;
    component.paginator.pageIndex = 1;
    component.paginator.pageSize = 25;
    const xService = fixture.debugElement.injector.get(ProjectLinkedChangeRequestDialogService);
    spyOn(xService, 'linkedChangeRequests$').and.returnValue(of({
      results: [{
        id: 12,
        title: 'New CR',
        status: 1,
        customer_impact: 'MINOR',
        preinstall_impact: 'NONE',
        implementation_priority: 1
      }],
      total_elements: 1
    }));
    component.changeRequestSearchForm.get('changeRequestSearchControl').setValue('1234');
    fixture.detectChanges();
    jasmine.clock().tick(1000);
    fixture.detectChanges();
    jasmine.clock().uninstall();
    expect(component.resultsLength).toEqual(1);
  });

  it('should set progressBar as false, when linkedChangeRequests$ service call throws an error', () => {
    jasmine.clock().install();
    component.paginator = {page: new EventEmitter<PageEvent>()} as MatPaginator;
    component.paginator.pageIndex = 1;
    component.paginator.pageSize = 25;
    const xService = fixture.debugElement.injector.get(ProjectLinkedChangeRequestDialogService);
    spyOn(xService, 'linkedChangeRequests$').and.throwError('');
    component.changeRequestSearchForm.get('changeRequestSearchControl').setValue('1234');
    fixture.detectChanges();
    jasmine.clock().tick(1000);
    fixture.detectChanges();
    jasmine.clock().uninstall();
    expect(component.progressBar).toEqual(false);
  });
});

class ProjectLinkedChangeRequestDialogServiceMock {
  linkedChangeRequests$(changeRequestID, excludeChangeRequestWithId, page, size) {
    return of({
      results: [{
        id: 12,
        title: 'New CR',
        status: 1,
        customer_impact: 'MINOR',
        preinstall_impact: 'NONE',
        implementation_priority: 1
      }],
      total_elements: 1
    });
  }
}

class HelpersServiceMock {
  getCRStatusLabelFromStatus(status) {
    return '';
  }
}
