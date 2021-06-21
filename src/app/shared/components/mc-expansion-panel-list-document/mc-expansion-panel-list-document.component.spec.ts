import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {Observable, of, throwError} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormArray, FormControl} from '@angular/forms';

import {MCExpansionPanelListDocumentComponent} from './mc-expansion-panel-list-document.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {FileService} from '../../../core/services/file.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {environment} from '../../../../environments/environment';
import {StorageService} from '../../../core/services/storage.service';

describe('MCExpansionPanelListDocumentComponent', () => {
  let component: MCExpansionPanelListDocumentComponent;
  let fixture: ComponentFixture<MCExpansionPanelListDocumentComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCExpansionPanelListDocumentComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule,
        HttpClientModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock},
        {provide: FileService, useClass: FileServiceMock},
        {provide: StorageService, useClass: FileServiceMock},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MCExpansionPanelListDocumentComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.expansionPanelItemConfigurationList = [];
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have expansionPanelItemConfigurationList length greater then one when createItemList is triggered with filteredList array', () => {
    component.filteredList = [];
    component.filteredList.push({
      ID: 'dWvoiZ5rskmASwOO',
      name: 'CR - Side Panel  Action.png',
      tags: ['CBC'],
      uploadedBy: {userID: 'anikumar', fullName: 'Anil Kumar', email: 'anil.kumar-akvd@example.com', abbreviation: 'AKVD', departmentName: 'IT O&I Application Services Support'},
      uploadedOn: new Date()
    });
    component.createItemList();
    expect(component.expansionPanelItemConfigurationList.length).toBeGreaterThan(0);
  });

  it('it should open url in same window when downloadFile is triggered', () => {
    component.docUrl = `${environment.rootURL}mc${environment.version}/documents`;
    spyOn(window, 'open');
    component.downloadFile('1234');
    expect(window.open).toHaveBeenCalledWith(component.docUrl + '/1234', '_self');
  });

  it('should call refreshSidePanel on triggered remove', () => {
    spyOn(component, 'refreshSidePanel');
    const doc = {ID: '_R34mTtsXBMyzgON'};
    component.controlConfiguration = { tag: 'asIsPicture'};
    component.control = new FormArray([ new FormControl({ID: '_R34mTtsXBMyzgON',
      description: '',
      name: 'Captureasdsad.JPG',
      tags: ['asIsPicture'],
      uploadedBy: {abbreviation: 'Q04T',
        departmentName: 'MI DE EC&I Thermal Architecture DUV',
        email: 'q04test@example.com',
        fullName: 'Q 04test',
        userID: 'q04test'},
      uploadedOn: '2019-08-04T10:00:58.776Z'
    }), new FormControl({ID: '_R34mTtsXBMyzgON',
      description: '',
      name: 'Captureasdsad.JPG',
      tags: ['asIsPicture'],
      uploadedBy: {abbreviation: 'Q04T',
        departmentName: 'MI DE EC&I Thermal Architecture DUV',
        email: 'q04test@example.com',
        fullName: 'Q 04test',
        userID: 'q04test'},
      uploadedOn: '2019-08-04T10:00:58.776Z'
    })]);
    component.remove(doc);
    expect(component.refreshSidePanel).toHaveBeenCalled();
  });

  it('should dispatch an action to refresh side panel count when refreshSidePanel is triggered', () => {
    spyOn(component.appStore, 'dispatch');
    component.refreshSidePanel();
    expect(component.appStore.dispatch).toHaveBeenCalled();
  });

  it('should call createItemList method on initialization', () => {
    spyOn(component, 'createItemList');
    component.ngOnInit();
    expect(component.createItemList).toHaveBeenCalled();
  });

  it('should call createItemList when trigger ngOnChanges', () => {
    spyOn(component, 'createItemList');
    const simpleChange = {control: new SimpleChange(null, {value: [{name: 'test.txt',
          uploadedBy: {userID: 'anikumar'},
          ID: 'dThKxvlvMafdAhSe',
          uploadedOn: '2019-12-23T07:28:04.111Z',
          tags: ['CBC']}]}, false)};
    component.ngOnChanges(simpleChange);
    expect(component.createItemList).toHaveBeenCalled();
  });

  it('On Call of onDocumentAdd method should have filteredList length greater then one', () => {
    const docRef = {
      files: [{
        name: 'test.txt',
        lastModified: 1576739376033,
        lastModifiedDate: new Date(),
        webkitRelativePath: '',
        size: 1,
        uploadedBy: {},
        type: 'text/plain'
      }]
    };
    component.caseObject = {ID: '1234', revision: 'AA', type: 'ChangeRequest'};
    component.caseObjectType = 'ACTION-TYPE';
    spyOn(FormData.prototype, 'append');
    spyOn(window, 'Blob');
    component.control = new FormArray([ new FormControl({ID: '_R34mTtsXBMyzgON',
      description: '',
      name: 'Captureasdsad.JPG',
      tags: ['asIsPicture'],
      uploadedBy: {abbreviation: 'Q04T',
        departmentName: 'MI DE EC&I Thermal Architecture DUV',
        email: 'q04test@example.com',
        fullName: 'Q 04test',
        userID: 'q04test'},
      uploadedOn: '2019-08-04T10:00:58.776Z'
    })]);
    component.controlConfiguration = { tag: 'asIsPicture'};
    component.onDocumentAdd(docRef);
    expect(component.filteredList.length).toBeGreaterThan(0);
  });

  it('should set isBusy to false on error when onDocumentAdd is triggered',  () => {
    const xService = fixture.debugElement.injector.get(FileService);
    spyOn(xService, 'uploadFile').and.returnValue(throwError(new Error('test')));
    const docRef = {
      files: [{
        name: 'test.txt',
        lastModified: 1576739376033,
        lastModifiedDate: new Date(),
        webkitRelativePath: '',
        size: 1,
        uploadedBy: {},
        type: 'text/plain'
      }]
    };
    component.caseObject = {ID: '1234', revision: 'AA', type: 'ChangeRequest'};
    component.caseObjectType = 'ACTION-TYPE';
    spyOn(FormData.prototype, 'append');
    spyOn(window, 'Blob');
    component.controlConfiguration = { tag: 'asIsPicture'};
    component.onDocumentAdd(docRef);
    expect(component.isBusy).toBe(false);
  });

  it('should call custom alert when filelist is empty set on triggered of onDocumentAdd', function () {
    spyOn(component.customAlert, 'open');
    const docRef = {
      files: []
    };
    component.onDocumentAdd(docRef);
    expect(component.customAlert.open).toHaveBeenCalled();
  });
});
class UpdateFieldServiceMock {
  updateField$(): Observable<any> {
    return Observable.of();
  }
}

class FileServiceMock {
  uploadFile(formdata): any {
    if (formdata) {
      const returnObject = {
        DocumentElement: [{
          name: 'test.txt',
          uploadedBy: {userID: 'anikumar'},
          ID: 'dThKxvlvMafdAhSe',
          uploadedOn: '2019-12-23T07:28:04.111Z',
          tags: ['CBC']
        }]
      };
      return of(returnObject);
    }
  }

  removeFile(id) {
    return of('');
  }

  get(userProfile) {
    return {user: {
        abbreviation: 'AKVD',
        departmentName: 'IT Corporate Shared Services',
        email: 'anil.kumar-akvd@example.com',
        firstName: 'Anil',
        fullName: 'Anil Kumar',
        lastName: 'Kumar',
        memberships: [{
        }],
        notificationConfiguration: {},
        roles: ['coordinatorSCMPLM', 'development&EngineeringArchitect', 'development&EngineeringGroupLead', 'changeSpecialist2', 'changeSpecialist1', 'changeSpecialist3'],
        state: {'navBarState': {'isLeftPanelOpen': true}},
        userID: 'anikumar'
      }};
  }
}
