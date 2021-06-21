import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { FormControlConfiguration } from '../../models/mc-configuration.model';
import { Document, Note, NoteElement, User } from '../../models/mc.model';
import { FileService } from '../../../core/services/file.service';
import { environment } from '../../../../environments/environment';
import { MCFormGroupService } from '../../../core/utilities/mc-form-group.service';
import { HelpersService } from '../../../core/utilities/helpers.service';
import { NotesService } from '../../../core/services/notes.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-add-notes',
  template: ''
})
export class MCAddNotesComponent implements OnInit {
  addCommentControlConfiguration: FormControlConfiguration;
  newNoteAttachments: Document[];
  docUrl: string;
  data: any;
  noteForm: FormGroup;

  constructor(public readonly formBuilder: FormBuilder,
              private readonly configurationService: ConfigurationService,
              public readonly helpersService: HelpersService,
              public readonly teamCenterService: FileService,
              public mcFormGroupService: MCFormGroupService,
              public notesService?: NotesService,
              public dialogRef?: MatDialogRef<any>) {
    this.newNoteAttachments = [];
    this.docUrl = `${environment.rootURL}mc${environment.version}/documents`;
  }

  ngOnInit() {
    this.noteForm = this.mcFormGroupService.createNoteSummaryFormGroup({});
    if (this.data.parentPage !== 'ReviewEntryPage') {
      this.getNoteObject();
    }
    this.addCommentControlConfiguration = {
      placeholder: this.data.placeHolder || 'Add comment',
      help: this.data.placeHolder || 'Add comment',
      label: this.data.placeHolder || 'Add comment',
      hint: '',
      tag: ''
    } as FormControlConfiguration;
  }

  initializeNotesComponent(data: any): void {
    this.data = data;
  }

  constructNotesForm(note: any): void {
    this.noteForm = this.mcFormGroupService.createNoteSummaryFormGroup(note);
    this.noteForm.get('note').get('note').setValidators(Validators.required);
  }

  getNoteObject(): any {
    if (this.data.mode === 'Add') {
      this.notesService.createNote(this.getCaseObjectURLPath(), this.data.parentNotesForm.ID).subscribe((res: NoteElement) => {
        if (res) {
          this.constructNotesForm({ 'note': res });
        }
      });
    } else {
      this.constructNotesForm({ 'note': this.data.note });
      this.newNoteAttachments = this.data.note ? this.data.note.documents : [];
    }
  }

  getCaseObjectURLPath(): string {
    switch (this.data.parentPage) {
      case 'Action':
        return 'actions';
      case 'AgendaItem':
        return 'agenda-items';
      case 'ReviewEntry':
      case 'ReviewEntryPage':
        return 'review-entries';
    }
  }

  addNoteAttachment(noteDocRef) {
    const fileList: FileList = noteDocRef.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('xxxxxx', this.data.parentNotesForm.ID);
      formData.append('case-id', this.data.parentNotesForm.ID);
      formData.append('case-type', this.data.parentPage === 'ReviewEntryPage' ? 'ReviewEntry' : this.data.parentPage);
      formData.append('file-name', file, file.name);
      formData.append('case-revision', 'AA');
      if (this.noteForm && this.noteForm.get('note') && this.noteForm.get('note.ID') && this.noteForm.get('note.ID').value) {
        formData.append('note-id', this.noteForm.get('note.ID').value);
      }
      // do a service call here
      this.teamCenterService.uploadFile(formData).subscribe(
        (fileObj: any) => {
          if (fileObj && fileObj.DocumentElement && fileObj.DocumentElement.ID) {
            const attachObj = {
              'name': fileObj.DocumentElement.name,
              'uploadedBy': new User(this.configurationService.getUserProfile()),
              'uploadedOn': fileObj.DocumentElement.updatedOn || new Date(),
              'ID': fileObj.DocumentElement.ID,
              'tags': ['note']
            } as Document;
            this.newNoteAttachments.push(new Document(attachObj));
          }
        },
        () => {

        });
    }
  }

  resetNoteFormGroup(): void {
    this.constructNotesForm(this.helpersService.getDefaultNoteSummaryObject(new User(this.configurationService.getUserProfile())));
    this.newNoteAttachments = [];
  }

  onCancelPress(updatedCount?: number): void {
    if (this.noteForm && this.noteForm.get('note.status').value === 'DRAFT') {
      this.deleteNote(updatedCount);
    } else if (updatedCount) {
      this.dialogRef.close(updatedCount);
    }
  }

  deleteNote(updatedCount?: number): void {
    this.notesService.deleteNote(this.getCaseObjectURLPath(), this.data.parentNotesForm.ID, this.noteForm.get('note.ID').value).subscribe(() => {
      this.dialogRef.close(updatedCount ? updatedCount : 'refreshNotes');
    });
  }

  saveNote(): void {
    const newNote = this.getAddedNote();
    if (newNote.documents && !newNote.documents.length) {
      delete newNote.documents;
    }
    this.notesService.saveNote(this.getCaseObjectURLPath(), this.data.parentNotesForm.ID, newNote, 'save').subscribe((res: NoteElement) => {
      if (res) {
        this.dialogRef.close('refreshNotes');
      }
    });
  }

  getAddedNote(): Note {
    const newNote = this.noteForm.get('note').value;
    newNote.documents = this.newNoteAttachments;
    return newNote;
  }
}
