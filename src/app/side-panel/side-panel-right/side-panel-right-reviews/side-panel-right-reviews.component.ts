import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {selectRightSidePanelReviewState} from '../../store';

import {MyChangeState} from '../../../shared/models/mc-store.model';
import {
  CaseActionDetail,
  CaseObject,
  CasePermissions,
  Review,
  Reviewer
} from '../../../shared/models/mc.model';
import {
  FormControlConfiguration,
  ReviewerFormConfiguration,
} from '../../../shared/models/mc-configuration.model';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {ReviewService} from '../../../core/services/review.service';
import {EditReviewerDialogComponent} from './edit-reviewer-dialog/edit-reviewer-dialog.component';
import {updateReviewCaseActions} from '../../store/actions/right-side-panel.actions';
import {CaseAction} from '../../../shared/models/case-action.model';
import {loadCaseActions} from '../../../store/actions/case-object.actions';
import {reviewTasksValue} from '../../../reviews/store';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';


@Component({
  selector: 'mc-side-panel-right-reviews',
  templateUrl: './side-panel-right-reviews.component.html',
  styleUrls: ['./side-panel-right-reviews.component.scss']
})
export class SidePanelRightReviewsComponent implements OnInit {
  reviewerFormConfiguration: ReviewerFormConfiguration;
  reviewerFormGroup: FormGroup;
  caseObject: Review;
  reviewerMandatoryFields: string[];
  showReviewerForm: boolean;
  mode: string;
  toggleReviewViewControl: FormControl;
  toggleReviewViewConfiguration: FormControlConfiguration;

