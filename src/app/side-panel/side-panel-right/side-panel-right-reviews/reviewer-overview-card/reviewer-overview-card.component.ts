import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UpdateReviewerData} from '../../../../shared/models/mc-presentation.model';

@Component({
  selector: 'mc-reviewer-overview-card',
  templateUrl: './reviewer-overview-card.component.html',
  styleUrls: ['./reviewer-overview-card.component.scss']
})
export class ReviewerOverviewCardComponent implements OnInit {
  @Input()
  reviewer: any;
  @Output()
  readonly edit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly reviewerSubmit: EventEmitter<UpdateReviewerData> = new EventEmitter<UpdateReviewerData>();

  constructor() {
  }

  ngOnInit(): void {
  }

  editReviewer(reviewer, event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.edit.emit(reviewer);
  }

  updateReviewer(reviewer, caseAction, event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.reviewerSubmit.emit({'reviewer': reviewer, 'caseAction': caseAction});
  }

}
