import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FilterOptions, MCDatePickerRangeValue, People} from 'app/shared/models/mc-filters.model';
import {MatChipList} from '@angular/material/chips';
import {filterOptionsTooltip} from 'app/shared/models/mc-enums';
import {FormControlConfiguration} from '../../../models/mc-configuration.model';

export interface ChipModel {
  toolTip: string;
  value: any;
  filterKey: string;
  filterOption: any;
  isDate: boolean;
}

@Component({
  selector: 'mc-filter-panel-selected-options-container',
  templateUrl: './filter-bar-selected-options-container.component.html',
  styleUrls: ['./filter-bar-selected-options-container.component.scss']
})
export class FilterBarSelectedOptionsContainerComponent implements OnInit, OnChanges {
  @Input()
  caseObject: string;
  @Input()
  fromFilterPanel: boolean;
  @Input()
  currentFilterOptions: FilterOptions;
  @Input()
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  @Output() readonly selectedFilterRemoved: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @Output() readonly selectedAllFiltersRemoved: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @ViewChild(MatChipList) chipContainer: any;

  reviewItemsList: any[];
  chipIndex = 0;
  filterKeyList: string[] = [];
  chipListValues: ChipModel[] = [];
  totalChipList: ChipModel[] = [];
  menuChipListValues: ChipModel[] = [];
  showFilterContainer = true;

  constructor() {
  }

  ngOnInit() {
    this.reviewItemsList = [];
    this.filterKeyList = this.objectKeys(this.currentFilterOptions);
    this.showFilterContainer = this.hasFilterOptions();
    if (this.showFilterContainer) {
      this.createFilterOptionArray();
      this.totalChipList = [...this.chipListValues];
      this.showFilterContainer = this.showFilterContainer && !(this.caseObject === 'readNotification' && this.totalChipList.length === 1 && this.totalChipList[0].isDate);
    }
  }