  @Input()
  caseObjectType: string;
  @Input()
  panelMode: string;
  reviewersList: any;
  reviewersListCopy: any;
  progressBar: boolean;
  inProgress_reviewer_count: number;
  completed_reviewer_count: number;
  createReviewMandatoryParams: any;

  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && caseObject.id) {
      this.caseObject = caseObject;
      this.getReviewersListByReviewID();
    }
  }

  constructor(private readonly matDialog: MatDialog,
              private readonly appStore: Store<MyChangeState>,
              private readonly reviewService: ReviewService,
              private readonly configurationService: ConfigurationService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly formBuilder: FormBuilder) {
    this.progressBar = false;
    this.showReviewerForm = false;
    this.reviewersList = [];
    this.reviewersListCopy = [];
    this.inProgress_reviewer_count = 0;
    this.completed_reviewer_count = 0;
    this.toggleReviewViewControl = new FormControl('INPROGRESS');
    this.toggleReviewViewConfiguration = {
      options: [
        {
          value: 'INPROGRESS',
          label: 'In Progress (00)',
          tooltip: 'View Reviewers with status Open, Accepted and Not Completed'
        },
        {name: 'COMPLETED', label: 'Completed (00)', tooltip: 'View Reviewers with status Rejected, Completed'}
      ]
    } as FormControlConfiguration;
    this.reviewerFormConfiguration = this.configurationService.getFormFieldParameters('Reviewer2.0') as ReviewerFormConfiguration;
    this.reviewerFormConfiguration['reviewer'] = {
      ID: 'reviewer',
      label: 'Reviewer'
    };
    this.reviewerFormConfiguration['reviewer_due_date'] = {
      ID: 'reviewer.due_date',
      label: 'Reviewer\'s Due Date'
    };
  }

  ngOnInit(): void {
    this.subscribeToStore();
    this.activateObservables();
    this.getAllReviewTaskCaseActions();
  }

  subscribeToStore() {
    this.appStore.pipe(select(selectRightSidePanelReviewState)).subscribe((value) => {
      if (value && value.updateReviewerList && value.updateReviewerList.valueOf()) {
        this.getReviewersListByReviewID();
      }
    });
  }

  getReviewersListByReviewID() {
    this.progressBar = true;
    this.reviewService.getReviewersByReviewID(this.caseObject.id, true).subscribe(res => {
      this.progressBar = false;
      this.reviewersList = res && res['review_task_summaries'] ? res['review_task_summaries'] : [];
      this.handleReviewerCaseActions();
      this.reviewersListCopy = res && res['review_task_summaries'] ? res['review_task_summaries'] : [];
      this.appStore.dispatch(reviewTasksValue(this.reviewersList));
      this.reviewerFormGroup = this.mcFormGroupService.createReviewerFormGroup(new Reviewer(this.reviewersList));
      this.inProgress_reviewer_count = this.reviewersList.filter((item) => item.status === 1 || item.status === 2 || item.status === 3).length;
      this.completed_reviewer_count = this.reviewersList.filter((item) => item.status === 4 || item.status === 5 || item.status === 6).length;
      this.toggleReviewViewConfiguration = {
        options: [
          {
            value: 'INPROGRESS',
            label: 'In Progress ' + '(' + (this.inProgress_reviewer_count < 10 ? '0' + this.inProgress_reviewer_count : this.inProgress_reviewer_count) + ')',
            tooltip: 'View Reviewers with status Open, Accepted and Not Completed'
          },
          {
            value: 'COMPLETED',
            label: 'Completed ' + '(' + (this.completed_reviewer_count < 10 ? '0' + this.completed_reviewer_count : this.completed_reviewer_count) + ')',
            tooltip: 'View Reviewers with status Rejected, Completed'
          }
        ]
      };
      this.filterReview();
    }, () => {
      this.progressBar = false;
      this.reviewersList = [];
      this.reviewersListCopy = [];
    });
  }

  getAllReviewTaskCaseActions() {
    this.reviewService.getAllReviewTaskCaseActions().subscribe(allCaseActions => {
      allCaseActions.forEach((caseAction) => {
        if (caseAction['case_action'] === 'CREATE') {
          this.createReviewMandatoryParams = caseAction['mandatory_properties_regexps'];
        }
      });
    });
  }

  handleReviewerCaseActions() {
    const reviewers: Reviewer[] = this.reviewersList;
    for (let count = 0; count < reviewers.length; count++) {
      reviewers[count]['caseObject'] = new CaseObject(reviewers[count].id.toString(), '', 'ReviewTask');
      this.storeReviewerCaseActions(reviewers[count]['case_permissions'], reviewers[count].id.toString());
    }
  }

  storeReviewerCaseActions(casePermissions: CasePermissions, reviewerId: string) {
    const caseActionsAllowed = [];
    const caseActions: CaseActionDetail[] = casePermissions.case_actions;
    const caseProperties = casePermissions.case_properties;
    caseActions.forEach(caseAction => {
      caseActionsAllowed.push(new CaseAction(reviewerId, '',
        'ReviewTask', caseAction.is_allowed, caseAction.case_action, caseAction.mandatory_properties_regexps));
    });
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  addReviewer(): void {
    this.reviewerFormGroup = this.mcFormGroupService.createReviewerFormGroup({}, this.createReviewMandatoryParams);
    this.showReviewerForm = true;
    this.mode = 'add';
  }

  bulkReviewersUpdate(): void {
    const reviewers = this.reviewersListCopy ? this.reviewersListCopy.filter((item) => item.status === 1 || item.status === 2 || item.status === 3) : [];
    let dialogRef: MatDialogRef<EditReviewerDialogComponent>;
    dialogRef = this.matDialog.open(EditReviewerDialogComponent, {
      width: '70rem',
      disableClose: true,
      data: {
        title: 'Edit Reviewers',
        mode: 'edit',
        isBulkReviewers: true,
        reviewId: this.caseObject.id,
        reviewers: reviewers,
        reviewMandatoryFields: this.reviewerMandatoryFields
      },
      position: {top: '3rem'} as DialogPosition
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getReviewersListByReviewID();
      }
    });
  }

  editReviewer(reviewer: Review): void {
    this.reviewerFormGroup = this.mcFormGroupService.createReviewerFormGroup(new Reviewer(reviewer));
    this.showReviewerForm = true;
    this.mode = 'edit';
  }

  updateReviewer(updateReviewerData): void {
    updateReviewerData.reviewer['showLoaderFor' + updateReviewerData.caseAction] = true;
    this.reviewService.updateReviewerPerformCaseAction(updateReviewerData, updateReviewerData.caseAction).subscribe(res => {
      if (res) {
        this.appStore.dispatch(updateReviewCaseActions({updateReviewCaseActions: true}));
        updateReviewerData.reviewer['showLoaderFor' + updateReviewerData.caseAction] = false;
        updateReviewerData.reviewer.status = res.status;
        updateReviewerData.reviewer.status_label = res.status_label;
        this.storeReviewerCaseActions(res.case_permissions, updateReviewerData.reviewer.id);
        (updateReviewerData.caseAction === 'COMPLETE' || updateReviewerData.caseAction === 'REJECT') ?
          this.toggleReviewViewControl.setValue('COMPLETED') : this.toggleReviewViewControl.setValue('INPROGRESS');
        this.filterReview();
      } else if (updateReviewerData.caseAction === 'DELETE') {
        this.reviewersList.splice(this.reviewersList.findIndex((item) => item.id === updateReviewerData.reviewer.id), 1);
        this.reviewersListCopy.splice(this.reviewersListCopy.findIndex((item) => item.id === updateReviewerData.reviewer.id), 1);
        this.appStore.dispatch(reviewTasksValue([...this.reviewersListCopy]));
      }
      this.inProgress_reviewer_count = this.reviewersListCopy.filter((item) => item.status === 1 || item.status === 2 || item.status === 3).length;
      this.completed_reviewer_count = this.reviewersListCopy.filter((item) => item.status === 4 || item.status === 5 || item.status === 6).length;
      this.toggleReviewViewConfiguration = {
        options: [
          {
            value: 'INPROGRESS',
            label: 'In Progress ' + '(' + (this.inProgress_reviewer_count < 10 ? '0' + this.inProgress_reviewer_count : this.inProgress_reviewer_count) + ')',
            tooltip: 'View Reviewers with status Open, Accepted and Not Completed'
          },
          {
            value: 'COMPLETED',
            label: 'Completed ' + '(' + (this.completed_reviewer_count < 10 ? '0' + this.completed_reviewer_count : this.completed_reviewer_count) + ')',
            tooltip: 'View Reviewers with status Rejected, Completed'
          }
        ]
      };
    });
  }

  refreshReviewers(updatedReviewerId: string): void {
    this.showReviewerForm = false;
    this.appStore.dispatch(updateReviewCaseActions({updateReviewCaseActions: true}));
    this.getReviewersListByReviewID();
  }

  cancelReviewer(): void {
    this.showReviewerForm = false;
  }

  activateObservables(): void {
    this.toggleReviewViewControl.valueChanges.subscribe(() => {
      // this.reviewersList = this.reviewersListCopy;
      this.filterReview();
    });
  }

  filterReview(): void {
    this.reviewersList = this.reviewersListCopy;
    if (this.toggleReviewViewControl && this.toggleReviewViewControl.value === 'INPROGRESS') {
      this.reviewersList = this.reviewersList ? this.reviewersList.filter((item) => item.status === 1 || item.status === 2 || item.status === 3) : [];
    } else if (this.toggleReviewViewControl && this.toggleReviewViewControl.value === 'COMPLETED') {
      this.reviewersList = this.reviewersList ? this.reviewersList.filter((item) => item.status === 4 || item.status === 5 || item.status === 6) : [];
    }
  }

}
