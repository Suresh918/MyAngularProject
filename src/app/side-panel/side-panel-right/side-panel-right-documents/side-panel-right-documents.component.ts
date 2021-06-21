import {ChangeDetectorRef, Component, Input, OnInit, ViewRef} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subject, Subscription} from 'rxjs';

import {fileUploadDragAction} from '../../../store/actions/file-upload.actions';
import {FileDragData, MyChangeState} from '../../../shared/models/mc-store.model';
import {environment} from '../../../../environments/environment';
import {ActionService} from '../../../core/services/action.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {refreshLinkedItemsCount, selectFileDragState} from '../../../store';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {Agenda, AgendaItem, ChangeNotice, ChangeRequest, Document, ReleasePackage, User} from '../../../shared/models/mc.model';
import {DocumentDeleteDialogComponent} from './document-delete-dialog/document-delete-dialog-component';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {CaseObjectServicePath} from '../../../shared/components/case-object-list/case-object.enum';
import {SidePanelService} from '../../side-panel.service';

@Component({
  selector: 'mc-side-panel-right-documents',
  templateUrl: './side-panel-right-documents.component.html',
  styleUrls: ['./side-panel-right-documents.component.scss']
})
export class SidePanelRightDocumentsComponent implements OnInit {
  type: string;
  @Input()
  set caseObjectType(val: string) {
    if (val) {
      this.type = val;
      this.microServicePictureURL = `${environment.rootURL}` + CaseObjectServicePath[val] + `/documents`;
    }
  }
  get caseObjectType() {
    return this.type;
  }
  @Input()
  panelMode: string;
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem;
  addButtonAction: string;
  updateButtonAction: string;
  deleteButtonAction: string;
  linkedItem: any;
  attachmentList: any;
  showLoader: boolean;
  pictureUrl: string;
  microServicePictureURL: string;
  showAddDocumentForm: boolean;
  documentForm: FormGroup;
  highlightDropZone: boolean;
  fileDragSubscription$: Subscription;
  addDocumentControlConfiguration: FormControlConfiguration;
  editingForm: boolean;
  disableAddDocument: boolean;
  documentDeleteSuccess: Subject<void> = new Subject();
  isAuthorizedToChangeDocuments: boolean;
  attachmentsCount: number;

