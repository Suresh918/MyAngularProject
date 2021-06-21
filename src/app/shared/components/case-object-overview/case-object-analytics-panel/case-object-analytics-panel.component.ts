import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CaseObjectServicePath} from '../../case-object-list/case-object.enum';
import {CaseObjectListService} from '../../../../core/services/case-object-list.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {CaseObjectState} from '../../../models/mc-states-model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-case-object-analytics-panel',
  templateUrl: './case-object-analytics-panel.component.html',
  styleUrls: ['./case-object-analytics-panel.component.scss']
})
export class CaseObjectAnalyticsPanelComponent implements OnInit {
  @Input()
  caseObjectType: string;
  @Input()
  filterQuery: string;
  @Input()
  viewQuery: string;
  @Input()
  filterUpdate$: BehaviorSubject<any>;
  @Input()
  expandStatePanel: boolean;
  @Input()
  mode: string;
  @Output()
  readonly statePanelSelected: EventEmitter<any> = new EventEmitter();
  userProfileUpdatedState$: Subject<void> = new Subject();
  caseObjectPanelData: any;
  previousPanelData: any;
  currentStateModel: CaseObjectState;
  isPanelDataLoading: boolean;
  filterQueryString: string;
  viewQueryString: string;
  previousQuery: any;
  panelsSelected: string[];

  constructor(private readonly caseObjectListService: CaseObjectListService,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService) {
    this.caseObjectPanelData = [];
    this.previousPanelData = [];
  }

  ngOnInit(): void {
    this.filterUpdate$.subscribe((queries) => {
      const currentQuery = JSON.parse(JSON.stringify(queries));
      delete currentQuery.statePanelQuery;
      if (JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
        this.filterQueryString = currentQuery.filterQuery;
        this.viewQueryString = currentQuery.viewQuery;
        this.previousQuery = currentQuery;
        this.getPanelDetails();
      }
    });
  }

  getPanelDetails() {
    this.isPanelDataLoading = true;
    this.currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
    this.previousPanelData = JSON.parse(JSON.stringify(this.caseObjectPanelData));
    const selectedCardIndices = [];
    this.previousPanelData.forEach((item, index) => {
      if (item.checked) {
        selectedCardIndices.push(index);
      }
    });
    if (this.caseObjectType === 'ChangeRequest') {
      this.caseObjectListService.getCaseObjectStateCount(
        CaseObjectServicePath[this.caseObjectType],
        this.filterQueryString,
        this.viewQueryString).subscribe((res) => {
        if (res) {
          this.isPanelDataLoading = false;
          this.caseObjectPanelData = res;
          this.caseObjectPanelData.forEach(data => {
            data.tool_tip = 'Show ' + data.state_label + ' only';
          });
          selectedCardIndices.forEach(index => {
            this.caseObjectPanelData[index].checked = true;
          });
          this.setActivePanelsSelection();
        }
      });
    } else if (this.caseObjectType === 'ReleasePackage') {
      this.caseObjectListService.getCaseObjectStatusCount(
        CaseObjectServicePath[this.caseObjectType],
        this.filterQueryString,
        this.viewQueryString).subscribe((res) => {
        if (res) {
          this.isPanelDataLoading = false;
          this.caseObjectPanelData = res;
          this.caseObjectPanelData.forEach(data => {
            data.tool_tip = 'Show ' + data.status_label + ' only';
          });
          selectedCardIndices.forEach(index => {
            this.caseObjectPanelData[index].checked = true;
          });
          this.setActivePanelsSelection();
        }
      });
    }
  }

  setActivePanelsSelection() {
    const panelSelected = this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState;
    this.caseObjectPanelData.forEach((stateCard, index) => {
      let currentCaseObject = '';
      if (this.caseObjectType === 'ChangeRequest') {
        currentCaseObject = stateCard['state_label'];
        if (panelSelected && panelSelected.includes(currentCaseObject)) {
          stateCard['checked'] = true;
        }
      } else if (this.caseObjectType === 'ReleasePackage') {
        currentCaseObject = stateCard['status_label'];
        if (panelSelected && panelSelected.includes(currentCaseObject)) {
          stateCard['checked'] = true;
        }
      }
    });
  }

  panelClicked(cardDetails) {
    if (cardDetails.length) {
      this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState = this.caseObjectType === 'ChangeRequest' ? cardDetails.map(item => item.state_label) : cardDetails.map(item => item.status_label);
    } else {
      this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState = [];
    }
    this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject, this.userProfileUpdatedState$);
    this.statePanelSelected.emit(cardDetails);

  }
}
