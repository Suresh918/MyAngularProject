import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {of, Subject} from 'rxjs';


import {CaseObjectListService} from 'app/core/services/case-object-list.service';
import {MCCaseObjectOverviewCardListComponent} from './case-object-overview-card-list.component';
import {CaseObjectOverviewCardComponent} from '../../case-object-list/case-object-overview-list/case-object-overview-card/case-object-overview-card.component';
import {CaseObjectOverview} from '../../case-object-list/case-object-list.model';

describe('MCCaseObjectCardListComponent', () => {
  let component: MCCaseObjectOverviewCardListComponent;
  let fixture: ComponentFixture<MCCaseObjectOverviewCardListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCCaseObjectOverviewCardListComponent, CaseObjectOverviewCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: CaseObjectListService, useClass: CaseObjectListServiceMock},
      ],
      imports: [HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectOverviewCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('should pageScrolled  to true on initialized', () => {
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
  });*/

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
