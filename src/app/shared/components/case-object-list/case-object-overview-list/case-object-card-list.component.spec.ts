import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {of, Subject} from 'rxjs';

import {MCCaseObjectCardListComponent} from './case-object-card-list.component';
import {CaseObjectOverviewCardComponent} from './case-object-overview-card/case-object-overview-card.component';
import {CaseObjectOverview} from '../case-object-list.model';
import {CaseObjectListService} from 'app/core/services/case-object-list.service';

describe('MCCaseObjectCardListComponent', () => {
  let component: MCCaseObjectCardListComponent;
  let fixture: ComponentFixture<MCCaseObjectCardListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCaseObjectCardListComponent, CaseObjectOverviewCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: CaseObjectListService, useClass: CaseObjectListServiceMock},
      ],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component._filterQuery = '';
    expect(component).toBeTruthy();
  });

  it('should set listSize when element is set for scrollWrapper',  () => {
    const elem = document.createElement('div');
    component.scrollWrapper = elem;
    expect(component.listSize).toBe(8);
  });

  it('should set _filterQuery  when filterQuery is assign value',  () => {
    component.filterQuery = 'test Query';
    component.isDetailView = true;
    expect(component._filterQuery).toBe('test Query');
    expect(component.filterQuery).toBe('test Query');
  });

  it('should set _filterQuery when _filterQuery is assign value',  () => {
    component._activeSort = {direction: 'asc', active: 'String'};
    expect(component.activeSort).toEqual({direction: 'asc', active: 'String'});
  });

  it('should pageScrolled  to true on initialized', () => {
    component.totalItems = 10;
    component.caseObjectList = [{ID: '5123',
      status: 'DRAFT',
      statusLabel: 'Draft',
      title: '[IP:]',
      totalDueSoonActions: 0,
      totalMyteamUsers: 3,
      totalOpenActions: 0,
      totalOverdueActions: 1} as CaseObjectOverview, {ID: '5123',
      status: 'DRAFT',
      statusLabel: 'Draft',
      title: '[IP:]',
      totalDueSoonActions: 0,
      totalMyteamUsers: 3,
      totalOpenActions: 0,
      totalOverdueActions: 1} as CaseObjectOverview];
    component.lastUpdatedStartindex = 0;
    component.listStartIndex = 8;
    component.scrollUpdate = new Subject<void>();
    component.ngOnInit();
    component.scrollUpdate.next();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component._pageScrolled).toBe(false);
  });

  it('should set value to caseObjectList when ngOnChanges is triggered', () => {
    component.caseObjectListOverview = [{ ID: 'string',
      title: 'string',
      status: 'string'} as CaseObjectOverview];
    const change = {changes: new SimpleChange(null, 'test', false)};
    component.ngOnChanges(change);
    expect(component.caseObjectList.length).toBeGreaterThan(0);
  });

  it('should emit deleteItem when onDeleteItem triggered',  () => {
    spyOn(component.deleteItem, 'emit');
    const $event = {};
    component.onDeleteItem($event);
    expect(component.deleteItem.emit).toHaveBeenCalled();
  });

  it('should return Order by when active sort property is action.deadline', () => {
    component.activeSort = {active: 'action.deadline', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe(' action.deadline asc');
  });

  it('should return Order by when active sort property is action.deadline', () => {
    component.activeSort = {active: 'action.deadline', direction: 'asc'};
    component._activeSort = {active: 'action.deadline', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe(' action.deadline asc');
  });

  it('should return Order by when active sort property is priority', () => {
    component._activeSort = {active: 'priority', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  implementationPriority asc');
  });

  it('should return Order by when active sort property is priority when caseObjectType is set as ChangeRequest', () => {
    component._activeSort = {active: 'priority', direction: 'asc'};
    component.caseObjectType = 'ChangeRequest';
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  analysisPriority asc');
  });

  it('should return Order by when active sort property is createdOn', () => {
    component._activeSort = {active: 'createdOn', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe(' generalInformation.createdOn asc');
  });

  it('should return Order by when active sort property is status', () => {
    component._activeSort = {active: 'status', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  generalInformation.status asc');
  });

  it('should return Order by when active sort property is plannedReleaseDate', () => {
    component._activeSort = {active: 'plannedReleaseDate', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  plannedReleaseDate asc');
  });

  it('should return Order by when active sort property is plannedEffectiveDate', () => {
    component._activeSort = {active: 'plannedEffectiveDate', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  plannedEffectiveDate asc');
  });

  it('should return Order by when active sort property is openActionsCount', () => {
    component._activeSort = {active: 'openActionsCount', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('  openActionsCount asc');
  });

  it('should return nothing for OrderBy when active sort property is not matched', () => {
    component._activeSort = {active: 'notMatch', direction: 'asc'};
    const returnValue = component.getSortingQuery();
    expect(returnValue).toBe('');
  });

  it('should set _activeSort when value is assigned to activeSort', () => {
    component.activeSort = {active: 'openActionsCount', direction: 'asc'};
    expect(component._activeSort).toEqual({active: 'openActionsCount', direction: 'asc'});
  });

});

class CaseObjectListServiceMock {
  getCaseObjectOverviewSummary$(caseObjectRouterPath, listStartIndex, listSize, hasPagination, filterQuery, getSortingQuery) {
    return of({caseObjectOverViewList: [{ID: '5123',
        status: 'DRAFT',
        statusLabel: 'Draft',
        title: '[IP:]',
        totalDueSoonActions: 0,
        totalMyteamUsers: 3,
        totalOpenActions: 0,
        totalOverdueActions: 1} as CaseObjectOverview]});
  }
}
