import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';

import {MCAddNotesComponent} from './add-notes.component';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {NotesService} from '../../../core/services/notes.service';
import { FileService } from '../../../core/services/file.service';
import { StorageService } from '../../../core/services/storage.service';


describe('MCAddNotesComponent', function () {
  let fixture: ComponentFixture<MCAddNotesComponent>;
  let component: MCAddNotesComponent;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatDialogModule, HttpClientModule],
      declarations: [MCAddNotesComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: NotesService, useClass: NotesServiceMock},
        {provide: FileService, useClass: FileServiceMock},
        {provide: StorageService, useClass: StorageServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MCAddNotesComponent);
    component = fixture.componentInstance;
    component.noteForm = new FormGroup({note: new FormControl('')});
    component.data = {
      'placeHolder': 'Add comment',
      'label': 'Add comment'
    };
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    const dialogCloseSpy = spyOn(component.dialogRef, 'close');
    fixture.detectChanges();
    component.noteForm = new FormGroup({
      note: new FormGroup({
        status: new FormControl(''),
        ID: new FormControl('123456')
      })
    });
    component.onCancelPress(1);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  it('should close the dialog on create', () => {
    const dialogCloseSpy = spyOn(component.dialogRef, 'close');
    fixture.detectChanges();
    component.data = {parentNotesForm: {ID: '111'}, parentPage: 'Action'};
    component.saveNote();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  it('should update data', () => {
    const data = {
      'placeHolder': 'Add comment'
    };
    component.initializeNotesComponent(data);
    expect(component.data.placeHolder).toBe('Add comment');
  });

  it('should reset noteform group', () => {
    component.resetNoteFormGroup();
    expect(component.noteForm.get('note').get('note').validator({} as AbstractControl).required).toBe(true);
  });

  it('should set value to constructNotesForm on triggered of getNoteObject',  () => {
    component.data = {mode: 'Add', parentNotesForm: {ID: '123456'}};
    component.getNoteObject();
    expect(component.constructNotesForm.name).toBe('');
  });

  it('should be length of newNoteAttachments greater then zero when addNoteAttachment is triggered', function () {
    component.noteForm = new FormGroup({
      note: new FormGroup({
        ID: new FormControl('123456')
      })
    });

    const noteDocRef = {
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
    spyOn(FormData.prototype, 'append');
    spyOn(window, 'Blob');
    component.data = {mode: 'Add', parentNotesForm: {ID: '123456'}, parentPage : 'ReviewEntryPage'};
    component.addNoteAttachment(noteDocRef);
    expect(component.newNoteAttachments.length).toBeGreaterThan(0);
  });

  it('should return value when getCaseObjectURLPath is triggered',  () => {
    component.data = {parentPage: 'AgendaItem'};
    const returnValue1 = component.getCaseObjectURLPath();
    expect(returnValue1).toBe('agenda-items');
    component.data = {parentPage: 'ReviewEntryPage'};
    const returnValue2 = component.getCaseObjectURLPath();
    expect(returnValue2).toBe('review-entries');
  });

  it('should call deleteNote when onCancelPress is triggered',  () => {
    spyOn(component, 'deleteNote');
    component.noteForm = new FormGroup({
      note: new FormGroup({
        status: new FormControl('DRAFT')
      })
    });
    component.onCancelPress();
    expect(component.deleteNote).toHaveBeenCalled();
  });

  it('dialog should close ', () => {
    spyOn(component.dialogRef, 'close');
    component.data = {
      parentNotesForm: {
        ID: '123456'
      }
    };
    component.noteForm = new FormGroup({
      note: new FormGroup({
        status: new FormControl('DRAFT'),
        ID: new FormControl('123456')
      })
    });
    component.deleteNote(2);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
class MCFormGroupServiceMock {
  createNoteSummaryFormGroup() {
    return new FormGroup({
      note: new FormGroup({
        note: new FormControl(''),
        status: new FormControl(''),
        ID: new FormControl('')
      })
    });
  }
}

class HelpersServiceMock {
  getDefaultNoteSummaryObject() {
    return new FormGroup({note: new FormControl('')});
  }
}
class NotesServiceMock {
  saveNote(path, id, newNote, action) {
    return of({});
  }
  createNote(path, id) {
    return of({test: 'test'});
  }
  deleteNote(path) {
    return of({});
  }
}
class FileServiceMock {
  uploadFile(formData) {
    return of({DocumentElement: {ID: '123456', name: 'test doc name', updatedOn: new Date()}});
  }
}
class StorageServiceMock {
  get(value) {
    return {user: {name: 'test'}};
  }
}
