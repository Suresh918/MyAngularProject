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
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, forkJoin, merge, of, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {CaseObjectListService} from '../../../../core/services/case-object-list.service';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {MyChangeState, NavBarPayload, SidePanelState} from '../../../models/mc-store.model';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {ChangeNotice, ChangeRequest, ReleasePackage} from '../../../models/mc.model';
import {loadCaseObject} from '../../../../store/actions/case-object.actions';
import {selectRightNavBarState, setRightSideNavBar} from '../../../../side-panel/store';
import {CaseObjectOverview} from '../../case-object-list/case-object-list.model';
import {CaseObjectServicePath} from '../../case-object-list/case-object.enum';

@Component({
  selector: 'mc-case-object-overview-table',
  templateUrl: './case-object-overview-table.component.html',
  styleUrls: ['./case-object-overview-table.component.scss']
})

export class MCCaseObjectOverviewTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  displayedColumns: string[];
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectLabel: string;
  @Input()
  caseObjectRouterPath: string;
  @Input()
  filterUpdated$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  @Output()
  readonly totalElements: EventEmitter<number> = new EventEmitter();
  @Output()
  readonly updateListSortConfiguration: EventEmitter<Sort> = new EventEmitter();
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize: number;
  resultsLength = 0;
  progressBar = true;
  isSortingFromInput: boolean;
  selectedRowIndex: number;
  isRightPanelOpen: boolean;
  navBarSubscription$: Subscription;
  dataSource: MatTableDataSource<any>;
  selectedCell: HTMLElement;
  cellSelected = false;
  caseObjectData: CaseObjectOverview[];
  previousFilter$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private readonly caseObjectListService: CaseObjectListService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly router: Router,
              private readonly appStore: Store<MyChangeState>,
              private readonly dialog: MatDialog,
              private readonly sidePanelStore: Store<SidePanelState>) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.pageSize = 8;
    this.subscribeToSidePanelStore();
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
  }

  registerTableSubscriptions(): void {
    this.filterUpdated$.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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

  createTableObservers(): void {
    this.filterUpdated$.pipe(debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => {
        const params = this.getOverviewData();
        return forkJoin(this.caseObjectListService.getOverviewSummary$(
          CaseObjectServicePath[this.caseObjectType],
          this.paginator.pageIndex,
          this.paginator.pageSize,
          params.filter, params.view, params.sort), this.caseObjectListService.getOverviewCount(
          CaseObjectServicePath[this.caseObjectType],
          params.filter, params.view, params.sort));
      }),
      catchError((err) => {
        this.progressBar = false;
        this.resultsLength = 0;
        return of([]);
      })
    ).subscribe((data: any) => {
      if (data && data.length > 1) {
        this.progressBar = false;
        const caseObjectList: any = data[0];
        this.dataSource.data = caseObjectList['results'];
        this.resultsLength = data[1].total_elements;
        this.totalElements.emit(this.resultsLength);
      }
    });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(debounceTime(500),
        switchMap(() => {
          const params = this.getOverviewData();
          return this.caseObjectListService.getOverviewSummary$(
            CaseObjectServicePath[this.caseObjectType],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            params.filter, params.view, params.sort);
        }),
        catchError((err) => {
          this.progressBar = false;
          this.resultsLength = 0;
          return of([]);
        })
      ).subscribe((data: any) => {
      this.progressBar = false;
      const caseObjectList: any = data;
      this.dataSource.data = caseObjectList['results'];
      this.totalElements.emit(this.resultsLength);
    });
  }

  getOverviewData() {
    let filter = '';
    let view = '';
    if (this.filterUpdated$.value) {
      if (this.filterUpdated$.value.viewQuery) {
        view = this.filterUpdated$.value.viewQuery + (this.filterUpdated$.value.statePanelQuery ? ' and ' + this.filterUpdated$.value.statePanelQuery : '');
      } else {
        view = this.filterUpdated$.value.statePanelQuery ? this.filterUpdated$.value.statePanelQuery : '';
      }
      if (this.filterUpdated$.value.filterQuery) {
        filter = this.filterUpdated$.value.filterQuery;
      }
      this.previousFilter$.next({'filterQuery': filter, 'viewQuery': view});
    }
    if (this.sort.active && !this.isSortingFromInput) {
      this.updateSortConfiguration();
    }
    this.isSortingFromInput = false;
    this.progressBar = true;
    let orderBy = '';
    switch (this.sort.active) {
      case 'id':
        orderBy = 'id,' + this.sort.direction;
        break;
      case 'description':
        orderBy = 'title,' + this.sort.direction;
        break;
      case 'project':
        orderBy = 'project_id,' + this.sort.direction;
        break;
      case 'status':
        orderBy = 'status,' + this.sort.direction;
        break;
      default:
        break;
    }
    return {'filter': filter, 'view': view, 'sort': orderBy};
  }

  ngOnDestroy() {
    if (this.navBarSubscription$) {
      this.navBarSubscription$.unsubscribe();
    }
  }

}
