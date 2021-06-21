import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CaseObject} from "../../../models/mc.model";

@Component({
  selector: 'mc-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements OnInit {
  @Input()
  type: string;
  @Input()
  messageFormGroup: FormGroup;
  @Input()
  showReplies: any;
  @Input()
  docURL: string;
  @Input()
  isReplyAllowed: boolean;
  @Input()
  reviewEntryCaseObject: CaseObject;
  @Input()
  mode: string;
  @Output()
  readonly replyComment: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly removeComment: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly updateComment: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly viewReplies: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly documentClick: EventEmitter<any> = new EventEmitter<any>();
  caseObject: CaseObject;
  constructor() { }

  ngOnInit(): void {
    this.caseObject = new CaseObject(this.messageFormGroup.get('id').value, '', 'ReviewComment');
  }

  reply() {
    this.replyComment.emit(this.messageFormGroup);
  }

  deleteComment() {
    this.removeComment.emit(this.messageFormGroup);
  }

  editComment() {
    this.updateComment.emit(this.messageFormGroup);
  }
  getReplies() {
    this.viewReplies.emit(this.messageFormGroup);
  }
  documentClicked(document) {
    this.documentClick.emit(document);
  }
}
