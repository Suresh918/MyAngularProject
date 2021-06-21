import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {debounceTime, map} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';


import {UserProfileService} from '../../../core/services/user-profile.service';
import {CaseObjectFilterConfiguration, FilterOptions, McFiltersModel} from '../../models/mc-filters.model';
import {FilterBarService} from './filter-bar.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {MyChangeState} from 'app/shared/models/mc-store.model';
import {selectFilterUpdate} from 'app/store';
import {CaseObjectState} from '../../models/mc-states-model';
import {FilterService} from '../../../core/utilities/filter.service';
import {MetaDataConfiguration} from '../../models/mc-presentation.model';
import {FormControlConfiguration, FormControlEnumeration} from '../../models/mc-configuration.model';
import {UserType} from '../../models/mc.model';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

const DEFAULT_FILTER = 'currentDefaultFilter';
export type FilterCaseObjectType =
  'changeRequest'
  | 'changeNotice'
  | 'releasePackage'
  | 'agenda'
  | 'review'
  | 'reviewDetails'
  | 'reviewEntry'
  | 'action'
  | 'trackerBoard'
  | 'decisionLog'
  | 'myTeam'
  | 'myTeamManagement'
  | 'dashboardWidget'
  | 'dashboardActionWidget'
  | 'announcement'
  | 'notification'
  | 'readNotification'
  | 'unreadNotification'
  | 'dashboardNotificationWidget'
  | 'upcomingMeetingsWidget';

