import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

import {CaseObjectListService} from '../../../../core/services/case-object-list.service';
import {AbstractCaseObjectStateAnalytics, CaseObjectStateAnalytics} from '../case-object-list.model';
import {CaseObjectState} from '../../../models/mc-states-model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-case-object-state-panel',
  templateUrl: './case-object-state-panel.component.html',
  styleUrls: ['./case-object-state-panel.component.scss']
})
export class CaseObjectStatePanelComponent implements OnInit, OnChanges {
  @Input()
  caseObjectType: string;
  @Input()
  showActionsCount: boolean;
  @Input()
  caseObjectLabel: string;
  @Input()
  caseObjectRouterPath: string;
  @Input()
  filterQuery: string;
  @Input()
  expandStatePanel: boolean;
  @Input()
  stateCardType: string;
  @Output()
  readonly statePanelSelected: EventEmitter<any> = new EventEmitter();
  @Output()
  readonly obsoletedCardsCountChange: EventEmitter<number> = new EventEmitter();
  @Output()
  private readonly selectedStatusCard: EventEmitter<CaseObjectStateAnalytics> =
    new EventEmitter<CaseObjectStateAnalytics>();
  @Output() private readonly isSetStateCardList: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  obsoletedCardsCount: number;
  stateCardList: CaseObjectStateAnalytics[];
  selectedCardIndex: number;
  dueDate: {};
  currentStateModel: CaseObjectState;
  userProfileUpdatedState$: Subject<void> = new Subject();
  subject$: BehaviorSubject<string> = new BehaviorSubject('');
  toolTip: boolean;
  isPanelDataLoading: boolean;
  constructor(private readonly caseObjectListService: CaseObjectListService,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService) {
    this.stateCardList = [];
    this.isPanelDataLoading = false;
  }

