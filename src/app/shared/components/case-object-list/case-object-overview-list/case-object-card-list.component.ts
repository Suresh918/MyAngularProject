import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {CaseObjectListService} from 'app/core/services/case-object-list.service';
import {CaseObjectOverview} from '../case-object-list.model';

@Component({
  selector: 'mc-case-object-card-list',
  templateUrl: './case-object-card-list.component.html',
  styleUrls: ['./case-object-card-list.component.scss']
})
export class MCCaseObjectCardListComponent implements OnInit, OnChanges {
  caseObjectListId: string[];
  @Input()
  scrollUpdate: Subject<void>;

  @Input()
  caseObjectType: string;

  @Input()
  isDetailView: boolean;

  @Input()
  caseObjectLabel: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  hasPagination: boolean;

  @Input()
  caseObjectListOverview: any;

  @Input()
  showItemDeleteButton: boolean;

  @Input()
  deleteButtonCaseAction: string;
  @Input()
  referenceComponent: string;
  @Input()
  isBusy?: boolean;

  @Input()
  set caseObjectAllItemsSelected(checked: boolean) {
    this.caseObjectSelectAllChecked = checked;
    if (this.caseObjectList && this.referenceComponent === 'myTeamManagement') {
      this.caseObjectList.forEach(response => {
        if (checked) {
          response['checked'] = true;
        } else {
          response['checked'] = false;
        }
      });
    }
  }

  @Input()
  set scrollWrapper(elem: HTMLElement) {
    if (elem) {
      this.listSize = (this.referenceComponent === 'myTeamManagement') ? Math.ceil(elem.offsetHeight / 88) : Math.ceil(elem.offsetHeight / 135);
      this.listSize = this.listSize < this.defaultListSize ? this.defaultListSize : this.listSize;
      this._stateChanges$.next();
    }
  }

  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly selectedItem: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly searchInProgress: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _filterQuery: string;

  get filterQuery(): string {
    return this._filterQuery;
  }

  @Input()
  set filterQuery(value: string) {
    if (value || (value === '')) {
      if (this._filterQuery || this._filterQuery === '' || this.isDetailView) {
        this._filterQuery = value;
        this.listStartIndex = 0;
        this._stateChanges$.next();
      } else {
        this.listStartIndex = 0;
        this._filterQuery = value;
      }
    }
  }

  public _activeSort: Sort;

  get activeSort(): Sort {
    return this._activeSort;
  }

  @Input()
  set activeSort(value: Sort) {
    this.listStartIndex = 0;
    if (this._activeSort) {
      this._activeSort = value;
      this._stateChanges$.next();
    } else {
      this._activeSort = value;
    }
  }

  @Output()
  readonly totalListCount: EventEmitter<number> = new EventEmitter();
  @Output()
  readonly caseObjectListIds: EventEmitter<string[]> = new EventEmitter<string[]>();
  caseObjectList: CaseObjectOverview[];
  listStartIndex: number;
  lastUpdatedStartindex: number;
  listSize: number;
  defaultListSize: number;
  totalItems: number;
  private _stateChanges$: Subject<void> = new Subject<void>();
  public _pageScrolled: boolean;
  progressBar = false;
  caseObjectSelectAllChecked: boolean;

  constructor(private readonly caseObjectListService: CaseObjectListService) {
    this.caseObjectList = [];
    this.listStartIndex = 0;
    this.defaultListSize = 8;
    this.listSize = this.listSize || this.defaultListSize;
    this.hasPagination = true;
    this.getCaseObjectOverviewList();
  }

  ngOnInit() {
    this._pageScrolled = false;
    if (this.scrollUpdate) {
      this.scrollUpdate.subscribe(() => {
        if (this.totalItems > this.caseObjectList.length && this.lastUpdatedStartindex !== this.listStartIndex) {
          this._pageScrolled = true;
          this._stateChanges$.next();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // added temporarily
    if (this.referenceComponent !== 'myTeamManagement') {
      this.caseObjectList = this.caseObjectListOverview;
    }
  }

  getCaseObjectOverviewList() {
    this.caseObjectListId = [];
    this._stateChanges$.pipe(
      switchMap(() => {
        this.progressBar = true;
        this.searchInProgress.emit(this.progressBar);
        this.lastUpdatedStartindex = this.listStartIndex;
        return this.caseObjectListService.getCaseObjectOverviewSummary$(this.caseObjectRouterPath, this.listStartIndex, this._pageScrolled ? this.defaultListSize : this.listSize, this.hasPagination, this._filterQuery, this.getSortingQuery());
      })
    ).subscribe((res) => {
      this.progressBar = false;
      this.searchInProgress.emit(this.progressBar);
      this.listStartIndex = (this._pageScrolled ? this.defaultListSize : this.listSize) + this.listStartIndex;
      res.caseObjectOverViewList.forEach(response => {
        this.caseObjectListId.push(response['ID']);
        if (this.referenceComponent === 'myTeamManagement') {
          if (this.caseObjectSelectAllChecked) {
            response['checked'] = true;
          } else {
            response['checked'] = false;
          }
        }
      });
      this.caseObjectList = (this._pageScrolled) ? this.caseObjectList ? this.caseObjectList.concat(res.caseObjectOverViewList) : res.caseObjectOverViewList : res.caseObjectOverViewList;
      this._pageScrolled = false;
      this.totalItems = res.totalItems;
      this.totalListCount.emit(this.totalItems);
      this.caseObjectListIds.emit(this.caseObjectListId);
    });
  }

  getSortingQuery(): string {
    let orderBy = '';
    if (this._activeSort && this._activeSort.active && this._activeSort.direction) {
      switch (this._activeSort.active) {
        case 'action.deadline':
          orderBy = ' action.deadline ' + this._activeSort.direction;
          break;
        case 'priority':
          if (this.caseObjectType === 'ChangeRequest') {
            orderBy = '  analysisPriority ' + this._activeSort.direction;
          } else {
            orderBy = '  implementationPriority ' + this._activeSort.direction;
          }
          break;
        case 'createdOn':
          orderBy = ' generalInformation.createdOn ' + this._activeSort.direction;
          break;
        case 'status':
          orderBy = '  generalInformation.status ' + this._activeSort.direction;
          break;
        case 'plannedReleaseDate':
          orderBy = '  plannedReleaseDate ' + this._activeSort.direction;
          break;
        case 'plannedEffectiveDate':
          orderBy = '  plannedEffectiveDate ' + this._activeSort.direction;
          break;
        case 'openActionsCount':
          orderBy = '  openActionsCount ' + this._activeSort.direction;
          break;
        default:
          break;
      }
    }
    return orderBy;
  }

  onDeleteItem(event): void {
    this.deleteItem.emit(event);
  }

  onSelectedItem(event): void {
    this.selectedItem.emit(event);
  }

}
