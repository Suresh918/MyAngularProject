import {Component, Input, OnInit} from '@angular/core';
import {CaseObjectOverview} from '../case-object-list/case-object-list.model';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ReviewService} from '../../../core/services/review.service';
import {ReviewSummaryNew} from '../../models/mc-presentation.model';

@Component({
  selector: 'mc-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss']
})
export class ActionPanelComponent implements OnInit {

  @Input()
  caseObjectType: string;
  @Input()
  caseObjectRevision: string;
  @Input()
  caseObjectRouterPath: string;
  @Input()
  caseObject: CaseObjectOverview;
  @Input()
  title: string;
  @Input()
  caseObjectFrom: string;
  @Input()
  filterString?: string;
  @Input()
  agendaId?: string;
  @Input()
  restrictCCBActions?: string;

  actionOverViewList: any[];
  progressBar = false;
  review: ReviewSummaryNew;

  constructor(public readonly caseObjectListService: CaseObjectListService,
              private readonly reviewService: ReviewService) {
  }

  ngOnInit() {
  }

  getActionList(caseObject) {
    this.progressBar = true;
    this.actionOverViewList = [];
    const filter = this.filterString || 'generalInformation.status in ("OPEN","ACCEPTED")';
    this.caseObjectListService.getCaseObjectActionSummaries$( this.agendaId || caseObject.ID || caseObject.id, this.caseObjectRevision, this.caseObjectType, filter, '').subscribe((res) => {
      this.progressBar = false;
      if (this.restrictCCBActions) {
        this.actionOverViewList = res.filter(item => (item.expiry === 'Soon') || (item.expiry === 'Late'));
      } else {
        this.actionOverViewList = res;
      }
    });
  }

  getReviewByReleasePackageID() {
    if (this.caseObjectType === 'ReleasePackage') {
      this.progressBar = true;
      const filterQuery = 'contexts.context_id:' + (this.caseObject.ID || this.caseObject['id']) + ' and contexts.type:RELEASEPACKAGE';
      const sortBy = 'id,desc';
      this.reviewService.ReviewSummaryList(0, 1, filterQuery, sortBy).subscribe(res => {
        this.progressBar = false;
        if (res['results'] && res['results'].length) {
          this.review = res['results'].filter((item) => item.releasepackage_id === this.caseObject.ID)[0];
        }
      });
    }
  }

  getEnDateDaysLeft(actionDeadline): number {
    return HelpersService.getDaysLeftFromNow(actionDeadline);
  }

  isEnDateGreater(actionDeadline): boolean {
    return HelpersService.isPastDate(actionDeadline);
  }

}
