import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {CaseObjectFilterConfiguration, FilterOptions} from '../../models/mc-filters.model';
import {
  McSortingConfiguration,
  McSortingConfigurationService
} from '../../../core/utilities/mc-sorting-configuration.service';
import {CaseObjectOverview} from '../case-object-list/case-object-list.model';
import {CaseObjectState} from '../../models/mc-states-model';
import {McFiltersConfigurationService} from '../../../core/utilities/mc-filters-configuration.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {
  CaseObjectFilter,
  CaseObjectFilterTitle,
  CaseObjectLabel,
  CaseObjectRouterPath,
  CaseObjectServicePath
} from '../case-object-list/case-object.enum';
import {ChangeRequestFormConfiguration} from '../../models/mc-configuration.model';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {FilterService} from '../../../core/utilities/filter.service';
import {Store} from '@ngrx/store';
import {SidePanelState} from '../../models/mc-store.model';
import {setRightSideNavBar} from '../../../side-panel/store';

@Component({
  selector: 'mc-case-object-overview',
  templateUrl: './case-object-overview.component.html',
  styleUrls: ['./case-object-overview.component.scss'],
  providers: [ChangeRequestService]
})
export class MCCaseObjectOverviewComponent implements OnInit, AfterViewInit {
  @Input()
  caseObjectType: string;
  @Input()
  showActionsCount: boolean;
  @Input()
  displayedColumns: string[];
  @ViewChild('scrollingWrapper') listContainer;
  scrollUpdate: Subject<void> = new Subject<void>();
  currentFilter$: BehaviorSubject<any> = new BehaviorSubject({});
  previousFilter$: BehaviorSubject<any> = new BehaviorSubject({});
  /* filter variables and methods*/
  filterQuery: string;
  viewQuery: string;
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
  /*variables for list view */
  showTableView = false;
  listStartIndex: number;
  lastUpdatedStartindex: number;
  listSize: number;
  defaultListSize: number;
  totalItems: number;
  public _pageScrolled: boolean;
  sortChanged: boolean;
  progressBar = false;
  caseObjectConfiguration: any;
  has_next: boolean;
  previousFilterQuery: string;
  previousViewQuery: string;

  constructor(private readonly mcFiltersConfigurationService: McFiltersConfigurationService,
              private readonly mcSortingConfigurationService: McSortingConfigurationService,
              private readonly caseObjectListService: CaseObjectListService,
              private readonly serviceParametersService: ServiceParametersService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly configurationService: ConfigurationService,
              private readonly filterService: FilterService,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly userProfileService: UserProfileService, private readonly helpersService: HelpersService) {
    this.listStartIndex = 0;
    this.defaultListSize = 8;
    this.listSize = this.listSize || this.defaultListSize;
  }

  onScroll(event) {
    if (event.target.scrollTop === 0) {
      this.expandStatePanel = true;
    } else {
      this.expandStatePanel = false;
    }
  }

  onScrollDown() {
    if (this.listContainer.nativeElement && this.has_next && !this._pageScrolled) {
      this.listSize = Math.ceil(this.listContainer.nativeElement.offsetHeight / 90);
      this.listSize = this.listSize < this.defaultListSize ? this.defaultListSize : this.listSize;
      this._pageScrolled = true;
      this.getOverviewData(false, true);
    }
  }

  ngAfterViewInit(): void {
    this.listSize = Math.ceil(this.listContainer.nativeElement.offsetHeight / 90);
    this.listSize = this.listSize < this.defaultListSize ? this.defaultListSize : this.listSize;
    this.getOverviewData(false, true);
  }

  ngOnInit() {
    this.filterQuery = '';
    this.statePanelFilterQuery = '';
    this.expandStatePanel = true;
    this.toggleStatePanel = true;
    this.has_next = false;
    this.disabledLayerClicked = false;
    this.filterTitle = CaseObjectFilterTitle[this.caseObjectType];
    this.filterCaseObject = CaseObjectFilter[this.caseObjectType];
    this.caseObjectLabel = CaseObjectLabel[this.caseObjectType];
    this.caseObjectRouterPath = CaseObjectRouterPath[this.caseObjectType];
    this.caseObjectFilterConfiguration = this.mcFiltersConfigurationService.getCaseObjectFiltersConfiguration(this.filterCaseObject);
    this.sortingConfiguration = this.mcSortingConfigurationService.getCaseObjectSortingConfiguration(this.filterCaseObject);
    // Removing action date from sort options as it is not supported currently
    this.sortingConfiguration.sortingHeaders = this.sortingConfiguration.sortingHeaders.filter(item => item.id !== 'openActionsCount' && item.id !== 'action.deadline');
    this.caseObjectConfiguration = this.configurationService.getFormFieldParameters(
      this.helpersService.getCaseObjectForms(this.caseObjectType).caseObject) as ChangeRequestFormConfiguration;
    this.setSortingState();
    this.setPanelState();
  }

