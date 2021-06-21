import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject, Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {selectFileDragState} from '../../../store';
import {FileDragData, MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {fileUploadDragAction} from '../../../store/actions/file-upload.actions';
import {FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {
  Agenda,
  AgendaItem,
  ChangeNotice,
  ChangeRequest,
  Document,
  ReleasePackage,
  Review,
  User
} from '../../../shared/models/mc.model';
import {FileService} from '../../../core/services/file.service';
import {MatDialogNavigationConfirmationComponent} from '../../../shared/components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {setRightPanelFormDirty} from '../../store';
import {MatDialogDeleteConfirmationComponent} from '../../../shared/components/mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {SidePanelService} from '../../side-panel.service';

@Component({
  selector: 'mc-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss']
})
export class FileUploadFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  formDataGroup: FormGroup;
  @Input()
  formDataControlConfiguration: FormControlConfiguration;
  @Input()
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem | Review;
  @Input()
  caseObjectType: string;
  @Input()
  editingForm?: boolean;
  @Input()
  documentDeleted?: Subject<void>;
  @Input()
  commentId: string;
  @Output() readonly cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly saveForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly disableAdd?: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly deleteDocument?: EventEmitter<string> = new EventEmitter<string>();
  fileDragSubscription$: Subscription;
  highlightDropZone: boolean;
  newAttachments: Document[];
  dropAreaText: string;
  fileList: any[];
  isFormDirty: boolean;
  otherDocuments: string;
  deletedFileIndex?: number;
  fileUploadInProgress: boolean;
  showAttachments: boolean;
  oldDescription: string;

  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly fileService: FileService,
              private readonly sidePanelService: SidePanelService,
              private readonly configurationService: ConfigurationService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly matDialog: MatDialog,
              private readonly matSnackBar: MatSnackBar,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly zone: NgZone) {
    this.newAttachments = [];
    this.resetDropArea();
    this.isFormDirty = false;
    this.otherDocuments = '';
    this.fileList = [];
    this.fileUploadInProgress = false;
    this.showAttachments = false;
  }

  ngOnInit() {
    this.oldDescription = (this.formDataGroup && this.formDataGroup.get('description')) ? this.formDataGroup.get('description').value : '';
    if (this.formDataControlConfiguration.tag === 'other') {
      this.otherDocuments = 'documents';
    }
    this.registerFileDragSubscriber();
    this.dispatchSidePanelFormState();
    if (this.documentDeleted) {
      this.registerDocumentDelete();
    }
    this.formDataGroup.valueChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  registerDocumentDelete() {
    this.documentDeleted.subscribe(() => {
      if (this.deletedFileIndex !== undefined && this.deletedFileIndex !== null) {
        this.fileList.splice(this.deletedFileIndex, 1);
        this.isFormDirty = true;
        this.changeDetectorRef.detectChanges();
        if (this.disableAdd) {
          this.disableAdd.emit(!this.addDocumentAllowed());
        }
        this.editingForm = false;
      }
    });
  }

  dispatchSidePanelFormState(): void {
    if (this.formDataGroup && (this.formDataGroup.get('description') || this.formDataGroup.get('note').get('note'))) {
      const targetControl = this.formDataGroup.get('description') || this.formDataGroup.get('note').get('note');
      targetControl.statusChanges.subscribe(() => {
        this.sidePanelStore.dispatch(setRightPanelFormDirty(targetControl.dirty));
      });
    }
  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges.formDataGroup) {
      this.newAttachments = [];
      this.fileList = [];
      if (this.editingForm) {
        if (this.caseObjectType === 'review') {
          this.fileList.push(...simpleChanges.formDataGroup.currentValue.value.note.documents);
        } else {
          this.fileList.push(simpleChanges.formDataGroup.currentValue.value);
        }
      }
      if (this.formDataGroup.get('note') && this.formDataGroup.get('attachments') && this.formDataGroup.get('attachments').value && this.caseObjectType !== 'review') {
        this.fileList = this.formDataGroup.get('attachments').value.map((attachment) => attachment.document) || [];
      }
    }
  }

  registerFileDragSubscriber() {
    this.fileDragSubscription$ = this.appStore.pipe(select(selectFileDragState)).subscribe((res: FileDragData) => {
      const highlightDropArea = res.dropAreaHighlighted && this.addDocumentAllowed();
      if (res && highlightDropArea && !res.dropAreaHighlighted.valueOf()) {
        this.highlightDropZone = (res.action === 'enter');
        if (res.action === 'enter') {
          this.appStore.dispatch(fileUploadDragAction({
            'action': 'enter',
            'dropAreaHighlighted': true
          } as FileDragData));
        } else if (res.action === 'drop') {
          this.onDocumentAdd(event);
          this.resetDropArea();
        } else {
          this.resetDropArea();
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  addDocumentAllowed() {
    return (this.otherDocuments !== 'documents' || this.fileList.length === 0);
  }

  resetDropArea() {
    this.highlightDropZone = false;
    this.dropAreaText = 'Drop your files here';
  }

  onDocumentAdd(event) {
    this.zone.run(() => {
      this.showAttachments = true;
      if (event.preventDefault) {
        this.stopAndPrevent(event);
      }
      if (!this.addDocumentAllowed()) {
        return;
      }
      if (event.files && event.files.length) {
        this.fileList.push(event.files[0]);
        this.isFormDirty = true;
        this.sidePanelStore.dispatch(setRightPanelFormDirty(true));
      } else if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        this.isFormDirty = true;
        this.sidePanelStore.dispatch(setRightPanelFormDirty(true));
        for (const file of event.dataTransfer.files) {
          this.fileList.push(file);
        }
      }
      if (this.otherDocuments === 'documents' && this.fileList.length > 1) {
        this.fileList = [];
        this.showMessage();
      }
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
      this.resetDropArea();
      if (this.disableAdd) {
        this.disableAdd.emit(!this.addDocumentAllowed());
      }
      this.changeDetectorRef.detectChanges();
      if (this.formDataGroup.get('note')) {
        this.saveFiles(0);
      }
      this.isFormDirty = true;
    });
  }

  showMessage() {
    this.resetDropArea();
    this.changeDetectorRef.detectChanges();
    this.matSnackBar.open(`Adding multiple files is not allowed`, '', {duration: 2000});
  }

  createFileUploadRequest(fileCount, formData) {
    const file: File = this.fileList[fileCount];
    if (this.caseObjectType === 'review') {
      if (file && file.name) {
        formData.append('file', file, file.name);
      }
      formData.append('description', this.formDataGroup.get('description') ? this.formDataGroup.get('description').value : '');
      formData.append('tags', this.formDataControlConfiguration.tag.toUpperCase());
    } else if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      if (file && file.name) {
        formData.append('file', file, file.name);
        // Setting formdata for Document attached to the Comment
        if (this.commentId) {
          formData.append('description', this.formDataGroup.get('note').get('note').value);
          formData.append('tags', this.formDataControlConfiguration.tag.toUpperCase());
        }
      }
    } else {
      formData.append('xxxxxx', this.caseObject['ID'] || this.caseObject['id']);
      formData.append('case-id', this.caseObject['ID'] || this.caseObject['id']);
      formData.append('case-type', this.caseObjectType);
      if (file && file.name) {
        formData.append('file-name', file, file.name);
      }
      formData.append('case-revision', 'AA');
      if (this.formDataGroup.get('note') && this.formDataGroup.get('note').get('ID')) {
        formData.append('note-id', this.formDataGroup.get('note').get('ID').value);
      }
    }
    this.updateDocumentDescription(formData);
  }

  addToAttachments(fileCount) {
    if (this.newAttachments.filter(document => document.ID === this.fileList[fileCount].ID).length === 0) {
      this.newAttachments.push(new Document(this.fileList[fileCount]));
    }
  }

  saveFiles(fileCount: number) {
    if (fileCount < this.fileList.length) {
      if (this.fileList[fileCount]['ID']) {
        if (this.editingForm && this.caseObjectType !== 'review') {
          this.updateFile(fileCount);
        } else {
          this.addToAttachments(fileCount);
          ++fileCount;
          this.saveFiles(fileCount);
        }
      } else if (this.fileList[fileCount] && !this.fileList[fileCount]['ID']) {
        this.uploadFile(fileCount);
      }
    } else if (fileCount === this.fileList.length) {
      this.newAttachments.forEach((att, index) => {
        if (this.fileList[index]) {
          this.fileList[index].ID = this.newAttachments[index].ID;
        }
      });
      if (!this.editingForm && !this.formDataGroup.get('note')) {
        this.saveForm.emit();
      }
    }
  }

  uploadFile(fileCount: number) {
    this.fileUploadInProgress = true;
    const formData: FormData = new FormData();
    this.createFileUploadRequest(fileCount, formData);
    if (this.caseObjectType === 'review') {
    // do a service call here
      this.zone.run(() => {
        this.fileService.uploadReviewFile(this.commentId, formData).subscribe(
          (fileObj: any) => {
            this.isFormDirty = false;
            this.fileUploadInProgress = false;
            this.handleUploadSuccess(fileObj);
            ++fileCount;
            this.saveFiles(fileCount);
          },
          () => {
            this.fileUploadInProgress = false;
            const nextFileCount = ++fileCount;
            this.saveFiles(nextFileCount);
          });
      });
    } else if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.zone.run(() => {
        if (this.commentId) {
          // Uploaded document is attached to a comment
          this.sidePanelService.uploadCommentDocument(formData, this.commentId, this.caseObjectType + 'Root').subscribe(
            (fileObj: any) => {
              this.isFormDirty = false;
              this.fileUploadInProgress = false;
              this.handleUploadSuccess(this.processDocumentResponse(fileObj));
              ++fileCount;
              this.saveFiles(fileCount);
            },
            () => {
              this.fileUploadInProgress = false;
              const nextFileCount = ++fileCount;
              this.saveFiles(nextFileCount);
            });
        } else {
          // Uploaded document is not attched to a comment
          this.sidePanelService.uploadDocument(formData, this.caseObject['id'], this.caseObjectType).subscribe(
            (fileObj: any) => {
              this.isFormDirty = false;
              this.fileUploadInProgress = false;
              this.handleUploadSuccess(this.processDocumentResponse(fileObj));
              ++fileCount;
              this.saveFiles(fileCount);
            },
            () => {
              this.fileUploadInProgress = false;
              const nextFileCount = ++fileCount;
              this.saveFiles(nextFileCount);
            });
        }
      });
    } else {
      // do a service call here
      this.zone.run(() => {
        this.fileService.uploadFile(formData).subscribe(
          (fileObj: any) => {
            this.isFormDirty = false;
            this.fileUploadInProgress = false;
            this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
            this.handleUploadSuccess(fileObj);
            ++fileCount;
            this.saveFiles(fileCount);
          },
          () => {
            this.fileUploadInProgress = false;
            const nextFileCount = ++fileCount;
            this.saveFiles(nextFileCount);
          });
      });
    }
  }

  updateFile(fileCount: number) {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      const requestObj = {
        'oldIns': {
          'description': this.oldDescription ? this.oldDescription : '',
          'tags': [
            this.formDataControlConfiguration.tag.toUpperCase()
          ]
        },
        'newIns': {
          'description': this.formDataGroup.get('description') ? this.formDataGroup.get('description').value : '',
          'tags': [
            this.formDataControlConfiguration.tag.toUpperCase()
          ]
        }
      };
      this.sidePanelService.updateDocument(requestObj, this.fileList[fileCount]['ID'], this.caseObjectType).subscribe((fileObj: any) => {
          this.handleUploadSuccess(this.processDocumentResponse(fileObj));
          this.isFormDirty = false;
          this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
          this.saveForm.emit();
        },
        () => {
          this.saveForm.emit();
        });
    } else {
      const requestObj = {
        'document': {
          'description': this.formDataGroup.get('description') ? this.formDataGroup.get('description').value : '',
          'tags': [
            this.formDataControlConfiguration.tag
          ]
        }
      };
      this.fileService.updateFile(requestObj, this.fileList[fileCount]['ID']).subscribe((fileObj: any) => {
          this.handleUploadSuccess(fileObj);
          this.isFormDirty = false;
          this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
          this.saveForm.emit();
        },
        () => {
          this.saveForm.emit();
        });
    }
  }

  handleUploadSuccess(fileObj) {
    if ((fileObj && fileObj.DocumentElement && fileObj.DocumentElement.ID) || (fileObj && fileObj.id)) {
      const attachObj = {
        'name': (fileObj.DocumentElement && fileObj.DocumentElement.name) || fileObj.name,
        'uploadedBy': new User(this.configurationService.getUserProfile()),
        'uploadedOn': (fileObj.DocumentElement && fileObj.DocumentElement.updatedOn) || fileObj.created_on || new Date(),
        'ID': (fileObj.DocumentElement && fileObj.DocumentElement.ID) || fileObj.id,
        'tags': [(this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage' || this.caseObjectType === 'review') ? this.formDataControlConfiguration.tag : this.formDataControlConfiguration.tag.toUpperCase()] || [...fileObj.tags],
        'description': (fileObj.DocumentElement && fileObj.DocumentElement.description)
      } as Document;
      this.newAttachments.push(new Document(attachObj));
    }
  }

  processDocumentResponse(res: any) {
    return {
      DocumentElement: {
        name: res['name'] ? res['name'] : '',
        uploadedBy: res['creator'] ? new User(res['creator']) : new User({}),
        uploadedOn: res['created_on'] ? res['created_on'] : '',
        ID: res['id'] ? res['id'] : '',
        description: res['description'] ? res['description'] : ''
      }
    };
  }

  onSaveForm() {
    this.zone.run(() => {
      if (this.formDataGroup.get('note')) {
        this.formDataGroup.get('note').value.documents = this.newAttachments.length > 0 ? this.newAttachments : this.fileList;
        this.saveForm.emit();
      } else if (this.formDataGroup.dirty && (this.fileList[0].ID || this.fileList[0].id)) {
        this.editingForm = true;
        this.updateFile(0);
      } else {
        this.saveFiles(0);
      }
      this.resetDropArea();
    });
  }

  updateDocumentDescription(formData) {
    if (this.formDataGroup.get('description')) {
      formData.append('description', this.formDataGroup.get('description') ? this.formDataGroup.get('description').value : '');
      formData.append('tags', (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage' || this.caseObjectType === 'review') ? this.formDataControlConfiguration.tag.toUpperCase() : this.formDataControlConfiguration.tag);
    }
  }

  onDragEnterDropZone(event) {
    this.stopAndPrevent(event);
    if (!this.addDocumentAllowed()) {
      return;
    }
    this.dropAreaText = 'Drop now';
    this.highlightDropZone = true;
    this.changeDetectorRef.detectChanges();
  }

  onDragLeave(event) {
    this.stopAndPrevent(event);
    this.appStore.dispatch(fileUploadDragAction({
      'action': 'leave',
      'dropAreaHighlighted': false
    } as FileDragData));
    this.resetDropArea();
    this.changeDetectorRef.detectChanges();
  }

  dragover(event) {
    this.stopAndPrevent(event);
  }

  stopAndPrevent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDeleteAttachmentPress(index: number) {
    let dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>;
    this.zone.run(() => {
      dialogRef = this.matDialog.open(MatDialogDeleteConfirmationComponent, {
        width: '50rem',
        data: {
          title: 'Are you sure you want to delete the document?',
          targetId: 1,
          notification: 'no-warning',
          dialogTitle: 'Delete Document'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onConfirmDeleteAttachment(index);
        }
      });
    });
  }

  onConfirmDeleteAttachment(index: number) {
    this.deletedFileIndex = index;
    if (this.fileList[index]['ID']) {
      this.fileUploadInProgress = true;
      if (this.caseObjectType === 'review' || this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
        if (this.commentId) {
          // Remove document attached to a comment
          this.sidePanelService.removeCommentDocument(this.fileList[index]['ID'], this.caseObjectType + 'Root').subscribe(() => {
            this.fileUploadInProgress = false;
            this.newAttachments.splice(this.newAttachments.findIndex(item => item.ID === this.fileList[index]['ID']), 1);
            this.fileList.splice(index, 1);
          });
        } else {
          // Remove individual document
          this.sidePanelService.removeDocument(this.fileList[index]['ID'], this.caseObjectType).subscribe(() => {
            this.fileUploadInProgress = false;
            this.newAttachments.splice(this.newAttachments.findIndex(item => item.ID === this.fileList[index]['ID']), 1);
            this.fileList.splice(index, 1);
          });
        }
      } else {
        this.fileService.removeFile(this.fileList[index]['ID']).subscribe(() => {
          this.fileUploadInProgress = false;
          this.newAttachments.splice(this.newAttachments.findIndex(item => item.ID === this.fileList[index]['ID']), 1);
          this.fileList.splice(index, 1);
        });
      }
      this.deleteDocument.emit();
    } else {
      this.fileList.splice(index, 1);
      this.isFormDirty = true;
    }
    if (this.disableAdd) {
      this.disableAdd.emit(!this.addDocumentAllowed());
    }
    this.changeDetectorRef.detectChanges();
  }

  onCancel() {
    if (this.formDataGroup.dirty || this.isFormDirty) {
      const dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>
        = this.matDialog.open(MatDialogNavigationConfirmationComponent, {
        width: '50rem',
        data: {
          isCaseObject: false
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.changeDetectorRef.detectChanges();
          this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
          this.deleteAttachments();
          this.cancelForm.emit(confirm);
        }
      });
    } else {
      this.changeDetectorRef.detectChanges();
      this.cancelForm.emit();
    }
  }

  deleteAttachments(): void {
    if (this.newAttachments.length) {
      for (let index = 0; index < this.newAttachments.length; index++) {
        this.onConfirmDeleteAttachment(index);
      }
    }
  }

  getDisableSave() {
    if (this.otherDocuments === 'documents') {
      return(
        this.fileList.length === 0 ||
        (this.editingForm && !this.formDataGroup.get('description').dirty) ||
        (this.fileList.length === 1 && this.formDataGroup.invalid) ||
        (this.fileUploadInProgress)
      );
    } else {
      return this.formDataGroup.invalid || this.fileUploadInProgress;
    }
  }

  ngOnDestroy() {
    this.fileDragSubscription$.unsubscribe();
  }
}