@Component({
  selector: 'mc-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  providers: [FilterBarService]
})
export class FilterBarComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  changeDetailsPanelHeader: string;
  @Input()
  caseObject: FilterCaseObjectType;
  @Input()
  secondaryCaseObjectType: string;
  @Input()
  isMyTeamHistory: boolean;
  @Input()
  caseObjectId: string;
  // To restrict saving user from userProfile.
  @Input()
  saveStateNotApplicable?: boolean;
  @Input()
  title: string;
  @Input()
  userActions: any[];
  @Input()
  requestForChange: boolean;
  @Input()
  caseObjectFiltersConfiguration: CaseObjectFilterConfiguration;
  @Input()
  caseObjectConfiguration: FormControlConfiguration;
  @Input()
  releasePackageSourceSystemID: string;
  @Input()
  caseObjectListCount: number;
  @Input()
  isFilterOutputObject: boolean;
  @Input()
  disabledLayerClicked: boolean;
  @Input()
  searchInProgress: boolean;
  @Input()
  hidePanel: boolean;
  @Input()
  selectedQuickFilter: string;
  @Input()
  executor: UserType;
  @Input()
  layoutType: string;
  @Input()
  myTeamID: string;
  @Input()
  filterOptionsChanged$: Subject<FilterOptions> = new Subject();
  @Output()
  readonly filterUpdated: EventEmitter<string | FilterOptions> = new EventEmitter();
  @Output()
  readonly trackerBoardFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly reviewFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly actionFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly dashBoardFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly announcementFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly notificationFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly myTeamFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly myTeamManagementFilterUpdated: EventEmitter<FilterOptions> = new EventEmitter();
  @Output()
  readonly agendaFilterUpdated: EventEmitter<any> = new EventEmitter();
  @Output()
  readonly changeActionView: EventEmitter<boolean> = new EventEmitter();
  @Output()
  readonly changeTrackerBoardView: EventEmitter<boolean> = new EventEmitter();
  @Output()
  readonly filterPanelView: EventEmitter<boolean> = new EventEmitter();
  @Output()
  readonly statePanelView: EventEmitter<boolean> = new EventEmitter();
  @Output()
  readonly removeQuickFilter: EventEmitter<void> = new EventEmitter<void>();

  filterStateModel: { [key: string]: FilterOptions };
  caseObjectCurrentFilterFormGroup: FormGroup;
  currentFilterChanged: boolean;
  groupChangeFilterFlag: boolean;
  caseObjectCurrentFilterFormGroup$: Subscription;
  panelOpened: boolean;
  totalFiltersCount = 0;
  previousFiltersQueryString = '';
  currentFiltersQueryString = '';
  statePanelOpen: boolean;
  filterPanelCancelled: boolean;
  filterApplied: boolean;
  triggerFilterChange: boolean;
  userProfileUpdatedState$: Subject<void> = new Subject();
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  filterHelp: Info;
  selectedNotificationTypes: FormControlEnumeration[];

  private $filterUpdateSubscriber;
  public filterState: McFiltersModel;


  get notificationTypes() {
    return this.selectedNotificationTypes;
  }

  @Input()
  set openFilterPanel(panel: boolean) {
    if (panel) {
      this.toggleFilterPanel();
    }
  }


  @Input()
  set notificationTypes(types: FormControlEnumeration[]) {
    if (this.caseObjectCurrentFilterFormGroup &&
      this.caseObjectCurrentFilterFormGroup.get('type')) {
      this.selectedNotificationTypes = types;
      this.caseObjectCurrentFilterFormGroup.get('type').setValue(types);
      this.triggerFilterChange = false;
    }
  }

  constructor(private readonly userProfileService: UserProfileService,
              private readonly filterPanelService: FilterBarService,
              private readonly appStore: Store<MyChangeState>,
              private readonly helpersService: HelpersService,
              private readonly filterService: FilterService,
              public readonly configurationService: ConfigurationService) {
    this.requestForChange = false;
    this.panelOpened = false;
    this.statePanelOpen = true;
    this.filterPanelCancelled = false;
    this.filterApplied = true;
  }

  ngOnInit() {
    this.triggerFilterChange = true;
    this.initializeFilters();
    this.setFilterConfiguration();
    this.subscribeToFilterSubscriptionChange();

    if (this.filterOptionsChanged$) {
      this.filterOptionsChanged$.subscribe((val) => {
        this.triggerFilterOptionChanged(val);
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.requestForChange && simpleChanges.requestForChange.currentValue) {
      this.initializeFilters();
    } else if (simpleChanges.disabledLayerClicked && simpleChanges.disabledLayerClicked.currentValue) {
      this.triggerPanelCancelled(true);
    }
  }

  subscribeToFilterSubscriptionChange() {
    this.$filterUpdateSubscriber = this.appStore.pipe(select(selectFilterUpdate)).subscribe((res: Boolean) => {
      if (res && res.valueOf()) {
        this.initializeFilters();
      }
    });
  }

  initializeFilters() {
    // To Reset caseObject state when saveStateNotApllicable is true.
    if (this.saveStateNotApplicable) {
      const caseObjectState = this.userProfileService.getStatesData();
      caseObjectState[this.userProfileService.getStateKeyByCaseObject(this.caseObject)].commonCaseObjectState.filters['filtersModel']['currentDefaultFilter'] = new FilterOptions({});
      this.userProfileService.updateState(caseObjectState);
    }
    this.initializeFilterGroupWithSavedState();
  }

  initializeFilterGroupWithSavedState() {
    this.getSavedFilterStateModel();
    this.initializeFilterFormGroup();
  }

  initializeFilterFormGroup() {
    const initialFilter = new FilterOptions(this.filterStateModel['currentDefaultFilter']);
    this.caseObjectCurrentFilterFormGroup = this.filterPanelService.createFilterPanelFormGroup(initialFilter);
    // unsubscribe the previous FormGroup before subscribing to another
    if (this.caseObjectCurrentFilterFormGroup$) {
      this.caseObjectCurrentFilterFormGroup$.unsubscribe();
    }
    this.subscribeToFilterChange();
    this.previousFiltersQueryString = JSON.stringify(initialFilter);
    this.getFilterCount();
    this.emitFilterChangeEvent(initialFilter);
  }

  subscribeToFilterChange() {
    this.caseObjectCurrentFilterFormGroup$ = this.caseObjectCurrentFilterFormGroup.valueChanges.pipe(debounceTime(1500), map((value) => {
      this.filterStateModel[DEFAULT_FILTER] = value;
      this.currentFiltersQueryString = JSON.stringify(new FilterOptions(value));
      this.getFilterCount();
      if (this.groupChangeFilterFlag) {
        this.groupChangeFilterFlag = false;
      } else {
        this.currentFilterChanged = !this.currentFilterChanged;
      }
      if (this.previousFiltersQueryString !== this.currentFiltersQueryString && this.triggerFilterChange) {
        this.filterState['filtersModel'] = this.filterStateModel;
        this.emitFilterChangeEvent(value);
      }
      // Update previous query string for comparision
      this.previousFiltersQueryString = JSON.stringify(new FilterOptions(value));
      this.triggerFilterChange = true;
    })).subscribe();
  }

  /* -----------------------------------------------   Filter Panel  ---------------------------------------------- */

  triggerFilterOptionChanged(filterOptions: FilterOptions) {
    if (!this.panelOpened) {
      this.filterApplied = true;
    }
    this.filterState['filtersModel']['currentDefaultFilter'] = new FilterOptions(filterOptions);
    if (!this.saveStateNotApplicable) {
      this.updateUserProfileService();
    }
    this.initializeFilterFormGroup();
    this.filterPanelView.emit(this.panelOpened);
  }

  triggerFilterAccept(filterOptions: FilterOptions) {
    this.panelOpened = false;
    this.filterApplied = true;
    this.filterPanelView.emit(this.panelOpened);
    this.triggerFilterOptionChanged(filterOptions);
  }

  triggerPanelCancelled(data: boolean) {
    if (data) {
      this.panelOpened = false;
      this.filterPanelCancelled = true;
      this.filterPanelView.emit(this.panelOpened);
      this.initializeFilterGroupWithSavedState();
    }
  }

  /* -----------------------------------------------   Filter Selection Panel  ---------------------------------------------- */

  selectedAllFiltersRemoved(event) {
    this.triggerFilterOptionChanged(event);
  }

  /* -----------------------------------------------   Quick Filter ---------------------------------------------- */
  quickFilterAdded(filterName: string) {
    this.filterStateModel[filterName] = Object.assign({}, this.caseObjectCurrentFilterFormGroup.value);
    this.filterState['filtersModel'] = this.filterStateModel;
    this.userProfileService.updateCaseObjectStateWithFiltersModel(this.filterState, this.caseObject);
  }

  quickFilterSelected(filterOption: FilterOptions) {
    this.filterStateModel[DEFAULT_FILTER] = filterOption as FilterOptions;
    this.groupChangeFilterFlag = true;
    if (this.caseObject === 'agenda') {
      if (filterOption && filterOption.meetingDate && filterOption.meetingDate.begin && filterOption.meetingDate.end) {
        this.agendaFilterUpdated.emit(['', filterOption.meetingDate.begin, filterOption.meetingDate.end]);
      }
      if (filterOption && filterOption.people.length > 0) {
        this.agendaFilterUpdated.emit([this.filterService.getFilterQueryForFilterOptions(filterOption, this.caseObject, this.caseObjectFiltersConfiguration)]);
      }
    } else if (this.caseObject === 'dashboardWidget') {
      this.dashBoardFilterUpdated.emit(filterOption);
    } else if (this.caseObject === 'trackerBoard') {
      this.trackerBoardFilterUpdated.emit(filterOption);
    } else if (this.caseObject === 'upcomingMeetingsWidget') {
      this.agendaFilterUpdated.emit(filterOption);
    } else if (this.caseObject === 'myTeamManagement') {
      this.myTeamManagementFilterUpdated.emit(filterOption);
    } else if (this.caseObject.toLowerCase().indexOf('notification') === -1 && this.caseObject.toLowerCase().indexOf('upcomingmeetings') === -1) {
      this.filterUpdated.emit(this.filterService.getFilterQueryForFilterOptions(this.filterStateModel[DEFAULT_FILTER], this.caseObject, this.caseObjectFiltersConfiguration));
    }

    this.filterState['filtersModel']['currentDefaultFilter'] = new FilterOptions(this.filterStateModel[DEFAULT_FILTER]);
    this.filterStateModel = this.filterState['filtersModel'];
    if (!this.saveStateNotApplicable) {
      this.updateUserProfileService();
    }
    this.initializeFilterFormGroup();
  }

  quickFilterRemoved(filterName: string) {
    delete this.filterStateModel[filterName];
    this.userProfileService.updateCaseObjectStateWithFiltersModel(this.filterState, this.caseObject);
  }

  quickFilterImported(filterObject: { filterName: string, filterOptions: FilterOptions, caseObject: string }) {
    const filterName = filterObject['filterName'];
    this.filterState['filtersModel'][filterName] = filterObject['filterOptions'];
    if (!this.saveStateNotApplicable) {
      this.updateUserProfileService();
    }
  }

  /* -------------------------------------------------------   Utility methods  ---------------------------------------------- */

  emitFilterChangeEvent(filterOptions) {
    if (this.caseObject === 'agenda') {
      const caseObject = 'agenda';
      this.agendaFilterUpdated.emit([this.filterService.getFilterQueryForFilterOptions(filterOptions, caseObject, this.caseObjectFiltersConfiguration)]);
    } else if (this.caseObject === 'upcomingMeetingsWidget') {
      this.agendaFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'dashboardWidget' || this.caseObject === 'dashboardActionWidget') {
      this.dashBoardFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'changeRequest') {
      this.filterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'releasePackage') {
      this.filterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'announcement') {
      this.announcementFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'unreadNotification' || this.caseObject === 'readNotification' || this.caseObject === 'dashboardNotificationWidget') {
      this.notificationFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'myTeam') {
      this.myTeamFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'action') {
      this.actionFilterUpdated.emit(filterOptions);
    } else if (this.caseObject === 'myTeamManagement') {
      if (this.caseObjectCurrentFilterFormGroup.valid) {
        this.myTeamManagementFilterUpdated.emit(filterOptions);
      }
    } else if (this.caseObject === 'trackerBoard' && this.filterApplied) {
      this.trackerBoardFilterUpdated.emit(filterOptions);
      this.filterApplied = false;
    } else if (this.caseObject === 'review' || this.caseObject === 'reviewEntry') {
      this.reviewFilterUpdated.emit(filterOptions);
    } else {
      if (this.filterState['filtersModel']['currentDefaultFilter'].fromCaseObject !== '') {
        this.filterUpdated.emit(
          this.filterService.getFilterQueryForFilterOptions(
            filterOptions, this.caseObject, this.caseObjectFiltersConfiguration,
            this.filterState['filtersModel']['currentDefaultFilter'].fromCaseObject)
        );
      } else {
        this.filterUpdated.emit(this.filterService.getFilterQueryForFilterOptions(filterOptions, this.caseObject, this.caseObjectFiltersConfiguration));
      }
    }
  }

  updateUserProfileService() {
    // Update local state before making call (To reflect state back instantly)
    const savedStates = this.userProfileService.getStatesData();
    savedStates[this.userProfileService.getStateKeyByCaseObject(this.caseObject)].commonCaseObjectState.filters = this.filterState;
    this.userProfileService.updateState(savedStates);
    this.userProfileService.updateCaseObjectStateWithFiltersModel(this.filterState, this.caseObject);
  }

  getSavedFilterStateModel() {
    if (this.saveStateNotApplicable && this.filterState) {
      this.filterStateModel = this.filterState['filtersModel'];
    } else {
      const caseObjectState = this.userProfileService.getCaseObjectState(this.caseObject) as CaseObjectState;
      this.filterState = (caseObjectState && caseObjectState['commonCaseObjectState']) ? new McFiltersModel(caseObjectState['commonCaseObjectState'].filters) : null;
      this.filterStateModel = this.filterState && this.filterState['filtersModel'];
    }
    if (!this.filterState) {
      this.filterState = {};
      this.filterStateModel = {'currentDefaultFilter': new FilterOptions({})};
      this.filterState['filtersModel'] = this.filterStateModel;
    }
  }

  getFilterCount(): void {
    this.totalFiltersCount = 0;
    const currentFilterOptions = this.caseObjectCurrentFilterFormGroup.getRawValue() as FilterOptions;
    for (let [filterKey, filterValue] of Object.entries(currentFilterOptions)) {
      if (Array.isArray(filterValue) && filterKey !== 'people' && filterKey !== 'actionDisplayStatus' && filterKey !== 'status') {
        this.totalFiltersCount += filterValue.length;
      } else if (filterValue && (filterKey === 'linkedChangeObject' || filterKey === 'agendaCategory')) {
        this.totalFiltersCount += 1;
      } else if (filterKey === 'people') {
        // when multi user search
        if (filterValue.length === 1 && filterValue[0].users && filterValue[0].users.length > 0) {
          this.totalFiltersCount += filterValue[0].users.length;
        } else {
          filterValue = filterValue.filter(people => people.user && people.user.userID !== '' && people.role && people.role.name !== '');
          this.totalFiltersCount += filterValue.length;
        }
      } else if (filterKey === 'status' && this.caseObject !== 'review' && this.caseObject !== 'reviewEntry') {
        this.totalFiltersCount += filterValue.length;
      } else {
        // TODO: (Temp Fix) This condition has to be removed once we fix date picker issue
        if (filterValue && (new Date(filterValue).getFullYear() !== 1970) && filterKey !== 'actionDisplayStatus'
          && this.caseObject !== 'readNotification' && filterKey !== 'createdOn' && filterKey !== 'status') {
          this.totalFiltersCount += 1;
        }
      }
    }
  }

  /* -------------------------------------------------------   Events  ---------------------------------------------- */

  triggerKeywordAddedByUser(keyword: string): void {
    this.caseObjectCurrentFilterFormGroup.markAsDirty();
    this.caseObjectCurrentFilterFormGroup.get('keywords').setValue([keyword]);
    this.filterState.filtersModel['currentDefaultFilter'] = this.caseObjectCurrentFilterFormGroup.getRawValue();
    // Set saveStateNotApplicable in myTeam and remove the bottom condition
    if (!this.saveStateNotApplicable) {
      this.updateUserProfileService();
    }
  }

  toggleFilterPanel(): void {
    this.panelOpened = !this.panelOpened;
    this.filterPanelCancelled = true;
    this.filterPanelView.emit(this.panelOpened);
    this.initializeFilterGroupWithSavedState();
  }

  toggleStatePanel() {
    this.statePanelOpen = !this.statePanelOpen;
    this.statePanelView.emit(this.statePanelOpen);
  }

  setFilterConfiguration(): void {
    this.filterFormConfiguration =
      this.configurationService.getFormFilterParameters(
        this.helpersService.getCaseObjectForms(this.caseObject).caseObject);
    if (this.helpersService.getCaseObjectForms(this.caseObject)) {
      const caseObjectFormConfiguration =
        this.configurationService.getFormFieldParameters(
          this.helpersService.getCaseObjectForms(this.caseObject).caseObject) as { [key: string]: MetaDataConfiguration };
      if (caseObjectFormConfiguration) {
        Object.keys(this.filterFormConfiguration).forEach(key => {
          if (key === 'status' && this.caseObject !== 'action' &&
            caseObjectFormConfiguration['generalInformation'] && caseObjectFormConfiguration['generalInformation'][key]) {
            this.filterFormConfiguration[key]['options'] = caseObjectFormConfiguration['generalInformation'][key]['options'];
          }
          if (key === 'type' && caseObjectFormConfiguration[key]) {
            this.filterFormConfiguration[key]['options'] = caseObjectFormConfiguration[key]['options'];
          }
          if (key === 'customerImpact' && caseObjectFormConfiguration['impactAnalysis'] && caseObjectFormConfiguration['impactAnalysis']['customerImpactAnalysis']) {
            this.filterFormConfiguration[key]['options'] = caseObjectFormConfiguration['impactAnalysis']['customerImpactAnalysis'][key]['options'];
          }
          if (caseObjectFormConfiguration[key] && caseObjectFormConfiguration[key]['options']) {
            this.filterFormConfiguration[key]['options'] = caseObjectFormConfiguration[key]['options'];
          }
        });
      }
    }
    if (this.filterFormConfiguration && this.filterFormConfiguration.help && this.filterFormConfiguration.help.help) {
      this.filterHelp = new Info('', this.filterFormConfiguration.help.help, '', '');
    }
  }

  onRemoveQuickFilter() {
    this.removeQuickFilter.emit();
  }

  ngOnDestroy() {
    if (this.caseObjectCurrentFilterFormGroup$) {
      this.caseObjectCurrentFilterFormGroup$.unsubscribe();
    }
  }

}
