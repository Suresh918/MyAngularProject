import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {CreatorChangeRequestDefineScopeDialogComponent} from './creator-change-request-define-scope-dialog.component';
import {UserProfileService} from '../../../../../core/services/user-profile.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../../../change-request.service';

describe('CreatorChangeRequestDefineScopeDialogComponent', () => {
  let component: CreatorChangeRequestDefineScopeDialogComponent;
  let fixture: ComponentFixture<CreatorChangeRequestDefineScopeDialogComponent>;
  const dialogMock = {
    open: () => {},
    close: () => {}
  };
  const stepper = jasmine.createSpyObj('MatStepper', ['next', 'previous']);

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorChangeRequestDefineScopeDialogComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        FormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {
          provide: MAT_DIALOG_DATA, useValue: {
            changeRequestConfiguration: {},
            changeRequestFormGroup: new FormGroup({
              issue_types: new FormControl('PROCEDURE'),
              scope: new FormGroup({
                parts: new FormControl(null),
                packaging: new FormControl(null),
                tooling: new FormControl(null),
                bop: new FormControl(null),
                packaging_detail: new FormGroup({
                  reusable_packaging: new FormControl(null),
                  shipping_packaging: new FormControl(null),
                  storage_packaging: new FormControl(null),
                  supplier_packaging: new FormControl(null),
                }),
                part_detail: new FormGroup({
                  dev_bag_part: new FormControl(null),
                  fco_upgrade_option_csr: new FormControl(null),
                  machine_bom_part: new FormControl(null),
                  preinstall_part: new FormControl(null),
                  service_part: new FormControl(null),
                  test_rig_part: new FormControl(null),
                }),
                tooling_detail: new FormGroup({
                  manufacturing_de_tooling: new FormControl(null),
                  service_tooling: new FormControl(null),
                  supplier_tooling: new FormControl(null),
                })
              })
            })
          }
        },
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChangeRequestDefineScopeDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set enableStepper, when ngOnInit is triggered', () => {
    component.ngOnInit();
    expect(component.enableStepper).toEqual(true);
  });

  it('should call setValidations, when ngAfterViewInit is triggered', () => {
    const spy = spyOn(component, 'setValidations');
    component.stepper = stepper;
    component.stepper.selectedIndex = 1;
    const dummyElement = document.createElement('div');
    spyOnProperty(dummyElement, 'children').and.returnValue([{}, {}, {}, {}]);
    document.querySelector = jasmine.createSpy('.mat-horizontal-stepper-header-container').and.returnValue(dummyElement);
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call openWarningDialog, when onClickNext is triggered', () => {
    const spy = spyOn(component, 'openWarningDialog');
    component.changeRequestFormGroup.setControl('change_specialist1', new FormControl({full_name: 'Test'}));
    component.changeRequestFormGroup.get('scope.parts').setValue('IN-SCOPE');
    component.onClickNext();
    expect(spy).toHaveBeenCalled();
  });

  it('should open SwitchOwnerConfirmationDialog, when openWarningDialog is triggered', () => {
    const spy = spyOn(component.dialog, 'open');
    component.changeRequestFormGroup.setControl('change_specialist1', new FormControl({full_name: 'Test'}));
    component.changeRequestFormGroup.get('scope.parts').setValue('IN-SCOPE');
    component.openWarningDialog('CREATOR', 'Parts');
    expect(spy).toHaveBeenCalled();
  });
});

class UserProfileServiceMock {
  getStatesData() {
    return {
      changeRequestState: {
        detailsPageState: {
          showInfoDialog: false
        }
      }
    };
  }
}

class ConfigurationServiceMock {
  getFormFieldParameters(caseObject) {
    return {};
  }
}

class ChangeRequestServiceMock {

}
