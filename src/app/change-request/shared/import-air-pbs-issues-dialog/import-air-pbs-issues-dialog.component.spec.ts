import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {of} from 'rxjs';

import {ImportAirPbsIssuesDialogComponent} from './import-air-pbs-issues-dialog.component';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../change-request.service';
import {McFormGroupPresentationService} from '../../../core/utilities/mc-form-group-presentation.service';


describe('ImportAirPbsIssuesDialogComponent', () => {
  let component: ImportAirPbsIssuesDialogComponent;
  let fixture: ComponentFixture<ImportAirPbsIssuesDialogComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  const dialogMock = {
    close: () => { },
    open: () => { }
  };
  const locationMock = {
    go: jasmine.createSpy('go')
  };
  const data = {
    linkedAirIds: [],
    linkedPbsIds: [1],
    trigger: ''
  };
  const stepper = jasmine.createSpyObj('MatStepper', ['next', 'previous']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAirPbsIssuesDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: Location, useValue: locationMock},
        {provide: MAT_DIALOG_DATA, useValue: data},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: McFormGroupPresentationService, useClass: McFormGroupPresentationServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAirPbsIssuesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set enableStepper, when onConfirmInfo is triggered', () => {
    component.linkedPbsIds = [];
    component.trigger = 'pbs';
    component.onConfirmInfo();
    expect(component.enableStepper).toEqual(true);
  });

  it('should successfully link AIR items and close the dialog, when linkAIRIssues service returns response with successful statuses', () => {
    spyOn(component.dialogRef, 'close');
    component.trigger = 'air';
    component.portationFormGroupArray = new FormArray([
      new FormGroup({
        number: new FormControl(1),
        itemType: new FormControl('air'),
        action: new FormControl('link'),
        selected: new FormControl(true)
      })
    ]);
    component.selectedItemsToImport = [{number: 1, itemType: 'air', action: 'link', selected: true}];
    component.data.changeRequestID = 1;
    component.importIssues();
    expect(component.dialogRef.close).toHaveBeenCalledWith([1]);
  });

  it('should fail to link AIR items, when linkAIRIssues service returns response with unsuccessful statuses', () => {
    component.trigger = 'air';
    component.data.changeRequestID = 2;
    component.importIssues();
    expect(component.importError).toEqual(true);
  });

  it('should fail to link AIR items, when linkAIRIssues service fails to return a response', () => {
    component.trigger = 'air';
    component.data.changeRequestID = 3;
    component.importIssues();
    expect(component.showCloseButton).toEqual(true);
  });

  it('should successfully link PBS items and close the dialog, when linkPBSIssues service returns response with successful statuses', () => {
    spyOn(component.dialogRef, 'close');
    component.trigger = 'pbs';
    component.data.changeRequestID = 1;
    component.importIssues();
    expect(component.dialogRef.close).toHaveBeenCalledWith([]);
  });

  it('should fail to link PBS items, when linkPBSIssues service returns response with unsuccessful statuses', () => {
    component.trigger = 'pbs';
    component.data.changeRequestID = 2;
    component.importIssues();
    expect(component.importError).toEqual(true);
  });

  it('should fail to link PBS items, when linkPBSIssues service fails to return a response', () => {
    component.trigger = 'pbs';
    component.data.changeRequestID = 3;
    component.importIssues();
    expect(component.showCloseButton).toEqual(true);
  });

  it('should open NavigationConfirmation dialog, when selectedItemsToImport has items and cancel is triggered', () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.selectedItemsToImport = [{id: 1}];
    component.cancel(true);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should navigate back to CR details page, when selectedItemsToImport has no items and cancel is triggered', () => {
    component.selectedItemsToImport = [];
    component.cancel(true);
    expect(component.location.go).toHaveBeenCalled();
  });

  it('should set stepper index as 2, when selectedItemsToImport has an item and onClickNext is triggered', () => {
    component.selectedItemsToImport = [{id: 1}];
    component.onClickNext();
    expect(component.stepper.selectedIndex).toEqual(2);
  });

  it('should navigate to the next step, when selectedItemsToImport has no items and onClickNext is triggered', () => {
    component.stepper = stepper;
    component.selectedItemsToImport = [];
    component.onClickNext();
    expect(component.stepper.next).toHaveBeenCalled();
  });

  it('should navigate to the previous step, when onClickPrevious is triggered', () => {
    component.stepper = stepper;
    component.selectedItemsToImport = [];
    component.onClickPrevious();
    expect(component.stepper.previous).toHaveBeenCalled();
  });

  it('should trigger stopPropagation, when enableStepper is false and onStepSelection is triggered', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    component.onStepSelection(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set selectedStepIndex, when enableStepper is true and onStepSelection is triggered', () => {
    component.enableStepper = true;
    component.onStepSelection({selectedIndex: 2});
    expect(component.selectedStepIndex).toEqual(2);
  });
});

class ConfigurationServiceMock {
  getFormFieldParameters(field) {
    return {};
  }
}

class ChangeRequestServiceMock {
  linkAIRIssues(data, id) {
    switch (id) {
      case 1: return of([{link_status: 'SUCCESS', import_status: 'SUCCESS'}]);
      case 2: return of([{}]);
      case 3: return of([]);
    }
  }
  linkPBSIssues(data, id) {
    switch (id) {
      case 1: return of([{link_status: 'SUCCESS', import_status: 'SUCCESS'}]);
      case 2: return of([{}]);
      case 3: return of([]);
    }
  }
}

class McFormGroupPresentationServiceMock {
  createPortationFormGroupArray(data) {
    return {};
  }
}
