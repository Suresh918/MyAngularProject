import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSummaryList, AggregatedAction, UpdateActionData} from '../../../../shared/models/mc-presentation.model';
import {Action} from '../../../../shared/models/mc.model';
import {ActionService} from '../../../../core/services/action.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-action-overview-card',
  templateUrl: './action-overview-card.component.html',
  styleUrls: ['./action-overview-card.component.scss']
})
export class ActionOverviewCardComponent implements OnInit {
  @Input()
  action: AggregatedAction;
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectStatus: string;
  @Output()
  readonly edit: EventEmitter<Action> = new EventEmitter<Action>();
  @Output()
  readonly updateActionField: EventEmitter<Action> = new EventEmitter<Action>();
  @Output()
  readonly actionSubmit: EventEmitter<UpdateActionData> = new EventEmitter<UpdateActionData>();
  @Output()
  readonly onUpdateActionType: EventEmitter<Action> = new EventEmitter<Action>();
  progressBar: boolean;
  linkedItem: any;
  constructor(private readonly actionService: ActionService,
              private readonly router: Router) {
  }

  ngOnInit() {
  }

  editAction(action: Action, event?: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.edit.emit(action);
  }

  updateAction(action: Action, caseAction: string, event?: Event): void {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.actionSubmit.emit({'action': action, 'caseAction': caseAction});
  }

  openReviewAction(id: string) {
    this.actionService.getActionSummaryListWithoutCaseActions$(
      0,
      1,
      `ID {equal} ${id}`).subscribe((data: ActionSummaryList) => {
      if (data && data.actionSummary && data.actionSummary[0] && data.actionSummary[0].linkElement && data.actionSummary[0].linkElement.ID) {
        const path = data.actionSummary[0].linkElement.type === 'REVIEW' ? 'reviews/' : 'actions/';
        const pathId = data.actionSummary[0].linkElement.type === 'REVIEW' ? data.actionSummary[0].linkElement.ID : id;
        this.router.navigate([path + pathId]);
      }
    });
  }

  getTitleFlex(action: any): number {
    return (action && action.actionMetadata && action.actionMetadata.showRemoveBtn && this.caseObjectStatus !== 'CLOSED') ? 55 : 80;
  }

  onClickAction(action: any): void {
    if (action && action.action && (action.action.type === 'REVIEW' || action.action.type === 'PROCESS-REVIEW')) {
      this.openReviewAction( action.action.ID);
    } else if (action && action.action && action.action.ID) {
      this.router.navigate([`/actions/${action.action.ID}`]);
    }
  }

  isEnDateGreater(actionDeadline): boolean {
    return HelpersService.isPastDate(actionDeadline);
  }

  getEnDateDaysLeft(actionDeadline): number {
    return HelpersService.getDaysLeftFromNow(actionDeadline);
  }

  navigateToActions(ID) {
    event.stopPropagation();
    this.router.navigate([]).then(() => {
      window.open(`actions/${ID}`, '_blank');
    });
  }
}
