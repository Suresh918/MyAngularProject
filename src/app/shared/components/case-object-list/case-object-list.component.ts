import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {Subject} from 'rxjs';

import {CaseObjectOverview} from './case-object-list.model';
import {McSortingConfiguration, McSortingConfigurationService} from '../../../core/utilities/mc-sorting-configuration.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {CaseObjectFilter, CaseObjectFilterTitle, CaseObjectLabel, CaseObjectRouterPath} from './case-object.enum';
import {CaseObjectState} from '../../models/mc-states-model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseObjectFilterConfiguration} from '../../models/mc-filters.model';
import {McFiltersConfigurationService} from '../../../core/utilities/mc-filters-configuration.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';


@Component({
  selector: 'mc-case-object-list',
  templateUrl: './case-object-list.component.html',
  styleUrls: ['./case-object-list.component.scss']
})
export class MCCaseObjectListComponent implements OnInit {
  @Input()
  caseObjectType: string;
  @Input()
  showActionsCount: boolean;
  @Input()
  displayedColumns: string[];
  @ViewChild('scrollingWrapper') listContainer;
  scrollUpdate: Subject<void> = new Subject<void>();
  /* filter variables and methods*/
  filterQuery$: string;
  listSortConfiguration: Sort;
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  filterTitle: string;
  filterCaseObject: string;
  caseObjectRouterPath: string;
  caseObjectLabel: string;
  sortingConfiguration: McSortingConfiguration;
  overviewListActiveSort: Sort;
  caseObjectList: CaseObjectOverview[];
  totalItemCount: number;
  expandStatePanel: boolean;
  toggleStatePanel: boolean;
  showFilterPanel = false;
  disabledLayerClicked: boolean;
  statePanelFilterQuery: string;
  filterQueryString: string;
  currentStateModel: CaseObjectState;
  searchInProgress: boolean;
  totalCountHelp: Info;
  isProgressStatusList: boolean;
  /*variables for list view */
  showTableView = false;
  totalStates: number;

  constructor(private readonly mcFiltersConfigurationService: McFiltersConfigurationService,
              private readonly mcSortingConfigurationService: McSortingConfigurationService,
              private readonly caseObjectListService: CaseObjectListService,
              private readonly serviceParametersService: ServiceParametersService,
              private readonly configurationService: ConfigurationService,
              private readonly userProfileService: UserProfileService, private readonly helpersService: HelpersService) {
  }

  onScroll(event) {
    if (event.target.scrollTop === 0) {
      this.expandStatePanel = true;
    } else {
      this.expandStatePanel = false;
    }
  }

  onScrollDown() {
    this.scrollUpdate.next();
  }

  ngOnInit() {
    this.statePanelFilterQuery = '';
    this.expandStatePanel = true;
    this.toggleStatePanel = true;
    this.disabledLayerClicked = false;
    this.filterTitle = CaseObjectFilterTitle[this.caseObjectType];
    this.filterCaseObject = CaseObjectFilter[this.caseObjectType];
    this.caseObjectLabel = CaseObjectLabel[this.caseObjectType];
    this.caseObjectRouterPath = CaseObjectRouterPath[this.caseObjectType];
    this.caseObjectFilterConfiguration = this.mcFiltersConfigurationService.getCaseObjectFiltersConfiguration(this.filterCaseObject);
    this.sortingConfiguration = this.mcSortingConfigurationService.getCaseObjectSortingConfiguration(this.filterCaseObject);
    this.setSortingState();
    this.checkForListState();
    this.getNumberOfStates();
    this.isProgressStatusList = true;
  }

  triggerFilterChanges(filterQuery: string) {
    this.filterQueryString = filterQuery;
    // this.filterQuery$ = filterQuery + ((this.filterQueryString !== '' &&  this.statePanelFilterQuery !== '') ? ' and ' : '') + this.statePanelFilterQuery;
  }

  triggerListSortConfiguration(sort: Sort) {
    this.updateSortingState(sort, false);
  }

  toggleListView(isTableView: boolean) {
    this.currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
    this.currentStateModel['commonCaseObjectState'].stateConfiguration.listView = !isTableView;
    this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
    this.showTableView = isTableView;
  }

  triggerOverviewListSortChange(sort: Sort) {
    this.overviewListActiveSort = sort;
    this.updateSortingState(sort, true);
  }

  updateTotalCounter(event: any) {
    this.totalItemCount = event;
  }

  statePanelSelectAction(data: any) {
    this.statePanelFilterQuery = '';
    if (data.state !== '' || (data.state.length && data.state.length > 0)) {
      if (data.caseObjectType === 'release-packages') {
        this.statePanelFilterQuery = 'generalInformation.status in ("' + data.state + '")';
      } else if (data.caseObjectType === 'change-notices') {
        let query = '';
        data.state.forEach(item => {
          query += item ? '"' + item + '",' : '';
        });
        const formattedQuery = query.slice(0, -1);
        this.statePanelFilterQuery = formattedQuery ? 'generalInformation.state in (' + formattedQuery + ')' : '';
      } else {
        this.statePanelFilterQuery = 'generalInformation.state in ("' + data.state + '")';
      }
    }
    this.filterQuery$ = this.filterQueryString + ((this.filterQueryString !== '' && this.statePanelFilterQuery !== '') ? ' and ' : '') + this.statePanelFilterQuery;
  }

  setSortingState(): void {
    this.overviewListActiveSort = this.userProfileService.getCaseObjectSortFromState(this.filterCaseObject, true);
    this.listSortConfiguration = this.userProfileService.getCaseObjectSortFromState(this.filterCaseObject);
  }

  updateSortingState(sort: Sort, isOverviewType: boolean): void {
    this.userProfileService.updateCaseObjectSortInState(sort, this.filterCaseObject, isOverviewType);
  }

  filterPanelView(event) {
    this.showFilterPanel = event;
  }

  statePanelView(event) {
    this.toggleStatePanel = event;
  }

  hideFilterPanelEvent() {
    this.disabledLayerClicked = true;
  }

  checkForListState() {
    const currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
    this.showTableView = !currentStateModel['commonCaseObjectState'].stateConfiguration['listView'];
  }

  setSearchProgress(event) {
    this.searchInProgress = event;
  }

  showObsoletedCardsCount(event) {
    if (this.configurationService.getFormFieldParameters(this.caseObjectType, 'totalItems') &&
      this.configurationService.getFormFieldParameters(this.caseObjectType, 'totalItems').help) {
      let totalHelpText = this.configurationService.getFormFieldParameters(this.caseObjectType, 'totalItems').help.message;
      totalHelpText = totalHelpText.split('$OBSOLETE-COUNT').join(event);
      this.totalCountHelp = new Info('', totalHelpText, '', '', null);
    }
  }

  onIsSetStateCardList($event) {
    this.isProgressStatusList = $event;
  }

  getNumberOfStates() {
    switch (this.caseObjectType) {
      case 'ChangeRequest': {
        this.totalStates = 5;
        break;
      }
      case 'ChangeNotice': {
        this.totalStates = 4;
        break;
        break;
      }
      case 'ReleasePackage': {
        this.totalStates = 6;
        break;
        break;
      }
    }
  }
}