  /*  ngAfterViewChecked() {
      if (this.chipContainer && this.chipContainer['_elementRef']) {
        this.calculateChipIndex();
      }
    }*/

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentFilterOptions && changes.currentFilterOptions.currentValue) {
      this.filterKeyList = this.objectKeys(changes.currentFilterOptions.currentValue);
      this.showFilterContainer = this.hasFilterOptions();
      if (this.showFilterContainer) {
        this.createFilterOptionArray();
        this.totalChipList = [...this.chipListValues];
        this.showFilterContainer = this.showFilterContainer && !(this.caseObject === 'readNotification' && this.totalChipList.length === 1 && this.totalChipList[0].isDate);
      }
    }
  }

  createFilterOptionArray() {
    this.chipListValues = [];
    for (const [key, filterValue] of Object.entries(this.currentFilterOptions)) {
      switch (key) {
        case 'state':
        case 'status':
        case 'implementationPriority':
        case 'analysisPriority':
        case 'actionType':
        case 'type':
        case 'classification':
        case 'purpose':
        case 'role':
        case 'priority':
        case 'isActive':
        case 'tags':
        case 'review_tasks_status':
        case 'actionStatus': {
          if ((key === 'type' || key === 'status') && (this.caseObject === 'unreadNotification'
            || this.caseObject === 'readNotification' || this.caseObject === 'reviewEntry' || this.caseObject === 'review')) {
            break;
          }
          if (filterValue && filterValue.length > 0) {
            if (typeof filterValue === 'string') {
              this.chipListValues.push({
                'toolTip': filterOptionsTooltip[key],
                'value': filterValue,
                'filterKey': key,
                'filterOption': filterValue,
                'isDate': false
              });
            } else {
              filterValue.forEach(value => {
                this.chipListValues.push({
                  'toolTip': filterOptionsTooltip[key],
                  'value': (value.label === '-2' || value.label === -2) ? 'NA' : value.label,
                  'filterKey': key,
                  'filterOption': value,
                  'isDate': false
                });
              });
            }
          }
          break;
        }
        case 'customerImpact':
        case 'id': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach(value => {
              this.chipListValues.push({
                'toolTip': filterOptionsTooltip[key],
                'value': value,
                'filterKey': key,
                'filterOption': value,
                'isDate': false
              });
            });
          }
          break;
        }
        case 'linkedChangeObject':
        case 'solutionItem':
        case 'linkedItems': {
          if (filterValue && filterValue.length > 0) {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': this.getFilterValueLabel(key, filterValue),
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        case 'plannedReleaseDate':
        case 'plannedEffectiveDate':
        case 'dueDate':
        case 'meetingDate':
        case 'activeDate':
        case 'effectiveEndDate':
        case 'createdOn': {
          if (filterValue && filterValue.begin && filterValue.end) {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue,
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': true
            });
          }
          break;
        }
        case 'reviewItems':
        case 'group': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach(value => {
              this.chipListValues.push({
                'toolTip': filterOptionsTooltip[key],
                'value': value.name || value.group_id,
                'filterKey': key,
                'filterOption': value,
                'isDate': false
              });
            });
          }
          break;
        }
        case 'PCCSTRAIMIDs':
        case 'PBSIDs': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach(value => {
              this.chipListValues.push({
                'toolTip': filterOptionsTooltip[key],
                'value': key === 'PCCSTRAIMIDs' ? value.number : value.ID,
                'filterKey': key,
                'filterOption': value,
                'isDate': false
              });
            });
          }
          break;
        }
        case 'productID':
        case 'projectID': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach(value => {
              this.chipListValues.push({
                'toolTip': filterOptionsTooltip[key],
                'value': key === 'productID' ? `${value.projectDefinition} - ${value.description}` :
                  `${value.wbsElement} - ${value.description}`,
                'filterKey': key,
                'filterOption': value,
                'isDate': false
              });
            });
          }
          break;
        }
        case 'people': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach((value: People) => {
              if (value && value.user && value.user.userID && value.role && value.role.value) {
                this.chipListValues.push({
                  'toolTip': value.role.label,
                  'value': `${value.user.fullName} (${value.user.abbreviation})`,
                  'filterKey': key,
                  'filterOption': value,
                  'isDate': false
                });
              }
              if (value && value.users) {
                this.chipListValues = this.chipListValues.concat(value.users.map(user => {
                  return {
                    'toolTip': value.role.label,
                    'value': `${user.fullName} (${user.abbreviation})`,
                    'filterKey': key,
                    'filterOption': value,
                    'isDate': false
                  };
                }));
              }
            });
          }
          break;
        }
        case 'actionDates': {
          if (filterValue && filterValue.length > 0) {
            filterValue.forEach((value: MCDatePickerRangeValue) => {
              if (value && value.begin && value.end) {
                this.chipListValues.push({
                  'toolTip': filterOptionsTooltip[key],
                  'value': value,
                  'filterKey': key,
                  'filterOption': value,
                  'isDate': true
                });
              }
            });
          }
          break;
        }
        case 'keywords':
        case 'decision': {
          if (filterValue.length) {
            this.chipListValues.splice(0, 0, {
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue,
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        case 'agendaCategory': {
          if (filterValue && Object.keys(filterValue).length > 0) {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue,
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        case 'changeObject': {
          if (filterValue && Object.keys(filterValue).length > 0) {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue.slice(0, 1).toUpperCase() + filterValue.slice(1, filterValue.length),
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        case 'myTeamAction': {
          if (typeof filterValue === 'string') {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue.slice(0, 1) + filterValue.slice(1, filterValue.length).toLowerCase() ,
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        case 'changeOwnerType': {
          if ((typeof filterValue === 'string') && filterValue !== '') {
            this.chipListValues.push({
              'toolTip': filterOptionsTooltip[key],
              'value': filterValue.slice(0, 1) + filterValue.slice(1, filterValue.length).toLowerCase() ,
              'filterKey': key,
              'filterOption': filterValue,
              'isDate': false
            });
          }
          break;
        }
        default:
          break;

      }
    }
  }

  getFilterValueLabel(key: string, value: string): string {
    if (this.filterFormConfiguration[key].options) {
      const selectedValue = this.filterFormConfiguration[key].options.find(item => item.value === value);
      return selectedValue ? selectedValue.label : value;
    }
    return value;
  }

  onClearAllFilters() {
    for (const key in this.currentFilterOptions) {
      if (this.currentFilterOptions[key]) {
        this.currentFilterOptions[key] = null;
      }
    }
    this.selectedAllFiltersRemoved.emit(this.currentFilterOptions);
  }

  calculateChipIndex() {
    let chipListWidth = 0;
    const chipListElement = this.chipContainer['_elementRef']['nativeElement'];
    let containerWidth = chipListElement['parentElement']['parentElement'].offsetWidth;
    const children = chipListElement['children'][0]['children'];
    const childLength = children.length;
    containerWidth = containerWidth - (children[0].offsetWidth + children[childLength - 1].offsetWidth);
    containerWidth = containerWidth - 30;
    if (children.length > 2) {
      this.totalChipList = [...this.chipListValues];
      this.chipIndex = 0;
      for (let i = 1; i <= childLength - 2; i++) {
        chipListWidth = chipListWidth + children[i].offsetWidth;
        if (chipListWidth > containerWidth) {
          this.chipIndex = this.chipListValues.length - (i - 2);
          this.menuChipListValues = this.totalChipList.splice(i - 2);
          return;
        }
      }
    }
  }


  removeItem(filterKey: string, item: any) {
    if (filterKey === 'people') {
      this.currentFilterOptions[filterKey] = this.currentFilterOptions[filterKey].filter(people => (people.user.userID !== item.user.userID
        && people.role.value !== item.role.name));
    } else if (filterKey === 'plannedReleaseDate' || filterKey === 'plannedEffectiveDate' || filterKey === 'dueDate' || filterKey === 'meetingDate'
      || filterKey === 'activeDate' || filterKey === 'effectiveEndDate' || filterKey === 'createdOn' || filterKey === 'linkedChangeObject' || filterKey === 'linkedItems'
      || filterKey === 'agendaCategory' || filterKey === 'keywords' || filterKey === 'decision' || filterKey === 'changeObject' || filterKey === 'myTeamAction' || filterKey === 'changeOwnerType'
    ) {
      this.currentFilterOptions[filterKey] = null;
    } else {
      if (filterKey === 'actionDates' || filterKey === 'actionStatus') {
        this.currentFilterOptions['actionDisplayStatus'] =
          this.currentFilterOptions['actionDisplayStatus']
            .filter(actionItem => actionItem && (actionItem.value as String).toLowerCase() !== item['name'].toLowerCase());
      }
      this.currentFilterOptions[filterKey] = this.currentFilterOptions[filterKey].filter(filterOption => filterOption !== item);
    }

    this.selectedFilterRemoved.emit(this.currentFilterOptions);
  }

  objectKeys(obj) {
    if (obj) {
      return Object.keys(obj);
    }
    return [];
  }

  hasFilterOptions(): boolean {
    let hasFilterOption = false;
    for (const filterKey of Object.keys(this.currentFilterOptions)) {
      if ((filterKey !== 'people' && this.currentFilterOptions[filterKey] && this.currentFilterOptions[filterKey].length > 0) ||
        (filterKey !== 'people' && this.currentFilterOptions[filterKey] && typeof (this.currentFilterOptions[filterKey]) === 'object') &&
        Object.keys(this.currentFilterOptions[filterKey]).length > 0) {
        hasFilterOption = true;
      }
      if (filterKey === 'people'
        && this.currentFilterOptions[filterKey]
        && this.currentFilterOptions[filterKey].length > 0
        && this.currentFilterOptions[filterKey][0]
        && this.currentFilterOptions[filterKey][0]['user']
        && this.currentFilterOptions[filterKey][0]['user']['userID']) {
        hasFilterOption = true;
      }
      // when multi user search
      if (filterKey === 'people'
        && this.currentFilterOptions[filterKey]
        && this.currentFilterOptions[filterKey].length === 1
        && this.currentFilterOptions[filterKey][0]
        && this.currentFilterOptions[filterKey][0]['users']
        && this.currentFilterOptions[filterKey][0]['users'].length > 0) {
        hasFilterOption = true;
      }
      if ((filterKey === 'plannedReleaseDate' || filterKey === 'plannedEffectiveDate' || filterKey === 'dueDate' || filterKey === 'meetingDate'
        || filterKey === 'activeDate' || filterKey === 'effectiveEndDate' || filterKey === 'createdOn') && (this.currentFilterOptions[filterKey]
        && this.currentFilterOptions[filterKey]['begin'])) {
        hasFilterOption = true;
      }
    }
    return hasFilterOption;
  }
}
