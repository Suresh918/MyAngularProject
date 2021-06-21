import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ReviewerFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {CaseObject, Review, MiraiUser} from '../../../../shared/models/mc.model';
import {DateTimeFormatter} from '../../../../core/utilities/date-time-formatter.service';
import {ReviewService} from '../../../../core/services/review.service';
import {UpdateFieldService} from '../../../../core/services/update-field.service';
import {CaseObjectServicePath} from "../../../../shared/components/case-object-list/case-object.enum";

@Component({
  selector: 'mc-add-reviewer',
  templateUrl: './add-reviewer.component.html',
  styleUrls: ['./add-reviewer.component.scss']
})
export class AddReviewerComponent implements OnInit {
  @Input()
  reviewerFormConfiguration: ReviewerFormConfiguration;
  @Input()
  reviewerFormGroup: FormGroup;
  @Input()
  caseObject: Review;
  @Input()
  mode: string;
  @Output()
  readonly refreshReviewers: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly updateInProgress: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  readonly cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  dueDateInstance: any;
  constructor(private readonly formBuilder: FormBuilder,
              private readonly dateTimeFormatter: DateTimeFormatter,
              public readonly updateFieldService: UpdateFieldService,
              private readonly matSnackBar: MatSnackBar,
              private readonly reviewService: ReviewService) {
  }

  ngOnInit(): void {
    this.reviewerFormConfiguration['reviewer_due_date'].minDate = new Date();
  }

  addReviewer(): void {
    const reviewerData = this.reviewerFormGroup.getRawValue();
    reviewerData.due_date = this.dateTimeFormatter.setDateTime(reviewerData.due_date);
    reviewerData.assignee = new MiraiUser(reviewerData.assignee);
    this.updateInProgress.emit(true);
    this.reviewService.createReviewer(this.caseObject.id, reviewerData).subscribe(res => {
      this.updateInProgress.emit(false);
      this.refreshReviewers.emit(res.id);
    }, (error) => {
      this.updateInProgress.emit(false);
      this.matSnackBar.open(`Reviewer not added. Add a reviewer not already present.`, '', {duration: 2000});
    });
  }

  setReviewerDueDate($event) {
    this.dueDateInstance = $event;
  }

  updateReviewer(): void {
    const reviewerData = this.reviewerFormGroup.getRawValue();
    reviewerData.due_date = this.dateTimeFormatter.setDateTime(reviewerData.due_date);
    reviewerData.assignee = new MiraiUser(reviewerData.assignee);
    this.updateInProgress.emit(true);
    this.updateFieldService.updateInstance$(
      new CaseObject(JSON.stringify(reviewerData.id) , 'AA', 'ReviewTask') ,
      JSON.stringify(reviewerData.id),
      CaseObjectServicePath['ReviewTask'],
      {
        'oldIns': {
          'due_date': this.dueDateInstance.oldValue,
        },
        'newIns': {
          'due_date': this.dueDateInstance.value,
        }
      }).subscribe(res => {
        if (res && res['id']) {
          this.updateInProgress.emit(false);
          this.refreshReviewers.emit(reviewerData.id);
        }
    }, () => {
      this.updateInProgress.emit(false);
    });
  }

  cancelReviewer(): void {
    this.cancel.emit();
  }

}