  getOverviewData(viewChanged: boolean, resultsOnly?: boolean) {
    // This method is only triggered when there is a change in th filter from case-object-analytics panel component or when scrolling
    if (!this.showTableView) {
      const viewQuery = this.viewQuery + ((this.viewQuery !== '' && this.statePanelFilterQuery !== '') ? ' and ' : '') + this.statePanelFilterQuery;
      if (this.previousFilter$.value.filterQuery !== this.filterQuery || this.previousFilter$.value.viewQuery !== this.viewQuery || this.previousFilter$.value.statePanelQuery !== this.statePanelFilterQuery || viewChanged || this._pageScrolled || this.sortChanged) {
        this.progressBar = true;
        this.lastUpdatedStartindex = this.listStartIndex;
        this.caseObjectListService.getOverviewSummary$(
          CaseObjectServicePath[this.caseObjectType],
          this.listStartIndex,
          this._pageScrolled ? this.defaultListSize : this.listSize,
          this.filterQuery,
          viewQuery,
          this.getSortingQuery()
        ).subscribe((res) => {
          this.progressBar = false;
          this.has_next = res['has_next'];
          this.previousFilter$.next({
            'filterQuery': this.filterQuery,
            'viewQuery': this.viewQuery,
            'statePanelQuery': this.statePanelFilterQuery
          });
          this.caseObjectList = (this._pageScrolled) ? this.caseObjectList.concat(res.results) : res.results;
          this.listStartIndex = (this._pageScrolled ? 1 : 0) + (this.listStartIndex === 0 ? 1 : this.listStartIndex);
          this._pageScrolled = false;
          this.sortChanged = false;
        });
        if (!resultsOnly) {
          this.caseObjectListService.getOverviewCount(CaseObjectServicePath[this.caseObjectType],
            this.filterQuery,
            viewQuery,
            this.getSortingQuery()).subscribe(res => {
            this.totalItems = res.total_elements;
          });
        }
      }
    }
  }

  setSortingState(): void {
    this.overviewListActiveSort = this.userProfileService.getCaseObjectSortFromState(this.filterCaseObject, true);
    this.listSortConfiguration = this.userProfileService.getCaseObjectSortFromState(this.filterCaseObject);
  }


  triggerFilterChanges(filterOptions: FilterOptions) {
    this.filterQuery = this.filterService.getFilterQueryForFilterOptions(filterOptions, this.caseObjectType, this.caseObjectFilterConfiguration);
    this.viewQuery = this.filterService.getFilterQueryForFilterOptions(filterOptions, this.caseObjectType, this.caseObjectFilterConfiguration, undefined, 'view_dql');
    if ((this.previousFilter$.value.filterQuery !== this.filterQuery || this.previousFilter$.value.viewQuery !== this.viewQuery)) {
      this.listStartIndex = 0;
      this.currentFilter$.next({
        'filterQuery': this.filterQuery,
        'viewQuery': this.viewQuery,
        'statePanelQuery': this.statePanelFilterQuery
      });
      this.getOverviewData(false);
    }
  }

  triggerTableSortConfiguration(sort: Sort) {
    this.updateSortingState(sort, false);
    this.listStartIndex = 0;
    this.getOverviewData(false, true);
  }

  triggerOverviewListSortChange(sort: Sort) {
    this.overviewListActiveSort = sort;
    this.updateSortingState(sort, true);
    this.sortChanged = true;
    this.listStartIndex = 0;
    this.getOverviewData(false, true);
  }

  toggleView(isTableView: boolean) {
    if (this.showTableView !== isTableView) {
      this.currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
      this.currentStateModel['commonCaseObjectState'].stateConfiguration.listView = !isTableView;
      this.userProfileService.updateCaseObjectState(this.currentStateModel, this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject);
      this.showTableView = isTableView;
      if (!this.showTableView) {
        this.sidePanelStore.dispatch(setRightSideNavBar(false, ''));
      }
      this.resetView();
      this.getOverviewData(true);
    }
  }

  resetView() {
    if (this.showTableView) {
      this.currentFilter$.next({
        'filterQuery': this.filterQuery,
        'viewQuery': this.viewQuery,
        'statePanelQuery': this.statePanelFilterQuery
      });
    }
    this.caseObjectList = [];
    this.listStartIndex = 0;
    this.defaultListSize = 8;
    this.listSize = this.listSize || this.defaultListSize;
  }