  ngOnInit() {
    this.subscribeToFilterChanges();
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.filterQuery && (simpleChanges.filterQuery.currentValue || simpleChanges.filterQuery.currentValue.trim() === '')) {
      this.filterQuery = simpleChanges.filterQuery.currentValue;
      this.subject$.next(simpleChanges.filterQuery.currentValue);
    }
  }

  fetchPanelData() {
    this.isPanelDataLoading = true;
    const filter = 'generalInformation.status !{equal} "OBSOLETED"';
    this.currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
    this.caseObjectListService.getCaseObjectStatusCardDetails(this.caseObjectRouterPath, 0, '', this.filterQuery, '').subscribe((res) => {
      this.isSetStateCardList.emit(false);
      this.stateCardList = res;
      if (this.caseObjectType === 'ChangeNotice') {
        this.stateCardList.forEach((card: AbstractCaseObjectStateAnalytics) => {
          card.toolTip = 'Show ' + card.caseObjectState + ' only';
        });
      }
      this.isPanelDataLoading = false;
      if (res && res[0]) {
        this.obsoletedCardsCount = res[0].obsoletedCaseObjectsCount;
      }
      this.setActivePanelsSelection();
    });
    if (this.caseObjectType === 'ChangeNotice') {
      const statusList = this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState.split(',');
      this.statePanelSelected.emit({
        'caseObjectType': this.caseObjectRouterPath,
        'state': statusList
      });
    } else {
      this.statePanelSelected.emit({
        'caseObjectType': this.caseObjectRouterPath,
        'state': this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState || '' as string
      });
    }
  }

  subscribeToFilterChanges() {
    this.subject$.subscribe(() => {
      this.fetchPanelData();
    });
  }

  onStatusCardSelection(cardDetails, index) {
    // if selected state panel same as previous panel - toggle
    if (this.selectedCardIndex === index) {
      this.selectedCardIndex = null;
    } else {
      this.selectedCardIndex = index;
    }
    this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState = (this.selectedCardIndex !== null) ? (cardDetails.caseObjectState || cardDetails.caseObjectStatus) : '';
    this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject, this.userProfileUpdatedState$);
    this.statePanelSelected.emit({
      'caseObjectType': this.caseObjectRouterPath,
      'state': this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState as string
    });
    this.obsoletedCardsCountChange.emit((this.selectedCardIndex !== null) ? 0 : this.obsoletedCardsCount);
  }

  getToolTip(stateCard): string {
    if (this.expandStatePanel) {
      this.toolTip = false;
    } else {
      this.toolTip = true;
    }
    const status = stateCard.caseObjectStatus || stateCard.caseObjectState;
    if (this.caseObjectType.toLowerCase() === 'agenda') {
      this.toolTip = true;
      switch (status.toUpperCase()) {
          case 'UNASSIGNED':
          return 'Not Linked to Outlook Meeting Yet';
        case 'ASSIGNED':
          return 'Linked to Outlook Meeting';
        case 'COMMUNICATED':
          return 'Agendas Update Sent To Invitees';
        case 'PREPARE-MINUTES':
          return 'During / Right After Meeting';
        case 'COMPLETED':
          return 'Minutes Were Sent';
        default:
          return '';
      }
    }
    if (!this.expandStatePanel) {
      const actions = stateCard.openActionsCount;
      const soon = (stateCard.caseObjectState !== 'CLOSE') ? stateCard.overdueActionsCount : '';
      const late = (stateCard.caseObjectState !== 'CLOSE') ? stateCard.dueSoonActionsCount : '';
      const prdSoon = (stateCard.plannedReleaseDateDueSoonCount !== null
        && stateCard.caseObjectStatus !== 'RELEASED'
        && stateCard.caseObjectState !== 'CLOSE') ? stateCard.plannedReleaseDateDueSoonCount : '0';
      const pedSoon = ((stateCard.plannedEffectiveDateDueSoonCount !== null && stateCard.caseObjectStatus === 'RELEASED')
          || (stateCard.plannedEffectiveDateDueSoonCount !== null && stateCard.caseObjectStatus !== 'RELEASED'
            && stateCard.caseObjectStatus !== 'READY-FOR-RELEASE')) ? stateCard.plannedEffectiveDateDueSoonCount : '0';
      const prdLate = (stateCard.plannedReleaseDateOverdueCount !== null
        && stateCard.caseObjectStatus === 'READY-FOR-RELEASE'
        && stateCard.caseObjectState !== 'CLOSE') ? stateCard.plannedReleaseDateOverdueCount : '0';
      const pedLate = (stateCard.plannedEffectiveDateOverdueCount !== null && stateCard.caseObjectStatus === 'RELEASED') ? stateCard.plannedEffectiveDateOverdueCount : '';
      if ( stateCard.plannedEffectiveDateDueSoonCount === undefined ) {
        return `Actions: ${actions} · Soon: ${soon} · Late: ${late}`;
      } else {
        if ( stateCard.caseObjectStatus === 'NEW' || stateCard.caseObjectStatus === 'CREATED' || stateCard.caseObjectStatus === 'OBSOLETED') {
          return `Actions: ${actions} · PRD Soon: ${prdSoon} · PED Soon: ${pedSoon}`;
        } else if ( stateCard.caseObjectStatus === 'READY-FOR-RELEASE' ) {
          return `Actions: ${actions} · PRD Soon: ${prdSoon} · PRD Late: ${prdLate}`;
        } else if ( stateCard.caseObjectStatus === 'RELEASED') {
          return `Actions: ${actions} · PRD Soon: ${prdSoon} · PRD Late: ${pedLate}`;
        } else if ( stateCard.caseObjectStatus === 'CLOSED' ) {
          return `Actions: ${actions} `;
        }
      }
    }
  }

  setActivePanelsSelection() {
    if (this.caseObjectType === 'ChangeNotice') {
      const panelSelected = this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState;
      this.stateCardList.forEach((stateCard, index) => {
        let currentCaseObject = '';
        stateCard['caseObjectState'] ? (currentCaseObject = stateCard['caseObjectState']) : (currentCaseObject = stateCard['caseObjectStatus']);
        if (panelSelected.includes(currentCaseObject)) {
          stateCard['checked'] = true;
        }
      });
    } else {
      const panelSelected = this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState;
      this.stateCardList.forEach((stateCard, index) => {
        let currentCaseObject = '';
        stateCard['caseObjectState'] ? (currentCaseObject = stateCard['caseObjectState']) : (currentCaseObject = stateCard['caseObjectStatus']);
        if (currentCaseObject === panelSelected) {
          this.selectedCardIndex = index;
        }
      });
      this.obsoletedCardsCountChange.emit((this.selectedCardIndex !== null) ? 0 : this.obsoletedCardsCount);
    }
  }

  panelClicked(cardDetails) {
    if (cardDetails.length > 0) {
      const statusList = [];
      cardDetails.forEach(item => {
        statusList.push(item.caseObjectState);
      });
      this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState = statusList.join(',');
      this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject, this.userProfileUpdatedState$);
      this.statePanelSelected.emit({
        'caseObjectType': this.caseObjectRouterPath,
        'state': statusList
      });
    } else {
      this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState = '';
      this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject, this.userProfileUpdatedState$);
      this.statePanelSelected.emit({
        'caseObjectType': this.caseObjectRouterPath,
        'state': this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState as string
      });
    }

  }

}
