import {Component, EventEmitter, HostListener, Inject, OnInit, Output} from '@angular/core';
import {Action, CaseActionElement, CaseObject, User} from '../../models/mc.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormControlConfiguration, ReviewEntryFormConfiguration} from '../../models/mc-configuration.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ReviewService} from '../../../core/services/review.service';
import {UpdateReviewEntryData} from '../../models/mc-presentation.model';
import {CaseAction} from '../../models/case-action.model';
import {loadCaseActions} from '../../../store/actions/case-object.actions';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-conversation-dialog',
  templateUrl: './mc-conversation-dialog.component.html',
  styleUrls: ['./mc-conversation-dialog.component.scss']
})
export class MCConversationDialogComponent implements OnInit {
  action: Action;
  reviewCommentForm: FormGroup;
  addNoteControlConfiguration: FormControlConfiguration;

  actionDetailsFormGroup: FormGroup;
  reviewEntryFormConfiguration: ReviewEntryFormConfiguration;
  saveReject: string;
  reviewEntryCaseObject: CaseObject;
  isMotivationUpdated: boolean;
  reviewEntry: any;
  rootCommentsData: any;
  showReplySection: boolean;
  currentCommentId: number;
  currentReplyId: number;
  replyText: string;
  mode: string;
  currentCommentObject: any;
  rootCommentsFormGroup: FormGroup;
  reviewEntryFormGroup: FormGroup;
  commentsInProgress: boolean;
  docUrl: string;
  showBanner: boolean;
  @Output()
  readonly getDialogDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly setNavigations: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly reviewEntrySubmit: EventEmitter<UpdateReviewEntryData> = new EventEmitter<UpdateReviewEntryData>();

  constructor(public dialogRef: MatDialogRef<MCConversationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly configurationService: ConfigurationService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly helpersService: HelpersService,
              private readonly reviewService: ReviewService,
              private readonly formBuilder: FormBuilder,
              private readonly customAlert: MatSnackBar,
              public readonly appStore: Store<MyChangeState>) {
    this.reviewEntryFormConfiguration = this.configurationService.getFormFieldParameters('ReviewEntry2.0') as ReviewEntryFormConfiguration;
    this.actionDetailsFormGroup = this.mcFormGroupService
      .createActionFormGroup(new Action({}), false);
    this.saveReject = (data.saveReject) ? data.saveReject : '';
    this.action = (data.action) ? data.action : '';
    this.replyText = 'View Replies';
    this.reviewEntry = this.data.reviewEntryDetails;
    this.commentsInProgress = false;
    // Case Object
    this.reviewEntryCaseObject = new CaseObject(this.reviewEntry.id, '', 'ReviewEntry');
    this.reviewEntryFormGroup = this.mcFormGroupService.createReviewEntryFormGroup(this.data.reviewEntryDetails);
    this.isMotivationUpdated = false;
    this.showReplySection = false;
    this.showBanner = false;
    this.docUrl = `https://projectname-acc.azure.com/api/review-service/documents`;
  }

  ngOnInit() {
    this.addNoteControlConfiguration = {
      placeholder: 'Comment',
      help: '',
      hint: '',
      label: '',
      tag: 'note'
    } as FormControlConfiguration;
    this.rootCommentsFormGroup = this.mcFormGroupService.createCommentsFormArray({});
    this.initializeEntryForm();
    this.getRootComments();
    this.setNavigations.emit();

    this.data.conversationUpdate.subscribe(() => {
      this.reviewEntry = this.data.reviewEntryDetails;
      this.getRootComments();
    });
  }

  initializeEntryForm() {
    this.reviewCommentForm = this.mcFormGroupService.createReviewCommentFormGroup(this.helpersService.getDefaultNoteSummaryObject(new User(this.configurationService.getUserProfile())));
    this.reviewCommentForm.get('note').get('note').setValidators(Validators.required);
  }

  updateForm() {
    this.rootCommentsFormGroup = this.mcFormGroupService.createCommentsFormArray(this.rootCommentsData);
  }

  getMatchedComment(id?: string) {
    return this.rootCommentsData['results'].filter((rootComment) => rootComment.id === (id || this.currentCommentId))[0];
  }

  getMatchedReplies(id?: string) {
    let matchedReply = null;
    if (this.rootCommentsData['results']) {
      this.rootCommentsData['results'].forEach(rootComment => {
        if (rootComment['replies'] && rootComment['replies'].filter((reply) => reply.id === id)[0]) {
          matchedReply = rootComment['replies'].filter((reply) => reply.id === id)[0];
        }
      });
    }
    return matchedReply;
  }

  onCancelDialog(): void {
    if (this.mode === 'adding' || this.mode === 'replying') {
      this.showBanner = true;
    } else {
      this.dialogRef.close({'reviewEntryData': this.reviewEntryFormGroup.value, 'commentsData': this.rootCommentsData});
    }
  }


  onSave(): void {
    this.dialogRef.close({'reviewEntryData': this.reviewEntryFormGroup.value, 'commentsData': this.rootCommentsData});
  }

