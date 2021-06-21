/*
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {of} from 'rxjs';


import {MCCaseObjectListComponent} from './case-object-list.component';
import {CaseObjectTableComponent} from './case-object-table/case-object-table.component';
import {CaseObjectStatePanelComponent} from './case-object-state-panel/case-object-state-panel.component';
import {MCCaseObjectCardListComponent} from './case-object-overview-list/case-object-card-list.component';
import {metaReducers, reducers} from '../../../store';
import {McFiltersConfigurationService} from '../../../core/utilities/mc-filters-configuration.service';
import {McSortingConfigurationService} from '../../../core/utilities/mc-sorting-configuration.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {FilterBarComponent} from '../filter-bar/filter-bar.component';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCCaseObjectListComponent', () => {
  let component: MCCaseObjectListComponent;
  let fixture: ComponentFixture<MCCaseObjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MCCaseObjectListComponent, FilterBarComponent, CaseObjectStatePanelComponent,
        CaseObjectTableComponent, MCCaseObjectCardListComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [InfiniteScrollModule, MatTooltipModule, MatBadgeModule, FlexLayoutModule, MatTableModule,
        RouterModule, RouterTestingModule, MatMenuModule, MatDialogModule, HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: McFiltersConfigurationService, useClass: McFiltersConfigurationServiceMock},
        {provide: McSortingConfigurationService, useClass: McSortingConfigurationServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectListComponent);
    component = fixture.componentInstance;
    component.listSortConfiguration = {active: 'test', direction: 'asc'};
    component.displayedColumns = ['test', 'test1'];
    component.filterQuery$ = 'test';
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectLabel = 'test';
    component.caseObjectRouterPath = '/changerequest';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set expandStatePanel to true when onScroll is triggered',  () => {
    const events = {target: {
        scrollTop: 0
      }};
    component.onScroll(events);
    expect(component.expandStatePanel).toBe(true);
  });

  it('should set expandStatePanel to false when onScroll is triggered',  () => {
    const events = {
      target: {
        scrollTop: 10
      }
    };
    component.onScroll(events);
    expect(component.expandStatePanel).toBe(false);
  });

  it('should set filterQueryString when triggerFilterChanges is triggered',  () => {
    component.triggerFilterChanges('search String');
    expect(component.filterQueryString).toBe('search String');
  });

  it('should call updateSortingState when triggerListSortConfiguration is triggered',  () => {
    spyOn(component, 'updateSortingState');
    const sort = {active: 'id', direction: 'asc'} as Sort;
    component.triggerListSortConfiguration(sort);
    expect(component.updateSortingState).toHaveBeenCalled();
  });

  it('should set showTableView  when toggleListView is triggered',  () => {
    component.caseObjectType = 'changeRequest';
    component.currentStateModel = {commonSearchState: {globalSearchHistory : []}};
    component.toggleListView(true);
    expect(component.showTableView).toBe(true);
  });

  it('should call updateSortingState when triggerOverviewListSortChange is triggered',  () => {
    const sort = {active: 'id', direction: 'asc'} as Sort;
    component.triggerOverviewListSortChange(sort);
    expect(component.overviewListActiveSort).toEqual(sort);
  });

  it('should set totalCount when updateTotalCounter is triggered',  () => {
    const events = 1;
    component.updateTotalCounter(events);
    expect(component.totalItemCount).toBe(1);
  });

  it('should set filterQuery$ & caseObjectType is release-packages when statePanelSelectAction is triggered',  () => {
    const data = {caseObjectType : 'release-packages', state : true};
    component.filterQueryString = 'q?=searchString';
    component.statePanelFilterQuery = 'testSearchString';
    component.statePanelSelectAction(data);
    expect(component.filterQuery$).toBe('q?=searchString and generalInformation.status in ("true")');
  });

  it('should set filterQuery$ & caseObjectType is not release-packages when statePanelSelectAction is triggered',  () => {
    const data = {caseObjectType : 'changeRequest', state : true};
    component.filterQueryString = 'q?=searchString';
    component.statePanelFilterQuery = 'testSearchString';
    component.statePanelSelectAction(data);
    expect(component.filterQuery$).toBe('q?=searchString and generalInformation.state in ("true")');
  });

  it('should set showFilterPanel when filterPanelView is triggered',  () => {
    const events = true;
    component.filterPanelView(events);
    expect(component.showFilterPanel).toBe(true);
  });

  it('should toggleStatePanel when statePanelView is triggered',  () => {
    component.statePanelView(false);
    expect(component.toggleStatePanel).toBe(false);
  });

  it('should set disabledLayerClicked when hideFilterPanelEvent is triggered ',  () => {
    component.hideFilterPanelEvent();
    expect(component.disabledLayerClicked).toBe(true);
  });

  it('should set showTableView when checkForListState is triggered', () => {
    component.caseObjectType = 'changeRequest';
    component.checkForListState();
    expect(component.showTableView).toBe(true);
  });

  it('should set when setSearchProgress is triggered',  () => {
    component.setSearchProgress(false);
    expect(component.searchInProgress).toBe(false);
  });

  it('should set totalCountHelp when showObsoletedCardsCount is triggered',  () => {
    component.caseObjectType = 'ChangeRequest';
    component.showObsoletedCardsCount({});
    expect(component.totalCountHelp).toEqual(new Info('', 'testLabel', '', '', null));
  });

  it('should set when onIsSetStateCardList is triggered',  () => {
    component.onIsSetStateCardList(false);
    expect(component.isProgressStatusList).toBe(false);
  });

  it('should set totalStates when caseObjectType is ChangeNotice & getNumberOfStates is trigger', () => {
    component.caseObjectType = 'ChangeNotice';
    component.getNumberOfStates();
    expect(component.totalStates).toBe(4);
  });

  it('should set totalStates when caseObjectType is ReleasePackage & getNumberOfStates is trigger', () => {
    component.caseObjectType = 'ReleasePackage';
    component.getNumberOfStates();
    expect(component.totalStates).toBe(6);
  });
});

class UserProfileServiceMock {
  getCaseObjectSortFromState(filterCaseObject) {
    return of({active: 'test', direction: 'asc'});
  }

  updateCaseObjectSortInState(sort, filterCaseObject, isOverviewType) {
  }

  getCaseObjectState(type) {
    return {
      commonCaseObjectState: {
        stateConfiguration: {
          listView: false
        }
      }
    };
  }

  updateCaseObjectState(state, data) {
    return {};
  }
}

class McFiltersConfigurationServiceMock {
  getCaseObjectFiltersConfiguration(type) {
    return {};
  }
}

class McSortingConfigurationServiceMock {
  getCaseObjectSortingConfiguration(caseObjectType) {
    return {};
  }
}

class HelpersServiceMock {
  getCaseObjectForms(type: string) {
    return {filterCaseObject: {}};
  }

  removeEmptyKeysFromObject(obj) {
    return {};
  }
}

class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }

  getServiceParameter(caseObjectType, formField, totalItems) {
    return [{label: 'testLabel'}];
  }
}
*/