  constructor(private readonly actionService: ActionService,
              private readonly helperService: HelpersService,
              private readonly appStore: Store<MyChangeState>,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly documentDialog: MatDialog,
              private readonly configurationService: ConfigurationService,
              private readonly sidePanelService: SidePanelService) {
    this.pictureUrl = `${environment.rootURL}mc${environment.version}/documents`;
    this.disableAddDocument = false;
  }

  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && (caseObject.id || caseObject.ID)) {
      this.caseObject = caseObject;
      this.fetchAttachments();
      this.setActionValue();
    }
  }

  ngOnInit() {
    this.attachmentList = [];
    this.registerFileDragSubscriber();
    this.constructDocumentForm();
    this.addDocumentControlConfiguration = {
      placeholder: 'Description',
      help: '',
      hint: '',
      label: '',
      tag: 'other',
      validatorConfiguration: {'maxLength': 256}
    } as FormControlConfiguration;
  }

  fetchAttachments() {
    this.linkedItem = {
      'ID': this.caseObject['ID'] || this.caseObject['id'] || '',
      'revision': this.caseObject['revision'] || '',
      'type': this.helperService.getCaseObjectForms(this.caseObjectType).path || ''
    };
    this.getAttachments(this.linkedItem);
    this.isAuthorizedToChangeDocuments =
      this.helperService.isAuthorizedToChangeDocuments(this.caseObjectType,
        (this.caseObject['generalInformation'] && this.caseObject['generalInformation']['status'])
        || this.caseObject['status'],
        this.getChangeSpecialistRole());
  }

  setActionValue() {
    const caseObjectType = this.caseObjectType.toUpperCase();
    this.addButtonAction = (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') ? 'CREATE_DOCUMENT' : 'CREATE-' + caseObjectType + '-DOCUMENT';
    this.updateButtonAction = (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') ? 'CREATE_DOCUMENT' : 'UPDATE-' + caseObjectType + '-DOCUMENT';
    this.deleteButtonAction = (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') ? 'CREATE_DOCUMENT' : 'DELETE-' + caseObjectType + '-DOCUMENT';
  }

  getChangeSpecialistRole(): string[] {
    const roles = [];
    if (this.configurationService.getUserProfile().roles) {
      const userRoles = this.configurationService.getUserProfile().roles;
      userRoles.forEach((userRole) => {
        if (userRole.includes('changeSpecialist')) {
          roles.push(userRole);
        }
      });
      return roles;
    }
  }

  registerFileDragSubscriber() {
    this.fileDragSubscription$ = this.appStore.pipe(select(selectFileDragState)).subscribe((res: FileDragData) => {
      if (res && res.dropAreaHighlighted && !res.dropAreaHighlighted.valueOf()) {
        this.highlightDropZone = res.action === 'enter' && this.showAddDocumentForm;
        if (res.action === 'enter' && this.showAddDocumentForm) {
          this.appStore.dispatch(fileUploadDragAction({
            'action': 'enter',
            'dropAreaHighlighted': true
          } as FileDragData));
        }
      }
      if (this.changeDetectorRef && !(this.changeDetectorRef as ViewRef).destroyed) {
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getAttachments(linkedItem: any): void {
    this.showLoader = true;
    if ((this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
      this.sidePanelService.getDocuments(this.caseObject['id'], this.caseObjectType).subscribe(res => {
        if (res) {
          this.showLoader = false;
          this.attachmentList = this.processDocumentResponse(res['results']);
          this.attachmentsCount = this.getAttachmentCount();
        }
      });
    } else {
      this.actionService.getAttachmentDetails(linkedItem, 'Other')
        .subscribe(attachmentList => {
          this.showLoader = false;
          this.attachmentList = attachmentList;
          this.attachmentsCount = this.getAttachmentCount();
        });
    }
  }

  processDocumentResponse(response) {
    const ProcessedResponse = [];
    if (response && response.length > 0) {
      response.forEach(doc => {
        const attachments = [];
        const document = {
          ID: doc['id'] ? doc['id'] : '',
          name: doc['name'] ? doc['name'] : '',
          tags: doc['tags'] ? doc['tags'] : [],
          description: doc['description'] ? doc['description'] : '',
          uploadedBy: doc['creator'] ? new User(doc['creator']) : new User({}),
          uploadedOn: doc['created_on'] ? doc['created_on'] : ''
        };
        attachments.push({
          'document': document,
          'contentType': (doc['type'] ? doc['type'] : ''),
          'contentSize': (doc['size'] ? doc['size'] : 0)
        });
        this.attachmentsCount = attachments.length;
        ProcessedResponse.push({'category': 'Other Documents', 'attachments': attachments});
      });
    }
    return ProcessedResponse;
  }

  onPressAddDocument() {
    if (!this.showAddDocumentForm) {
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
      this.showAddDocumentForm = true;
    }
  }

  onSaveDocument() {
    this.resetForm();
    this.getAttachments(this.linkedItem);
    this.appStore.dispatch(refreshLinkedItemsCount(true));
  }

  constructDocumentForm(): void {
    this.documentForm = this.mcFormGroupService.createDocumentFormGroup('');
  }

  resetNoteFormGroup(): void {
    this.editingForm = false;
    this.disableAddDocument = false;
    this.constructDocumentForm();
  }

  onDeleteDocument() {
    this.getAttachments(this.linkedItem);
    this.appStore.dispatch(refreshLinkedItemsCount(true));
    this.documentDeleteSuccess.next();
  }

  deleteCardEvent(event): void {
    let dialogRef: MatDialogRef<DocumentDeleteDialogComponent>;
    dialogRef = this.documentDialog.open(DocumentDeleteDialogComponent, {
      width: '50rem',
      data: {
        title: 'Are you sure you want to delete this document ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if ((this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
          this.sidePanelService.removeDocument(event, this.caseObjectType).subscribe(() => {
            this.getAttachments(this.linkedItem);
            this.appStore.dispatch(refreshLinkedItemsCount(true));
            this.documentDeleteSuccess.next();
          });
        } else {
          this.actionService.deleteAttachment(this.linkedItem, event).subscribe(() => {
            this.getAttachments(this.linkedItem);
            this.appStore.dispatch(refreshLinkedItemsCount(true));
            this.documentDeleteSuccess.next();
          });
        }
      }
    });
  }

  resetForm() {
    this.resetNoteFormGroup();
    this.showAddDocumentForm = false;
  }

  editDocument(docObject: Document): void {
    this.documentForm = this.mcFormGroupService.createDocumentFormGroup(new Document(docObject));
    this.showAddDocumentForm = true;
    this.disableAddDocument = true;
    this.editingForm = true;
  }

  onDisableAdd(isDisable?: boolean) {
    this.disableAddDocument = isDisable;
  }

  onDragFileEnter() {
    if (this.disableAddDocument) {
      this.highlightDropZone = false;
      return;
    }
    this.highlightDropZone = true;
    this.appStore.dispatch(fileUploadDragAction({'action': 'enter', 'dropAreaHighlighted': true} as FileDragData));
  }

  onDragFileLeave(event) {
    if (!event.clientX && !event.clientY) {
      this.highlightDropZone = false;
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
    }
  }

  getAttachmentCount() {
    let attachmentCount = 0;
    this.attachmentList.forEach((attachmentCategory) => {
      if (attachmentCategory.attachments) {
        attachmentCount += attachmentCategory.attachments.length;
      }
    });
    return attachmentCount;
  }

  documentClicked(event) {
    if (event && event.ID) {
      this.sidePanelService.getDocumentContent$(event.ID , this.caseObjectType).subscribe((documentData: any) => {
        if (documentData) {
          this.helperService.downloadAttachmentOnClick(event, documentData);
        }
      });
    }
  }
}
