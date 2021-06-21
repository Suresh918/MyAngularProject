import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

import {ReviewerFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {Review, ReviewEntry, Reviewer, User} from '../../../../shared/models/mc.model';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReviewService} from '../../../../core/services/review.service';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-edit-reviewer-dialog',
  templateUrl: './edit-reviewer-dialog.component.html',
  styleUrls: ['./edit-reviewer-dialog.component.scss']
})
export class EditReviewerDialogComponent implements OnInit {
  users: any[];
  reviewerFormConfiguration: ReviewerFormConfiguration;
  reviewerFormGroup: FormGroup;
  showLoader = false;
  reviewId: number;
  reviewersList: any;
  reviewersListCopy: any;
  isBulkReviewers: boolean;
  formUpdated: boolean;
  reviewMandatoryFields: string[];
  isSaveAllowed: boolean;
  reviewers: User[];
  reviewersCopy: any[];
  allReviewersChecked: boolean;
  validReviewersCount: number;
  reviewerStatusList: any;
  validReviewers: any[];
  selectedReviewersCount = 0;

  constructor(private readonly formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly reviewDialog: MatDialog,
              private readonly dialogRef: MatDialogRef<EditReviewerDialogComponent>,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly configurationService: ConfigurationService,
              private readonly matSnackBar: MatSnackBar,
              private readonly reviewService: ReviewService) {
    // this.reviewMandatoryFields = data.reviewMandatoryFields;
    this.isBulkReviewers = !!data.isBulkReviewers;
    this.reviewId = data.reviewId;
    this.reviewerFormConfiguration = this.configurationService.getFormFieldParameters('Reviewer2.0') as ReviewerFormConfiguration;
    this.reviewerFormConfiguration.due_date.minDate = new Date();
    this.reviewMandatoryFields = [];
  }

  ngOnInit(): void {
    this.isSaveAllowed = false;
    this.allReviewersChecked = true;
    this.reviewersList = this.data.reviewers.map((obj) => obj.assignee);
    this.reviewerStatusList = this.data.reviewers.map((obj) => obj.status);
    this.reviewers = this.data.reviewers.map((obj) => new User(obj.assignee));
    this.reviewersCopy = this.reviewers.map(x => ({...x}));
    for (let i = 0 ; i < this.reviewersList.length ; i++) {
      this.reviewersCopy[i]['status'] = this.reviewerStatusList[i];
    }
    this.validReviewers = this.getValidReviewers();
    this.validReviewersCount = this.reviewersCopy.filter((reviewer) => reviewer.selected).length;
    const reviewerList = {
      'assignees': this.reviewersList ? this.reviewersList : []
    };
    this.reviewerFormGroup = this.mcFormGroupService.createReviewersFormGroup(new Reviewer(reviewerList));
    this.reviewerFormGroup.get('assignees').setValidators(Validators.required);
    this.reviewerFormGroup.get('due_date').setValidators(Validators.required);
    this.removeInvalidReviewers();
  }

  saveBulkDueDate() {
    if (this.reviewerFormGroup.valid) {
      this.showLoader = true;
      const payload = this.getPayload();
      this.reviewService.editReviewersBulkDueDate(payload).subscribe(res => {
        if (res) {
          this.dialogRef.close(true);
          this.matSnackBar.open(`Reviewers due date updated successfully`, '', {duration: 2000});
        }
      }, () => {
        this.showLoader = false;
        this.dialogRef.close(false);
      });
    }
  }

  getPayload() {
    const reviewTasksToUpdate = [];
    const allReviewersList = this.data.reviewers;
    const reviewers = this.reviewerFormGroup.get('assignees').value;
    const due_date = this.reviewerFormGroup.get('due_date').value;
    reviewers.forEach((reviewer) => {
      const selectedReviewer = allReviewersList.filter((item) => item.assignee.user_id === reviewer.userID)[0];
      reviewTasksToUpdate.push(
        {
          'oldIns': {
            'due_date': selectedReviewer['due_date'],
          },
          'newIns': {
            'due_date': due_date,
          },
          'id': selectedReviewer.id
        });
    });
    return reviewTasksToUpdate;
  }