  statePanelSelectAction(data: any) {
    this.previousFilter$.next({...this.previousFilter$.value, 'statePanelQuery': this.statePanelFilterQuery});
    this.statePanelFilterQuery = '';
    if (data && data.length > 0 && this.caseObjectType === 'ChangeRequest') {
      const statuses = [];
      data.forEach(eventData => {
        statuses.push(this.helpersService.getCRStatusByStateLabel(eventData.state));
      });
      const filterConfiguration =
        this.configurationService.getFormFilterParameters(
          this.helpersService.getCaseObjectForms(this.caseObjectType).caseObject
        );
      this.statePanelFilterQuery =
        filterConfiguration['state']['view_dql']
          .split('$filter-value-placeholder').join(statuses.join(','));
      this.resetObsoletedCount();
    } else if (data && data.length > 0 && this.caseObjectType === 'ReleasePackage') {
      const statuses = [];
      data.forEach(eventData => {
        statuses.push(eventData.status);
      });
      const filterConfiguration =
        this.configurationService.getFormFilterParameters(
          this.helpersService.getCaseObjectForms(this.caseObjectType).caseObject
        );
      this.statePanelFilterQuery =
        filterConfiguration['status']['view_dql']
          .split('$filter-value-placeholder').join(statuses.join(','));
    } else if (data && data.length < 1 && this.caseObjectType === 'ChangeRequest') {
      this.getObsoletedCount();
    }
    this.resetView();
    if (this.showTableView) {
      this.currentFilter$.next({
        'filterQuery': this.filterQuery,
        'viewQuery': this.viewQuery,
        'statePanelQuery': this.statePanelFilterQuery
      });
    }
    this.getOverviewData(true);
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


  setSearchProgress(event) {
    this.searchInProgress = event;
  }

  getSortingQuery(): string {
    let sort = '';
    if (this.overviewListActiveSort && this.overviewListActiveSort.active && this.overviewListActiveSort.direction) {
      switch (this.overviewListActiveSort.active) {
        // Commented cases are not supported by MIRAI currently as of 10.12.2020
        /*case 'action.deadline':
          sort = ' action.deadline ' + this.overviewListActiveSort.direction;
          break;*/
        case 'priority':
          if (this.caseObjectType === 'ChangeRequest') {
            sort = 'analysis_priority,' + this.overviewListActiveSort.direction;
          } else {
            sort = 'implementation_priority,' + this.overviewListActiveSort.direction;
          }
          break;
        case 'createdOn':
          sort = 'created_on,' + this.overviewListActiveSort.direction;
          break;
        case 'status':
          sort = 'status,' + this.overviewListActiveSort.direction;
          break;
        case 'plannedReleaseDate':
          sort = 'planned_release_date,' + this.overviewListActiveSort.direction;
          break;
        case 'plannedEffectiveDate':
          sort = 'planned_effective_date,' + this.overviewListActiveSort.direction;
          break;
        /*case 'openActionsCount':
          sort = 'openActionsCount ' + this.overviewListActiveSort.direction;
          break;*/
        default:
          break;
      }
    }
    return sort;
  }

  getObsoletedCount() {
    let totalHelpText = this.configurationService.getFormFieldParameters(this.caseObjectType + '2.0', 'total_items').help.message;
    let obsoletedCount = 0;
    this.changeRequestService.getCRObsoletedObjectCount().subscribe(res => {
      if (res) {
        obsoletedCount = res['count'];
        totalHelpText = totalHelpText.split('$OBSOLETE-COUNT').join(obsoletedCount.toString());
        this.totalCountHelp = new Info('', totalHelpText, '', '', null);
      }
    });
    this.totalCountHelp = new Info('', totalHelpText, '', '', null);
  }

  resetObsoletedCount() {
    let totalHelpText = this.configurationService.getFormFieldParameters(this.caseObjectType + '2.0', 'total_items').help.message;
    const obsoletedCount = 0;
    totalHelpText = totalHelpText.split('$OBSOLETE-COUNT').join(obsoletedCount.toString());
    this.totalCountHelp = new Info('', totalHelpText, '', '', null);
  }

  setPanelState() {
    this.currentStateModel = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject) as CaseObjectState;
    const panelSelected = this.currentStateModel['commonCaseObjectState'].stateConfiguration.panelState;
    let statusList = '';
    if (panelSelected && Array.isArray(panelSelected) && panelSelected.length > 0) {
      panelSelected.forEach(status => {
        statusList = statusList + (this.caseObjectType === 'ChangeRequest' ?
          this.helpersService.getCRStatusByStateLabel(status) : this.helpersService.getRPStatusByStateLabel(status)) + ',';
      });
      const filterConfiguration =
        this.configurationService.getFormFilterParameters(
          this.helpersService.getCaseObjectForms(this.caseObjectType).caseObject
        );
      if (statusList !== '') {
        this.statePanelFilterQuery = this.caseObjectType === 'ChangeRequest' ?
          filterConfiguration['state']['view_dql'].split('$filter-value-placeholder').join(statusList.slice(0, -1)) :
          filterConfiguration['status']['view_dql'].split('$filter-value-placeholder').join(statusList.slice(0, -1));
      }
    }
  }

}
