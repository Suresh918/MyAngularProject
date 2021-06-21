import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {McProjectPicturesComponent} from './mc-project-pictures.component';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';
import {StoreModule} from '@ngrx/store';

import {ChangeRequestService} from '../../../../change-request.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {MCFormGroupService} from '../../../../../core/utilities/mc-form-group.service';
import {metaReducers, reducers} from '../../../../../store';


describe('McProjectPicturesComponent', () => {
  let component: McProjectPicturesComponent;
  let fixture: ComponentFixture<McProjectPicturesComponent>;
  const dialogMock = {
    close: () => { },
    open: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McProjectPicturesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, MatSnackBarModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McProjectPicturesComponent);
    component = fixture.componentInstance;
    component.caseObject = 'ChangeRequest';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace current As Is Picture image with a newly selected image, when pictureChange is triggered', () => {
    component.control = new FormArray([new FormGroup({
      tags: new FormControl('AS-IS-PICTURE')
    })]);
    component.asIsState = new FormGroup({id: new FormControl(1)});
    const blob = new Blob([''], {type: 'text/html'});
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = <File>blob;
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    component.pictureChange({files: fileList}, {tag: 'AS-IS-PICTURE'});
    expect(component.asIsState.get('id').value).toEqual(123);
  });

  it('should replace current To Be Picture image with a newly selected image, when pictureChange is triggered', () => {
    component.control = new FormArray([new FormGroup({
      tags: new FormControl('TO-BE-PICTURE')
    })]);
    component.toBeState = new FormGroup({id: new FormControl(1)});
    const blob = new Blob([''], {type: 'text/html'});
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = <File>blob;
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    component.pictureChange({files: fileList}, {tag: 'TO-BE-PICTURE'});
    expect(component.toBeState.get('id').value).toEqual(123);
  });

  it('should set progressBar as false, when updateFile service returns invalid data', () => {
    component.control = new FormArray([new FormGroup({
      tags: new FormControl('TO-BE-PICTURE')
    })]);
    component.toBeState = new FormGroup({id: new FormControl(1)});
    const blob = new Blob([''], {type: 'text/html'});
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = <File>blob;
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'updateFile').and.returnValue(of(null));
    component.pictureChange({files: fileList}, {tag: 'TO-BE-PICTURE'});
    expect(component.progressBar).toEqual(false);
  });

  it('should make uploadFile service call, when tag is not either AS-IS-PICTURE or TO-BE-PICTURE and pictureChange is triggered', () => {
    spyOn(component, 'displayPicture');
    const blob = new Blob([''], {type: 'text/html'});
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = <File>blob;
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    component.pictureChange({files: fileList}, {tag: 'TEST'});
    expect(component.displayPicture).toHaveBeenCalled();
  });

  it('should set progressBar as false, when uploadFile service call returns invalid data', () => {
    spyOn(component, 'displayPicture');
    const blob = new Blob([''], {type: 'text/html'});
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename';
    const file = <File>blob;
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => file
    };
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'uploadFile').and.returnValue(of(null));
    component.pictureChange({files: fileList}, {tag: 'TEST'});
    expect(component.progressBar).toEqual(false);
  });

  it('should remove current To Be Picture, when remove is triggered', () => {
    component.control = new FormArray([new FormGroup({
      tags: new FormControl('TO-BE-PICTURE'),
      id: new FormControl(1)
    })]);
    component.toBeState = new FormGroup({id: new FormControl(1)});
    component.remove(1, new FormGroup({tags: new FormControl('TO-BE-PICTURE')}));
    expect(component.toBeState.value).toEqual({});
  });

  it('should remove current As Is Picture, when remove is triggered', () => {
    component.control = new FormArray([new FormGroup({
      tags: new FormControl('AS-IS-PICTURE'),
      id: new FormControl(1)
    })]);
    component.asIsState = new FormGroup({id: new FormControl(1)});
    component.remove(1, new FormGroup({tags: new FormControl('AS-IS-PICTURE')}));
    expect(component.asIsState.value).toEqual({});
  });

  it('should set As Is Picture, when pasteSelection is triggered', () => {
    spyOn(component, 'pictureChange');
    const file = new File([
      JSON.stringify({ping: true})
    ], 'ping.json', {type: 'application/json'});
    const evt = {
      dataTransfer: {
        file,
        items: [file].map(res => ({
          kind: 'file',
          type: res.type,
          getAsFile: () => res
        })),
        types: ['Files']
      }
    };
    component.pasteSelection({originalEvent: {clipboardData:  evt.dataTransfer}}, {tag: 'AS-IS-PICTURE'});
    expect(component.pictureChange).toHaveBeenCalled();
  });

  it('should open dialog, when As Is Picture exists and openImageDialog is triggered', () => {
    spyOn(component.dialog, 'open');
    component.asIsState = new FormGroup({
      id: new FormControl(1),
      name: new FormControl('Test JPG'),
      creator: new FormControl({
        fullName: 'TestUser'
      }),
      created_on: new FormControl('')
    });
    component.openImageDialog(1);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open dialog, when To Be Picture exists and openImageDialog is triggered', () => {
    spyOn(component.dialog, 'open');
    component.toBeState = new FormGroup({
      id: new FormControl(1),
      name: new FormControl('Test JPG'),
      creator: new FormControl({
        fullName: 'TestUser'
      }),
      created_on: new FormControl('')
    });
    component.openImageDialog(1);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open dialog, when As Is Picture and To Be Picture exist and openImageDialog is triggered', () => {
    spyOn(component.dialog, 'open');
    component.asIsState = new FormGroup({
      id: new FormControl(1),
      name: new FormControl('Test JPG'),
      creator: new FormControl({
        fullName: 'TestUser'
      }),
      created_on: new FormControl('')
    });
    component.toBeState = new FormGroup({
      id: new FormControl(2),
      name: new FormControl('Test JPG1'),
      creator: new FormControl({
        fullName: 'TestUser'
      }),
      created_on: new FormControl('')
    });
    component.openImageDialog(1);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should set asIsState, when control has value and ngOnChanges is triggered',  () => {
    component.asIsControlConfiguration = {
      tag: 'AS-IS-PICTURE'
    };
    component.toBeControlConfiguration = {
      tag: 'TO-BE-PICTURE'
    };
    const simpleChange = {control: new SimpleChange(null, new FormArray([new FormGroup({
        tags: new FormControl('AS-IS-PICTURE'),
        id: new FormControl(1),
        content: new FormControl('test')
      })])
        , false)};
    component.ngOnChanges(simpleChange);
    expect(component.asIsState.value).toEqual({
      tags: 'AS-IS-PICTURE',
      id: 1,
      content: 'test'
    });
  });
});

class ChangeRequestServiceMock {
  updateFile(caseObjectId, formData, tag) {
    switch (tag) {
      case 'AS-IS-PICTURE':
      case 'TO-BE-PICTURE':
        return of({
          id: 123,
          name: 'xyz.jpg',
          created_on: ''
        });
      default:
        return of(null);
    }
  }

  uploadFile(caseObjectId, formData, tag) {
    return of({
      id: 123,
      name: 'xyz.jpg',
      created_on: ''
    });
  }

  removeFile(id) {
    return of(null);
  }
}

class ConfigurationServiceMock {
  getUserProfile() {
    return {
      user_id: 1,
      full_name: 'Test User',
      department: 'UI',
      email: 'test@example.com',
      abbreviation: 'TST01'
    };
  }
}

class MCFormGroupServiceMock {
  createDocumentFormGroup2() {
    return new FormGroup({});
  }

  createDocumentFormGroup() {
    return new FormGroup({});
  }
}
