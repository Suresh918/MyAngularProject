import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {SidePanelService} from '../../../side-panel.service';

@Component({
  selector: 'mc-attachment-card',
  templateUrl: './attachment-card.component.html',
  styleUrls: ['./attachment-card.component.scss']
})
export class AttachmentCardComponent implements OnInit {
  @Input()
  attachment: any;
  @Input()
  mode: string;
  @Input()
  pictureURL: string;
  @Input()
  cardCategory: string;
  @Input()
  isAuthorizedToChangeDocuments: boolean;
  @Input()
  deleteButtonAction: string;
  @Input()
  updateButtonAction: string;
  @Input()
  caseObjectType: string;
  @Output() readonly deleteCardEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly editCardEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly attachmentClick: EventEmitter<any> = new EventEmitter();
  isCardExpanded: boolean;
  highlightIcon: boolean;

  constructor(public dialog: MatDialog, private readonly helperService: HelpersService, private readonly sidePanelService: SidePanelService) {
    this.highlightIcon = false;
  }

  ngOnInit() {
    this.isCardExpanded = false;
  }

  toggleExpansion(event, document) {
    event.stopPropagation();
    document['expanded'] = !document['expanded'];
  }

  openImageDialog(imageData) {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      imageData.URLSuffix = '/content';
    }
    let dialogRef: MatDialogRef<AALLightBoxComponent>;
    dialogRef = this.dialog.open(AALLightBoxComponent, {
      maxWidth: '1080px',
      data: {imageURL: this.pictureURL, imageData: imageData, disableDirection: 'both', title: this.cardCategory}
    });
    dialogRef.componentInstance.downloadAttachment.subscribe(data => {
      if (imageData) {
        this.sidePanelService.getDocumentContent$(imageData.ID , this.caseObjectType).subscribe((documentData: any) => {
          if (documentData) {
            this.helperService.downloadAttachmentOnClick(imageData, documentData);
          }
        });
      }
    });
  }

  deleteCard(docID) {
    event.stopPropagation();
    this.deleteCardEvent.emit(docID);
  }

  editDocument(docObject) {
    event.stopPropagation();
    this.editCardEvent.emit(docObject);
  }

  openAttachment(attachment) {
    (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') ? this.attachmentClick.emit(attachment) :
    window.open(this.pictureURL + '/' + attachment.ID, '_blank', '', false);
  }

  getShowPersonChip(attachment) {
    if (attachment && attachment.document && attachment.document.description) {
      return attachment.document['expanded'] || false;
    }
    return true;
  }
}
