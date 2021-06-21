import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {
  Agenda,
  AgendaItem,
  CategorizedNoteSummary,
  CategorizedNoteSummaryElement,
  ChangeNotice,
  ChangeRequest,
  Document,
  NoteElement,
  NoteSummaryElement,
  ReleasePackage,
  User
} from '../../../shared/models/mc.model';
import {SharedService} from '../../../core/services/shared.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {Link} from '../../../shared/models/mc-presentation.model';
import {FileDragData, MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {refreshLinkedItemsCount, selectFileDragState} from '../../../store';
import {fileUploadDragAction} from '../../../store/actions/file-upload.actions';
import {NotesService} from '../../../core/services/notes.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {setRightPanelFormDirty} from '../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {MatDialogDeleteConfirmationComponent} from '../../../shared/components/mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {SidePanelService} from '../../side-panel.service';

@Component({
  selector: 'mc-side-panel-right-notes',
  templateUrl: './side-panel-right-notes.component.html',
  styleUrls: ['./side-panel-right-notes.component.scss']
})
export class SidePanelRightNotesComponent implements OnInit, OnDestroy {
  @Input()
  caseObjectType: string;
  @Input()
  panelMode: string;
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem;
  categorizedNoteSummaries: CategorizedNoteSummaryElement[];
  totalNoteSummaries: CategorizedNoteSummaryElement[];
  clonedNotes: CategorizedNoteSummaryElement[];
  showAddNoteForm: boolean;
  highlightDropArea: boolean;
  newNoteAttachments: Document[];
  progressBar: boolean;
  fileDragSubscription$: Subscription;
  addNoteControlConfiguration: FormControlConfiguration;
  noteForm: FormGroup;
  toggleNotesViewControl: FormControl;
  toggleButtonLabel: string;
  caseObjectState: any;
  allNotesCount: number;
  caseObjectNotesCount: number;
  caseObjectAbbreviation: string;
  currentUser: User;
  currentNoteLink: Link;
  commentsCount: number;

  constructor(private readonly sharedService: SharedService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly appStore: Store<MyChangeState>,
              private readonly notesService: NotesService,
              private readonly helpersService: HelpersService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly userProfileService: UserProfileService,
              private readonly configurationService: ConfigurationService,
              private readonly sidePanelService: SidePanelService,
              private readonly dialog: MatDialog) {
    this.currentUser = new User(this.configurationService.getUserProfile());
    this.showAddNoteForm = false;
    this.toggleNotesViewControl = new FormControl('');
    this.resetValues();
  }

  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && (caseObject.ID || caseObject.id)) {
      this.caseObject = caseObject;
      this.resetValues();
      this.fetchNotes();
      this.setToggleOptions();
    }
  }

  ngOnInit() {
    this.registerFileDragSubscriber();
    this.constructNotesForm();
    this.addNoteControlConfiguration = {
      placeholder: 'Comment',
      help: '',
      hint: '',
      label: '',
      tag: 'note'
    } as FormControlConfiguration;
  }

  resetValues() {
    this.categorizedNoteSummaries = [];
    this.totalNoteSummaries = [];
    this.clonedNotes = [];
    this.progressBar = false;
    this.newNoteAttachments = [];
    this.resetNoteFormGroup();
  }

  setToggleOptions(): void {
    this.caseObjectAbbreviation = this.helpersService.getCaseObjectForms(this.caseObjectType).abbr;
    if (this.caseObjectAbbreviation.toUpperCase() === 'AI') {
      this.toggleButtonLabel = (this.caseObject['category'] || 'AI') + ' Comments';
    } else {
      this.toggleButtonLabel = this.caseObjectAbbreviation + ' Comments';
    }
    this.caseObjectState = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
    this.toggleNotesViewControl = new FormControl(this.caseObjectState['commonCaseObjectState']['sidePanelNotesToggleOption'] || 'CASEOBJECT');
  }

  toggleNotesGroup(event): void {
    this.caseObjectState['commonCaseObjectState']['sidePanelNotesToggleOption'] = event.value;
    this.userProfileService.updateCaseObjectState(this.caseObjectState, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
    this.setNotesData();
  }

  setNotesData(): void {
    if (this.toggleNotesViewControl.value === 'ALL' || this.caseObjectAbbreviation === 'RP') {
      this.categorizedNoteSummaries = this.totalNoteSummaries;
    } else {
      if (this.totalNoteSummaries && this.totalNoteSummaries.length > 0) {
        if (this.caseObjectAbbreviation === 'AI') {
          this.categorizedNoteSummaries = this.totalNoteSummaries.filter(noteSummary => (noteSummary && (noteSummary.category === 'CB' || noteSummary.category === 'CCB')));
        } else {
          this.categorizedNoteSummaries = this.totalNoteSummaries.filter(noteSummary => {
            return (noteSummary && (noteSummary.category === 'CR' || noteSummary.category === 'CN' || noteSummary.category === 'RP' || noteSummary.category === 'AC'));
          });
        }
      }
    }
  }

  constructNotesForm(data?: any): void {
    this.noteForm = this.mcFormGroupService.createNoteSummaryFormGroup(data || this.helpersService.getDefaultNoteSummaryObject(new User(this.currentUser)));
    this.noteForm.get('note').get('note').setValidators(Validators.required);
  }

  resetNoteFormGroup(): void {
    this.constructNotesForm();
    this.newNoteAttachments = [];
  }

  fetchNotes() {
    this.progressBar = true;
    const caseObjectPath = this.helpersService.getCaseObjectForms(this.caseObjectType).path;
    this.caseObjectAbbreviation = this.helpersService.getCaseObjectForms(this.caseObjectType).abbr;
    this.resetNoteFormGroup();
    if (this.caseObjectType === 'ChangeRequest') {
      const serviceList = [this.sidePanelService.getCBCommentsByCRID(this.caseObject['id']), this.sidePanelService.getComments(this.caseObject['id'], this.caseObjectType)];
      forkJoin(serviceList).subscribe(resList => {
        if (resList.length > 1) {
          this.progressBar = false;
          this.commentsCount = 0;
          this.mergeResponses(resList[0], this.convertToNoteSummary(resList[1]));
          this.commentsCount = 0;
          this.setNotesData();
        }
      });
    } else if (this.caseObjectType === 'AgendaItem') {
      const serviceList = [this.notesService.getNotes(caseObjectPath, this.caseObject['ID']), this.sidePanelService.getCRCommentsByAgendaItemID(this.caseObject['ID'])];
      forkJoin(serviceList).subscribe(resList => {
        if (resList.length > 1) {
          this.progressBar = false;
          this.commentsCount = 0;
          this.mergeResponses(resList[0], this.convertToNoteSummary(resList[1]));
          this.commentsCount = 0;
          this.setNotesData();
        }
      });
    } else if (this.caseObjectType === 'ReleasePackage') {
      this.sidePanelService.getComments(this.caseObject['id'], this.caseObjectType).subscribe(res => {
        if (res) {
          this.progressBar = false;
          this.commentsCount = 0;
          this.totalNoteSummaries = [];
          this.totalNoteSummaries.push(this.convertToNoteSummary(res));
          this.allNotesCount = this.commentsCount;
          this.caseObjectNotesCount = this. commentsCount;
          this.commentsCount = 0;
          this.setNotesData();
        }
      });
    } else {
      this.notesService.getNotes(caseObjectPath, this.caseObject['ID']).subscribe((res: CategorizedNoteSummary) => {
        if (res) {
          this.progressBar = false;
          this.totalNoteSummaries = res && res.CategorizedNoteSummariesElement ? res.CategorizedNoteSummariesElement : [] as CategorizedNoteSummaryElement[];
          this.allNotesCount = res.allNotesCount || 0;
          this.caseObjectNotesCount = res[this.getCaseObjectNotesCountParam()] || 0;
          this.setNotesData();
        }
      });
    }
  }

  convertToNoteSummary(response: any) {
    const NoteSummary = {};
    NoteSummary['category'] = (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'AgendaItem') ? 'CR' : this.caseObjectType === 'ReleasePackage' ? 'RP' : '';
    if (response && response.results && response.results.length > 0) {
      const noteSummaries = [];
      response['results'].forEach(res => {
        const attachments = [];
        const note: NoteElement = {};
        note['ID'] = res['id'] ? res['id'] : '';
        note['status'] = res['status_label'] ? res['status_label'] : '';
        note['note'] = res['comment_text'] ? res['comment_text'] : '';
        note['createdBy'] = res['creator'] ? new User(res['creator']) : new User({});
        note['createdOn'] = res['created_on'] ? res['created_on'] : '';
        note['lastModifiedOn'] = res['last_modified_on'] ? res['last_modified_on'] : '';
        note['documents'] = [];
        if (note['status'] && note['status'].toUpperCase() !== 'REMOVED') {
          this.commentsCount++;
        }
        if (res.documents && res.documents.length > 0) {
          res['documents'].forEach(doc => {
            const tags = [];
            const document = {
              ID: doc['id'] ? doc['id'] : '',
              name: doc['name'] ? doc['name'] : '',
              tags: doc['tags'] ? tags.push(doc['tags']) : [],
              uploadedBy: doc['creator'] ? doc['creator'] : new User({}),
              uploadedOn: doc['created_on'] ? doc['created_on'] : '',
              description: doc['description'] ? doc['description'] : '',
              contentType: doc['type'] ? doc['type'] : '',
              contentSize: doc['size'] ? doc['size'] : 0,
            } as Document;
            note['documents'].push(document);
            attachments.push({'document': document, 'contentType': (doc['type'] ? doc['type'] : ''), 'contentSize': (doc['size'] ? doc['size'] : 0)});
          });
        }
        noteSummaries.push({'note': note, 'attachments': attachments});
      });
      NoteSummary['noteSummaries'] = noteSummaries;
    }
    return NoteSummary as CategorizedNoteSummaryElement;
  }

  mergeResponses(aiResponse, crResponse) {
    this.totalNoteSummaries = (aiResponse.CategorizedNoteSummariesElement ? aiResponse.CategorizedNoteSummariesElement : []).concat(crResponse);
    this.allNotesCount = (aiResponse.allNotesCount || 0) + this.commentsCount;
    this.caseObjectNotesCount = this.caseObjectType === 'ChangeRequest' ? this.commentsCount : aiResponse[this.getCaseObjectNotesCountParam()] || 0;
  }

  getCaseObjectNotesCountParam() {
    switch (this.caseObjectType.toLowerCase()) {
      case 'changerequest':
        return 'crNotesCount';
      case 'changenotice':
        return 'cnNotesCount';
      case 'releasepackage':
        return 'rpNotesCount';
      case 'agendaitem':
        return 'aiNotescount';
      case 'action':
        return 'acNotesCount';
    }
  }

  registerFileDragSubscriber() {
    this.fileDragSubscription$ = this.appStore.pipe(select(selectFileDragState)).subscribe((res: FileDragData) => {
      if (res && res.dropAreaHighlighted && !res.dropAreaHighlighted.valueOf()) {
        this.highlightDropArea = res.action === 'enter' && this.showAddNoteForm;
        if (res.action === 'enter' && this.showAddNoteForm) {
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

  handleEnterKeyPress(event): boolean {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'textarea') {
      return false;
    }
    return true;
  }

  onPressAddNote() {
    if (!this.showAddNoteForm) {
      this.resetNoteFormGroup();
      this.highlightDropArea = false;
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
      this.addNewNote();
    }
  }

  addNewNote(): void {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.progressBar = true;
      this.sidePanelService.createComment('', this.caseObject['id'], this.caseObjectType).subscribe((res) => {
        if (res) {
          this.currentNoteLink = {
            ID: this.caseObject['id'],
            revision: this.caseObject['revision'] || '',
            type: this.caseObjectType
          };
          this.progressBar = false;
          this.constructNotesForm({'note': this.convertToNoteElement(res)});
          this.showAddNoteForm = true;
        }
      });
    } else {
      const caseObjectPath = this.helpersService.getCaseObjectForms(this.caseObjectType).path;
      this.progressBar = true;
      this.notesService.createNote(caseObjectPath, this.caseObject['ID'] || this.caseObject['id']).subscribe((res: NoteElement) => {
        if (res) {
          this.currentNoteLink = {
            ID: this.caseObject['ID'] || this.caseObject['id'],
            revision: this.caseObject['revision'] || '',
            type: this.caseObjectType
          };
          this.progressBar = false;
          this.constructNotesForm({'note': res});
          this.showAddNoteForm = true;
        }
      });
    }
  }

  convertToNoteElement(res: any) {
    return {
      ID: res['id'] ? res['id'] : '',
      createdBy: res['creator'] ? new User(res['creator']) : new User({}),
      createdOn: res['created_on'] ? res['created_on'] : '',
      status: res['status'] ? this.helpersService.getCommentStatusLabelFromStatusID(res['status']) : ''
    } as NoteElement;
  }

  onSaveNote(noteElement?: NoteElement, caseAction?: string): void {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.progressBar = true;
      if (caseAction && caseAction === 'remove') {
        // SoftDelete comment when caseAction is remove
        if (noteElement.documents && noteElement.documents.length > 0) {
          // If the comment has an attached document, remove it first before removing the comment
          this.sidePanelService.removeCommentDocument(noteElement.documents[0].ID, this.caseObjectType + 'Root').subscribe(res => {
            if (res.status === 200) {
              this.sidePanelService.removeComment('', noteElement.ID, this.caseObjectType).subscribe(response => {
                if (response) {
                  this.updateNotesList(caseAction);
                }
              });
            }
          });
        } else {
          this.sidePanelService.removeComment('', noteElement.ID, this.caseObjectType).subscribe(res => {
            if (res) {
              this.updateNotesList(caseAction);
            }
          });
        }
      } else {
        if (!noteElement) {
          noteElement = this.noteForm.value.note;
        }
        if (noteElement.status.toLowerCase().indexOf('draft') > -1) {
          //  Publish comment, when new comment is just added
          this.sidePanelService.publishComment(noteElement.note, noteElement.ID, this.caseObjectType).subscribe(res => {
            if (res) {
              if (this.noteForm.value.note.documents.length > 0 && this.noteForm.value.note.note !== this.noteForm.value.note.documents[0].description) {
                // Update comment document description when the comment text is updated
                this.sidePanelService.updateCommentDocument(this.noteForm.value.note, this.noteForm.value.note.documents[0].ID, this.caseObjectType + 'Root').subscribe(response => {});
              }
              this.updateNotesList(caseAction);
            }
          });
        } else {
          // Update comment for published comments
          this.sidePanelService.updateComment(noteElement.note, noteElement.ID, this.caseObjectType).subscribe(res => {
            if (res) {
              if (this.noteForm.value.note.documents.length > 0) {
                // Update comment document description when the comment text is updated
                this.sidePanelService.updateCommentDocument(this.noteForm.value.note, this.noteForm.value.note.documents[0].ID, this.caseObjectType + 'Root').subscribe(response => {});
              }
              this.updateNotesList(caseAction);
            }
          });
        }
      }
    } else {
      const caseObjectPath = this.helpersService.getCaseObjectForms(this.currentNoteLink.type).path;
      const caseObjectID = this.currentNoteLink.ID;
      this.progressBar = true;
      if (!noteElement) {
        noteElement = this.noteForm.value.note;
      }
      this.notesService.saveNote(caseObjectPath, caseObjectID, noteElement, caseAction || 'save').subscribe((res: NoteElement) => {
        if (res) {
          if (this.caseObject['notes']) {
            this.caseObject['notes'].unshift(new NoteElement(res));
          }
          this.progressBar = false;
          this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
          this.fetchNotes();
          this.appStore.dispatch(refreshLinkedItemsCount(true));
          this.showAddNoteForm = this.showAddNoteForm && caseAction === 'remove';
        }
      });
    }
  }

  updateNotesList(caseAction: string) {
    this.progressBar = false;
    this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
    this.fetchNotes();
    this.appStore.dispatch(refreshLinkedItemsCount(true));
    this.showAddNoteForm = this.showAddNoteForm && caseAction === 'remove';
  }

  closeSidePanel() {
    this.appStore.dispatch(fileUploadDragAction({'action': 'leave', 'dropAreaHighlighted': false} as FileDragData));
  }

  getNoDataMessageForCaseObject() {
    switch (this.caseObjectType) {
      case 'ChangeRequest' :
        return 'All comments for this CR will appear here. This includes CB Comments and CCB Comments. \n Comments to actions will not appear here.';
      case 'ChangeNotice' :
        return 'All comments for this CN will appear here. This includes CCB Comments. \n Comments to actions will not appear here.';
      case 'ReleasePackage':
        return 'All comments for this RP will appear here. \n Comments to actions will not appear here.';
      case 'Action':
        return 'Comments To Actions Will Appear Here.';
      default:
        return 'All comments appear here. \n Comments to actions will not appear here.';
    }
  }

  onDragFileEnter(event) {
    this.highlightDropArea = true;
    this.appStore.dispatch(fileUploadDragAction({'action': 'enter', 'dropAreaHighlighted': true} as FileDragData));
  }

  onDragFileLeave(event) {
    if (!event.clientX && !event.clientY) {
      this.highlightDropArea = false;
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
    }
  }

  onEditNote(noteSummary) {
    this.showAddNoteForm = true;
    this.currentNoteLink = noteSummary.link;
    this.constructNotesForm(new NoteSummaryElement(noteSummary));
  }

  onCancelAddNoteForm(confirm?: any): void {
    const noteElement: NoteElement = this.noteForm.get('note').value;
    if ((confirm && noteElement.status.toUpperCase() === 'DRAFT') || noteElement.status.toUpperCase() === 'DRAFT') {
      this.deleteNote(this.noteForm.value.note);
    }
    this.showAddNoteForm = false;
  }

  getDeletedUser(noteSummary?: NoteElement): string {
    if (noteSummary.createdBy && noteSummary.createdBy.userID && this.currentUser) {
      if (noteSummary.createdBy.fullName) {
        return (noteSummary.createdBy.userID === this.currentUser.userID) ? 'You' : `${noteSummary.createdBy.fullName} - ${noteSummary.createdBy.abbreviation}`;
      }
      return (noteSummary.createdBy.userID === this.currentUser.userID) ? 'You' : noteSummary.createdBy.userID;
    }
    return 'others';
  }

  onDeleteNote(noteSummary) {
    this.currentNoteLink = noteSummary.link;
    const noteElement = noteSummary.note;
    let dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>;
    dialogRef = this.dialog.open(MatDialogDeleteConfirmationComponent, {
      width: '50rem',
      data: {
        title: 'Are you sure you want to delete ?',
        targetId: 1,
        notification: 'no-warning',
        dialogTitle: 'Delete Note'
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        if (noteElement.status.toLowerCase().indexOf('draft') > -1) {
          this.deleteNote(noteElement);
        } else {
          this.onSaveNote(noteElement, 'remove');
        }
      }
    });
  }

  deleteNote(noteSummary: NoteElement): void {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.progressBar = true;
      this.sidePanelService.deleteComment(noteSummary.ID, this.caseObjectType).subscribe(() => {
        this.fetchNotes();
        this.appStore.dispatch(refreshLinkedItemsCount(true));
        this.progressBar = false;
      });
    } else {
      const caseObjectPath = this.helpersService.getCaseObjectForms(this.currentNoteLink.type).path;
      const caseObjectID = this.currentNoteLink.ID;
      this.progressBar = true;
      this.notesService.deleteNote(caseObjectPath, caseObjectID, noteSummary.ID).subscribe(() => {
        this.fetchNotes();
        this.appStore.dispatch(refreshLinkedItemsCount(true));
        this.progressBar = false;
      });
    }
  }

  documentClicked(event) {
    if (event && event.ID) {
      this.sidePanelService.getCommentDocumentContent$(event.ID, this.caseObjectType + 'Root').subscribe((documentData: any) => {
        if (documentData) {
          this.helpersService.downloadAttachmentOnClick(event, documentData);
        }
      });
    }
  }

  ngOnDestroy() {
    this.fileDragSubscription$.unsubscribe();
  }
}
