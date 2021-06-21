import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {Sort} from '@angular/material/sort';

import {MCLinkedItemsPanelComponent} from './mc-linked-items-panel.component';
import {metaReducers, reducers} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('LinkedItemsPanelComponent', () => {
  let component: MCLinkedItemsPanelComponent;
  let fixture: ComponentFixture<MCLinkedItemsPanelComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate').and.returnValue('')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCLinkedItemsPanelComponent, DurationPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatDialogModule,
        RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: CaseObjectListService, useClass: CaseObjectListServiceMock},
        {provide: AALDurationPipe, useClass: DurationPipeMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: Router, useValue: mockRouter}

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCLinkedItemsPanelComponent);
    component = fixture.componentInstance;
    component.caseObject = 'changeRequest';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set service response to linkedItems  when onPanelOpened is triggered', () => {
    component.onPanelOpened();
    expect(component.linkedItems).toEqual({TotalItems: 2, categories: []});
  });

  it('should set filtered listItem selectedIDs which are selected when openSelectedTab is triggered', () => {
    component.linkedItems = {TotalItems: 2, categories: [{
        name: 'te',
        subCategories: [{
          items: [{
            link: {ID: '123456', type: 'testType'}
          }]
        }]
      }]};
    const selectedTabObject = {tabIndex: 1, tab : {textLabel: 'test'}};
    component.openSelectedTab(selectedTabObject);
    expect(component.selectedIDs.length).toBeGreaterThan(0);
  });

  it('should open window when selectedTabCaseObject  is AIR & onOverLayTabbedListItemClick is triggered',  () => {
    spyOn(window, 'open');
    const $event = {link: {type: 'AIR', ID: '123456'}};
    component.onOverLayTabbedListItemClick($event);
    expect(window.open).toHaveBeenCalled();
  });

  it('should open window when selectedTabCaseObject is not AIR nor PBSID & onOverLayTabbedListItemClick is triggered',  () => {
    const spy = (<jasmine.Spy>mockRouter.navigate).and.returnValue(Promise.resolve());
    const $event = {link: {type: 'AIR123', ID: '123456'}};
    component.onOverLayTabbedListItemClick($event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call dispatch sppStore when showAll is triggered', () => {
    spyOn(component.appStore, 'dispatch');
    component.selectedTabCaseObject = 'changeRequest';
    component.selectedIDs = ['12345', '12346'];
    component.showAll();
    component.userProfileUpdatedState$.next();
    fixture.detectChanges();
    component.showAll();
    expect(component.appStore.dispatch).toHaveBeenCalled();
  });

  it('should call getList when triggerOverviewListSortChange is triggered ', () => {
    spyOn(component, 'getList');
    const sort = {active: 'string', direction: 'asc'} as Sort;
    component.triggerOverviewListSortChange(sort);
    expect(component.getList).toHaveBeenCalled();
  });
});

@Pipe({name: 'aalDuration'})
class DurationPipeMock implements PipeTransform {
  transform(value) {
    return '1h 30m';
  }
}

class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }

  getState() {
    return {linkedItemState: { releasePackageSort: {}}};
  }

  getCaseObjectState() {
    return {commonCaseObjectState: {filters: {test: 'test'}}};
  }

  updateCaseObjectStateWithFiltersModel(currentFilterModel, filterCaseObject, userProfileUpdatedState) {
    return {};
  }

  updateUserProfileStates(storedState) {
    return {};
  }
}

class CaseObjectListServiceMock {
  getLinkedItems (caseObject, caseObjectId, sort) {
    return of({TotalItems: 2, categories: []});
  }
}

class HelpersServiceMock {
  getAgendaTypeFromTopic(type: string) {
    return {};
  }

  getCaseObjectForms(selectedTabCaseObject) {
    return {path: 'agenda-items'};
  }
}
class ServiceParametersServiceMock {
  getServiceParameter() {
    return [{ 'name': 'name1' }];
  }
}