  updateReviewEntry(reviewEntry, caseAction, event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.reviewEntrySubmit.emit({'reviewEntry': reviewEntry, 'caseAction': caseAction});
  }

  getDetails(direction) {
    this.getDialogDetails.emit(direction);
    this.setNavigations.emit();
  }

  getRootComments() {
    this.commentsInProgress = true;
    this.reviewService.getRootReviewComments(this.reviewEntry.id).subscribe((rootCommentsData: any) => {
      this.commentsInProgress = false;
      this.rootCommentsData = rootCommentsData;
      rootCommentsData['results'].map((rootComment) => rootComment.reply_label = 'View Replies');
      this.handleReviewCommentsCaseActions(this.rootCommentsData);
      this.rootCommentsFormGroup = this.mcFormGroupService.createCommentsFormArray(rootCommentsData);
    });

  }

  handleReviewCommentsCaseActions(commentsData) {
    if (commentsData['results']) {
      commentsData['results'].forEach((commentData) => {
        this.storeReviewCommentsCaseActions(commentData['case_permissions']['case_actions'], commentData['id']);
      });
    }
  }

  storeReviewCommentsCaseActions(caseActionsList: CaseActionElement[], commentId) {
    const caseActionsAllowed = [];
    for (let count = 0; count < caseActionsList.length; count++) {
      caseActionsAllowed.push(new CaseAction(String(commentId), '',
        'ReviewComment', caseActionsList[count]['is_allowed'], caseActionsList[count]['case_action'], caseActionsList[count]['mandatory_properties_regexps']));
    }
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  replyComment(replyFormGroup: FormGroup) {
    this.mode = 'replying';
    this.currentCommentObject = replyFormGroup.value;
    this.currentCommentId = replyFormGroup.get('id').value;
    this.reviewService.createEmptyReply$(replyFormGroup.get('id').value, '').subscribe((commentData: any) => {
      this.currentReplyId = commentData.id;
      this.initializeEntryForm();
      this.showReplySection = true;
    });
  }

  addComment(commentString) {
    this.initializeEntryForm();
    this.showReplySection = true;
    this.mode = 'adding';
    this.reviewService.createDraftComment$(this.reviewEntry.id, commentString).subscribe((commentData: any) => {
      this.currentCommentId = commentData['id'];
    });
  }

  editComment(editCommentFormGroup: FormGroup, mode?: string) {
    this.mode = (mode === 'reply') ? 'editingReply' : 'editing';
    this.showReplySection = true;
    this.currentCommentObject = editCommentFormGroup.value;
    this.currentCommentId = editCommentFormGroup.get('id').value;
    const noteComment = this.reviewCommentForm.getRawValue();
    noteComment['note']['ID'] = editCommentFormGroup.get('id').value;
    noteComment['note']['note'] = editCommentFormGroup.get('comment_text').value;
    noteComment['note']['documents'] = editCommentFormGroup.get('documents').value;
    this.reviewCommentForm = this.mcFormGroupService.createNoteSummaryFormGroup(noteComment);
  }

  toggleReplies(replyFormGroup: FormGroup) {
    this.currentCommentId = replyFormGroup.get('id').value;
    replyFormGroup.get('show_replies').setValue(!replyFormGroup.get('show_replies').value);
    replyFormGroup.get('reply_label').setValue(replyFormGroup.get('show_replies').value ? 'Close Replies' : 'View Replies');
    if (replyFormGroup.get('replies').value.length === 0) {
      this.getRepliesToComment(replyFormGroup.get('id').value);
    }
  }

  updateComment(id?: number) {
    let matchedCommentData = this.getMatchedComment();
    if (this.mode === 'editingReply' || this.mode === 'editing') {
      this.reviewService.updateComment$(
        id ||  this.currentCommentId,
        this.reviewCommentForm.value.note.note
      ).subscribe((data: any) => {
        if (this.mode === 'editingReply') {
          matchedCommentData = this.getMatchedReplies(data.id);
          matchedCommentData['comment_text'] = this.reviewCommentForm.get('note').value.note || '';
          matchedCommentData['documents'] = this.reviewCommentForm.get('note').value.documents;
          this.updateForm();
        } else {
          matchedCommentData = this.getMatchedComment(data.id);
          matchedCommentData['comment_text'] = this.reviewCommentForm.get('note').value.note || '';
          matchedCommentData['documents'] = this.reviewCommentForm.get('note').value.documents;
          this.updateForm();
        }
        this.initializeEntryForm();
        this.showReplySection = false;
        this.mode = '';
      });
    } else {
      this.reviewService.publishComment$(
        id || (this.mode === 'replying' ? this.currentReplyId : this.currentCommentId),
        this.reviewCommentForm.value.note.note
      ).subscribe((data: any) => {
        if (this.mode === 'adding') {
          this.storeReviewCommentsCaseActions(data['case_permissions']['case_actions'], data.id);
          data['is_delete_allowed'] = true;
          data['is_edit_allowed'] = true;
          data['documents'] = this.reviewCommentForm.get('note').value.documents;
          data['comment_text'] = this.reviewCommentForm.get('note').value.note || '';
          data['creator'] = this.reviewCommentForm.get('note').value.createdBy;
          data['created_on'] = this.reviewCommentForm.get('note').value.createdOn;
          this.rootCommentsData['results'].push(data);
          this.hideReplies();
          this.updateForm();
        } else if (this.mode === 'replying') {
          this.storeReviewCommentsCaseActions(data['case_permissions']['case_actions'], data.id);
          data['documents'] = this.reviewCommentForm.get('note').value.documents;
          data['comment_text'] = this.reviewCommentForm.get('note').value.note || '';
          data['creator'] = this.reviewCommentForm.get('note').value.createdBy;
          data['created_on'] = this.reviewCommentForm.get('note').value.createdOn;
          matchedCommentData['replies'] =  (matchedCommentData['replies'] ? matchedCommentData['replies'] : []);
          matchedCommentData['replies'].push(data);
          matchedCommentData['show_replies'] = true;
          matchedCommentData['reply_label'] = 'Close Replies';
          matchedCommentData['reply_count'] ? matchedCommentData['reply_count'] += 1 : matchedCommentData['reply_count'] = 1 ;
          this.updateForm();
          this.fetchRootCommentCaseAction();
          this.initializeEntryForm();
        }
        this.initializeEntryForm();
        this.showReplySection = false;
        this.mode = '';
      });
    }
  }

  fetchRootCommentCaseAction() {
    this.reviewService.getCommentCaseAction(this.currentCommentId).subscribe((rootCommentCaseActions) => {
      this.storeReviewCommentsCaseActions(rootCommentCaseActions, this.currentCommentId);
    });
  }

  getRepliesToComment(commentId) {
    this.reviewService.getCommentsByCommentId$(commentId).subscribe((repliesData: any) => {
      this.handleReviewCommentsCaseActions(repliesData);
      this.rootCommentsData['results'].forEach((comment) => {
        comment['show_replies'] = false;
        comment['reply_label'] = 'View Replies';
      });
      const matchedCommentData = this.rootCommentsData['results'].filter((rootComment) => rootComment.id === this.currentCommentId)[0];
      matchedCommentData['replies'] = repliesData['results'];
      matchedCommentData['reply_label'] = 'Close Replies';
      matchedCommentData['show_replies'] = true;
      this.updateForm();
    });
  }

  removeComment(event, mode?: string) {
    this.reviewService.removeComment$((event.value && event.value.id) || event).subscribe((commentData: any) => {
      if (mode === 'reply') {
        let removedReply = {};
        let commentId = 0;
        this.rootCommentsData['results'].forEach((rootComment) => {
          if (rootComment['replies'] && rootComment['reply_count'] > 0) {
            removedReply = rootComment['replies'].filter((reply) => reply.id === event.get('id').value)[0];
            commentId = rootComment.id;
          }
        });
        removedReply['status'] = 3;
        this.decrementReplyCount(commentId);
      } else {
        const removedComment = this.rootCommentsData['results'].filter((rootComment) => rootComment.id === event.get('id').value)[0];
        removedComment.status = 3;
      }
      this.fetchRootCommentCaseAction();
      this.updateForm();
      this.showReplySection = false;
      this.initializeEntryForm();
    });
  }

  onConfirmBanner() {
    this.deleteComment(this.mode === 'adding' ? this.currentCommentId : this.currentReplyId, true);
    this.dialogRef.close({'reviewEntryData': this.reviewEntryFormGroup.value, 'commentsData': this.rootCommentsData});
  }

  closeConfirmationBanner() {
    this.showBanner = false;
  }

  deleteComment(commentId, isDraftComment?: boolean) {
    this.reviewService.deleteComment$(commentId).subscribe((commentData: any) => {
      this.initializeEntryForm();
      this.showReplySection = false;
      if (!isDraftComment) {
        this.customAlert.open('Comment Deleted Successfully', '', {
          duration: 3000
        });
      }
    });
  }

  cancelForm() {
    if (this.mode === 'adding') {
      this.deleteComment(this.currentCommentId, true);
    } else {
      this.initializeEntryForm();
      this.showReplySection = false;
    }
    this.mode = '';
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    if (this.showReplySection) {
      this.cancelForm();
    }
  }

  documentClicked(event) {
    this.reviewService.getDocumentContent$(event.id).subscribe((documentData: any) => {
      const dataType = event.type;
      const binaryData = [];
      binaryData.push(documentData);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      if (event.name) {
        downloadLink.setAttribute('download', event.name);
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.parentNode.removeChild(downloadLink);
    });
  }

  decrementReplyCount(commentId) {
    this.rootCommentsData['results'].find((rootComment) => rootComment.id === commentId).reply_count--;
  }

  hideReplies() {
    this.rootCommentsData['results'].forEach((comment) => {
      comment['show_replies'] = false;
      comment['reply_label'] = 'View Replies';
    });
    this.updateForm();
  }
}