  restrictNewReviewersAdded(event) {
    const arr = [];
    const allReviewersList = this.data.reviewers;
    const reviewers = this.reviewerFormGroup.get('assignees').value;
    const reviewersList = reviewers.forEach((reviewer) => {
      const selectedReviewer = allReviewersList.find((superReviewer) => superReviewer.assignee.user_id === reviewer.userID);
      arr.push(selectedReviewer);
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  reviewersChecked() {
    let selectedReviewersCount = 0;
    this.reviewersCopy.forEach(reviewer => {
      if (reviewer.selected) {
        selectedReviewersCount++;
      }
    });
    if (selectedReviewersCount === 0) {
      this.allReviewersChecked = false;
    } else if (selectedReviewersCount === this.validReviewersCount) {
      this.allReviewersChecked = true;
    }
  }

  toggleReviewer(reviewer: any, event) {
    this.reviewersCopy.find(data => data.userID === reviewer.userID)['selected'] = !this.reviewersCopy.find(data => data.userID === reviewer.userID)['selected'];
    this.reviewersChecked();
    this.updateReviewers(reviewer);
    this.updateSelectedReviewersCount(event);
  }

  toggleReviewers(event) {
    if (event.checked) {
      this.reviewersCopy.forEach(reviewer => {
        if (reviewer.valid) {
          reviewer.selected = true;
        }
      });
    } else {
      this.reviewersCopy.forEach(reviewer => {
        if (reviewer.valid) {
          reviewer.selected = false;
        }
      });
    }
    this.allReviewersChecked = !this.allReviewersChecked;
    if (this.allReviewersChecked) {
      this.reviewerFormGroup.get('assignees').setValue(this.validReviewers);
      this.selectedReviewersCount = this.validReviewersCount;
    } else {
      this.reviewerFormGroup.get('assignees').setValue([]);
      this.selectedReviewersCount = 0;
    }
  }

  updateReviewers(reviewer: any) {
    const originalReviewer = this.reviewers.find(data => data.userID === reviewer.userID);
    if (!reviewer.selected) {
      const checkedReviewers = this.reviewerFormGroup.get('assignees').value.filter(option => option.userID !== originalReviewer.userID);
      this.reviewerFormGroup.get('assignees').setValue(checkedReviewers);
    } else {
      const currentValue = this.reviewerFormGroup.get('assignees').value;
      currentValue.push(originalReviewer);
      this.reviewerFormGroup.get('assignees').setValue(currentValue);
    }
  }

  getValidReviewers() {
    this.reviewersCopy.forEach(reviewer => {
      if (reviewer.status === 1 || reviewer.status === 2) {
        reviewer['valid'] = true;
      } else {
        reviewer['valid'] = false;
      }
    });
    this.reviewersCopy.forEach(reviewer => {
      if (reviewer.valid) {
        reviewer['selected'] = true;
        this.selectedReviewersCount++;
      } else {
        reviewer['selected'] = false;
      }
    });
    return this.reviewersCopy.filter(reviewer => reviewer.valid === true );
  }

  removeInvalidReviewers() {
    this.reviewersCopy.forEach(reviewer => {
      if (!reviewer.valid) {
        const originalReviewer = this.reviewers.find(data => data.userID === reviewer.userID);
        const checkedReviewers = this.reviewerFormGroup.get('assignees').value.filter(option => option.userID !== originalReviewer.userID);
        this.reviewerFormGroup.get('assignees').setValue(checkedReviewers);
      }
    });
  }

  updateSelectedReviewersCount(data) {
    if (data.checked) {
      this.selectedReviewersCount++;
    } else {
      this.selectedReviewersCount--;
    }
  }
}
