import {Component, Input, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {ActionService} from '../../../core/services/action.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {environment} from '../../../../environments/environment';
import {selectRefreshLinkedItemsCount} from '../../../store';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {Agenda, AgendaItem, ChangeNotice, ChangeRequest, ReleasePackage, User} from '../../../shared/models/mc.model';
import {CaseObjectServicePath} from '../../../shared/components/case-object-list/case-object.enum';
import {SidePanelService} from '../../side-panel.service';

@Component({
  selector: 'mc-side-panel-right-attachments',
  templateUrl: './side-panel-right-attachments.component.html',
  styleUrls: ['./side-panel-right-attachments.component.scss']
})
export class SidePanelRightAttachmentsComponent implements OnInit {
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
  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && (caseObject.ID || caseObject.id)) {
      this.caseObject = caseObject;
      this.getAttachments();
    }
  }

  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem;
  attachmentCount: number;
  linkedItem: any;
  attachmentList: any;
  showLoader: boolean;
  pictureUrl: string;
  microServicePictureURL: string;
  microServiceAttachmentsCount: number;
  _$refreshLinkedItemsCountSubscriber: Subscription;

  constructor(private readonly actionService: ActionService,
              private readonly appStore: Store<MyChangeState>,
              private readonly helperService: HelpersService,
              private readonly sidePanelService: SidePanelService) {
    this.pictureUrl = `${environment.rootURL}mc${environment.version}/documents`;
    this.attachmentCount = 0;
  }

  ngOnInit() {
    this.attachmentList = [];
    this.subscribeToUpdateStore();
  }

  subscribeToUpdateStore() {
    this._$refreshLinkedItemsCountSubscriber = this.appStore.pipe(select(selectRefreshLinkedItemsCount)).subscribe((res: Boolean) => {
      if (res && res.valueOf()) {
        this.getAttachments();
      }
    });
  }

  getAttachments(): void {
    this.showLoader = true;
    this.linkedItem = {
      'ID': this.caseObject['ID'] || this.caseObject['id'],
      'revision': this.caseObject['revision'] || 'AA',
      'type': this.helperService.getCaseObjectForms(this.caseObjectType).path || ''
    };
    if ((this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
      this.sidePanelService.getAllAttachments(this.caseObject['id'], this.caseObjectType).subscribe(res => {
        if (res) {
          this.showLoader = false;
          this.attachmentList = this.processAttachmentResponse(res);
          this.attachmentCount = this.getAttachmentCount(this.attachmentList);
        }
      });
    } else if (this.caseObjectType === 'AgendaItem') {
      this.microServiceAttachmentsCount = 0;
      const serviceList = [this.actionService.getAttachmentDetails(this.linkedItem), this.sidePanelService.getCRAttachmentsByAgendaItemID(this.caseObject['ID'])];
      forkJoin(serviceList).subscribe(resList => {
        if (resList.length > 1) {
          this.showLoader = false;
          this.mergeResponses(resList[0], this.processAttachmentResponse(resList[1]));
        }
      });
    } else {
      this.actionService.getAttachmentDetails(this.linkedItem)
        .subscribe(attachmentList => {
          this.showLoader = false;
          this.attachmentList = attachmentList;
          this.attachmentCount = this.getAttachmentCount(attachmentList);
        });
    }
  }

  processAttachmentResponse(response) {
    const ProcessedResponse = [];
    if (response && response.length > 0) {
      response.forEach(res => {
        const attachments = [];
        if (res.documents && res.documents.length > 0) {
          res['documents'].forEach(doc => {
            const tags = [];
            const document = {
              ID: doc['id'] ? doc['id'] : '',
              name: doc['name'] ? doc['name'] : '',
              tags: doc['tags'] ? tags.push(doc['tags']) : [],
              description: doc['description'] ? doc['description'] : '',
              uploadedBy: doc['creator'] ? new User(doc['creator']) : new User({}),
              uploadedOn: doc['created_on'] ? doc['created_on'] : '',
              commentID: doc['change_request_comment_id'] ? doc['change_request_comment_id'] : doc['release_package_comment_id'] ? doc['release_package_comment_id'] : ''
            };
            attachments.push({'document': document, 'contentType': (doc['type'] ? doc['type'] : ''), 'contentSize': (doc['size'] ? doc['size'] : 0)});
          });
        }
        this.microServiceAttachmentsCount = attachments.length;
        ProcessedResponse.push({'category': ((res['category']  && res['documents'].length > 0) ? res['category'] === 'SCIA' || res['category'] === 'CBC' ? res['category'] : this.helperService.convertToSentenceCase(res['category']) : ''), 'attachments': attachments});
      });
    }
    return ProcessedResponse;
  }

  mergeResponses(aiResponse, crResponse) {
    this.attachmentList = crResponse.concat(aiResponse);
    this.attachmentCount = this.getAttachmentCount(aiResponse) + this.microServiceAttachmentsCount;
    this.microServiceAttachmentsCount = 0;
  }

  getAttachmentCount(attachmentList) {
    let attachmentsCount = 0;
    this.attachmentList.forEach((attachmentCategory) => {
      if (attachmentCategory.attachments) {
        attachmentsCount += attachmentCategory.attachments.length;
      }
    });
    return attachmentsCount;
  }

  onClickAttachment(attachment) {
    window.open(this.pictureUrl + '/' + attachment.document.ID, '_blank', '', false);
  }

  getNoDataMessageForCaseObject() {
    switch (this.caseObjectType) {
      case 'Action':
        return 'Uploads to this action will appear here. This does not include attachments to the CR.';
      default:
        return 'All uploads for this ' + (this.linkedItem ? this.helperService.getCaseObjectForms(this.caseObjectType).abbr : '') + ' will appear here. ' +
          'This includes SCIA,CBC and attachments to comments. Attachment to actions are not shown here.';
    }
  }

  attachmentClicked(event) {
    if (event && event.commentID) {
      this.sidePanelService.getCommentDocumentContent$(event.ID, this.caseObjectType).subscribe((documentData: any) => {
        this.helperService.downloadAttachmentOnClick(event, documentData);
      });
    } else {
      this.sidePanelService.getDocumentContent$(event.ID, this.caseObjectType).subscribe((documentData: any) => {
        this.helperService.downloadAttachmentOnClick(event, documentData);
      });
    }
  }
}
