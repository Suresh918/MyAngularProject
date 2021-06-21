import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, merge, of, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {catchError, debounceTime, switchMap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';

import {CaseObjectListService} from 'app/core/services/case-object-list.service';
import {MyChangeState, NavBarPayload, SidePanelState} from 'app/shared/models/mc-store.model';
import {MCFormGroupService} from 'app/core/utilities/mc-form-group.service';
import {selectRightNavBarState, setRightSideNavBar} from 'app/side-panel/store/index';
import {ChangeNotice, ChangeRequest, ReleasePackage} from 'app/shared/models/mc.model';
import {HelpersService} from 'app/core/utilities/helpers.service';
import {loadCaseObject} from '../../../../store/actions/case-object.actions';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-case-object-table',
  templateUrl: './case-object-table.component.html',
  styleUrls: ['./case-object-table.component.scss']
})
export class CaseObjectTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize: number;
  resultsLength = 0;
  progressBar = true;
  isSortingFromInput: boolean;
  selectedRowIndex: number;
  isRightPanelOpen: boolean;
  lastCaseObjectToOpenAction: string;
  allCaseObjectStatus: {};
  subject$: BehaviorSubject<string> = new BehaviorSubject('');
  navBarSubscription$: Subscription;
  dataSource: MatTableDataSource<any>;
  selectedCell: HTMLElement;
  cellSelected = false;

  @Input()
  displayedColumns: string[];

  @Input()
  caseObjectType: string;

  @Input()
  caseObjectLabel: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  listSortConfiguration: Sort;

  @Input()
  filterQuery$: string;

  @Output()
  readonly updateListSortConfiguration: EventEmitter<Sort> = new EventEmitter();
  @Output()
  readonly totalTableCount: EventEmitter<number> = new EventEmitter();
  @Output()
  readonly searchInProgress: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly caseObjectListService: CaseObjectListService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly router: Router,
              private readonly appStore: Store<MyChangeState>,
              private readonly dialog: MatDialog,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly configurationService: ConfigurationService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.pageSize = 8;
    this.subscribeToSidePanelStore();
    this.getAllStatusByService();
  }

  ngAfterViewInit() {
    this.registerTableSubscriptions();
    this.createTableObservers();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.listSortConfiguration && simpleChanges.listSortConfiguration.currentValue) {
      this.isSortingFromInput = true;
      HelpersService.setSortConfiguration(this.sort, simpleChanges.listSortConfiguration.currentValue);
    }
    if (simpleChanges.filterQuery$ && (simpleChanges.filterQuery$.currentValue || simpleChanges.filterQuery$.currentValue.trim() === '')) {
      this.subject$.next(simpleChanges.filterQuery$.currentValue);
    }
  }

  registerTableSubscriptions(): void {
    this.subject$.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  createTableObservers(): void {

    merge(this.sort.sortChange, this.paginator.page, this.subject$)
      .pipe(debounceTime(500),
        switchMap(() => {
          const filter = this.subject$.value;
          const numberOfItems = this.paginator.pageSize;
          const startPosition = this.paginator.pageIndex * numberOfItems;
          if (this.sort.active && !this.isSortingFromInput) {
            this.updateSortConfiguration();
          }
          this.isSortingFromInput = false;
          this.progressBar = true;
          this.searchInProgress.emit(this.progressBar);
          let orderBy = '';
          switch (this.sort.active) {
            case 'id':
              orderBy = ' ID ' + this.sort.direction;
              break;
            case 'description':
              orderBy = '  generalInformation.title ' + this.sort.direction;
              break;
            case 'project':
              orderBy = 'projectID ' + this.sort.direction;
              break;
            case 'status':
              orderBy = '  generalInformation.status ' + this.sort.direction;
              break;
            default:
              break;
          }
          if (this.caseObjectType === 'ChangeRequest') {
            return this.caseObjectListService.getChangeRequestList$(
              startPosition,
              numberOfItems,
              filter, orderBy);
          }
          if (this.caseObjectType === 'ChangeNotice') {
            return this.caseObjectListService.getChangeNoticeList$(
              startPosition,
              numberOfItems,
              filter, orderBy);
          }
          if (this.caseObjectType === 'ReleasePackage') {
            return this.caseObjectListService.getReleasePackageList$(
              startPosition,
              numberOfItems,
              filter, orderBy);
          }
        }),
        catchError((err) => {
          this.progressBar = false;
          this.resultsLength = 0;
          return of([]);
        })
      ).subscribe((data: any) => {
      this.progressBar = false;
      this.searchInProgress.emit(this.progressBar);
      const caseObjectList: any = data;
      if (this.caseObjectType === 'ChangeRequest') {
        this.dataSource.data = caseObjectList['changeRequestSummaries'];
      }
      if (this.caseObjectType === 'ChangeNotice') {
        this.dataSource.data = caseObjectList['changeNoticeSummaries'];
      }
      if (this.caseObjectType === 'ReleasePackage') {
        this.dataSource.data = caseObjectList['releasePackageSummaries'];
      }
      this.resultsLength = caseObjectList.totalItems;
      this.totalTableCount.emit(this.resultsLength);
    });
  }

  openActionsPanel(caseObject, $event): void {
    if (this.selectedCell && this.selectedCell.parentElement.classList.contains('selected-complete-action')) {
      this.selectedCell.parentElement.classList.remove('selected-complete-action');
    }
    this.selectedCell = $event.target;
    this.cellSelected = true;
    let caseObjectFormGroup: FormGroup;
    let pageName: string;
    this.selectedRowIndex = caseObject.ID;
      this.selectedRowIndex = 0;
      if (!this.isRightPanelOpen) {
        this.appStore.dispatch(loadCaseObject({caseObject: caseObject, caseObjectType: this.caseObjectType}));
        this.sidePanelStore.dispatch(setRightSideNavBar(true, 'actions'));
        this.selectedCell.classList.remove('completed-actions');
        this.selectedCell.parentElement.classList.add('selected-complete-action');
      } else {
        this.sidePanelStore.dispatch(setRightSideNavBar(false, ''));
      }
      $event.stopPropagation();
      return;
    if (this.caseObjectType === 'ChangeRequest') {
      caseObjectFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(caseObject), [], []);
      pageName = 'ChangeRequest';
    }
    if (this.caseObjectType === 'ChangeNotice') {
      caseObjectFormGroup = this.mcFormGroupService.createChangeNoticeFormGroup(new ChangeNotice(caseObject), []);
      pageName = 'ChangeNotice';
    }
    if (this.caseObjectType === 'ReleasePackage') {
      caseObjectFormGroup = this.mcFormGroupService.createReleasePackageFormGroup(new ReleasePackage(caseObject), []);
      pageName = 'ReleasePackage';
    }
    this.sidePanelStore.dispatch(setRightSideNavBar(true, 'actions'));
    $event.stopPropagation();
  }

  updateSortConfiguration() {
    this.updateListSortConfiguration.emit({
      'active': this.sort.active,
      'direction': this.sort.direction
    });
  }

  createChangeRequest(type: string) {
      this.router.navigate(['/change-requests/', type]);
  }

  subscribeToSidePanelStore(): void {
    this.navBarSubscription$ = this.sidePanelStore.pipe(select(selectRightNavBarState)).subscribe((res: NavBarPayload) => {
      if (res && res.hasOwnProperty('isOpen')) {
        this.isRightPanelOpen = res.isOpen.valueOf();
        if (!this.isRightPanelOpen && this.cellSelected) {
          this.selectedCell.classList.add('completed-actions');
          this.selectedCell.parentElement.classList.remove('selected-complete-action');
          this.cellSelected = false;
        }
      }
    });
  }

  getCaseObjectStatusLabel(status) {
    const currentStatus = this.configurationService.getFormFieldOptionDataByValue(this.caseObjectType,
      'generalInformation.status', status);
    return currentStatus;
  }

  getAllStatusByService() {
    this.allCaseObjectStatus = this.configurationService.getFormFieldOptionDataByValue(this.caseObjectType,
      'generalInformation.status', 'options');
  }

  ngOnDestroy() {
    if (this.navBarSubscription$) {
      this.navBarSubscription$.unsubscribe();
    }
  }
}
