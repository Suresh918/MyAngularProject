import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { CaseObjectOverview } from '../../case-object-list/case-object-list.model';
import {ReviewService} from '../../../../core/services/review.service';
import {ReviewSummaryNew} from '../../../models/mc-presentation.model';
import {FilterOptions} from '../../../models/mc-filters.model';
import {User} from '../../../models/mc.model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {ConfigurationService} from "../../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-release-package-action-content',
  templateUrl: './release-package-action-content.component.html',
  styleUrls: ['./release-package-action-content.component.scss']
})
export class ReleasePackageActionContentComponent implements OnInit {
  @Input()
  caseObject: CaseObjectOverview;
  @Input()
  review: ReviewSummaryNew;

  deepLinkURL: string;
  reviewEntriesList: any;
  reviewOverlayData: any;
  progressBar: boolean;
  constructor(private readonly router: Router,
              public readonly configurationService: ConfigurationService,
              private readonly userProfileService: UserProfileService,
              private readonly reviewService: ReviewService) {
  }

  ngOnInit() {
    this.deepLinkURL = this.configurationService.getLinkUrl('Teamcenter');
  }

  getReviewersList(review: ReviewSummaryNew) {
    event.stopPropagation();
    this.progressBar = true;
    this.reviewService.getReviewersActionDetails$(review.id).subscribe((reviewersDetails: any) => {
      this.progressBar = false;
      if (reviewersDetails['review_task_summaries'].length > 0) {
        this.reviewOverlayData = reviewersDetails.review_task_summaries;
      }
    }, () => {
      this.progressBar = false;
    });
  }

  getDefectsList(review: ReviewSummaryNew) {
    event.stopPropagation();
    this.progressBar = true;
    const orderBy = 'sequence_number,asc';
    this.reviewService.getReviewEntries(review.id, null, null, null, '', orderBy).subscribe((reviewersDetails: any) => {
      this.progressBar = false;
      if (reviewersDetails && reviewersDetails['results'] && reviewersDetails['results'].length > 0) {
        this.reviewEntriesList = reviewersDetails['results'];
      }
    }, () => {
      this.progressBar = false;
    });
  }

  reviewersListItemClicked(review): void {
    const mcState = this.userProfileService.getStatesData();
    const role = {label: 'Reviewer', name: 'reviewer', sequence: '1'};
    mcState.reviewEntryState.commonCaseObjectState.filters['filtersModel']['currentDefaultFilter'] = new FilterOptions({});
    mcState.reviewEntryState.commonCaseObjectState.filters['filtersModel']['currentDefaultFilter'].people = [{role: role, user: new User(review.assignee)}];
    this.userProfileService.updateUserProfileStates(mcState);
    window.open(`/reviews/${review.id}`, '_blank');
  }

  defectsListItemClicked(review): void {
    window.open(`/reviews/${review.id}`, '_blank');
  }

  overlayCardSubmit(review) {
    this.router.navigate(['reviews/' + review.id]);
  }

}
