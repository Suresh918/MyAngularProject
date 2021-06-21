import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {MatMenuModule} from '@angular/material/menu';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';
import {Router} from '@angular/router';

import { GlobalSearchComponent } from './global-search.component';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CerberusService} from '../../../core/services/cerberus.service';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchComponent, HighlightTextPipeMock, DateDisplayPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTooltipModule, ReactiveFormsModule, FormsModule, MatDialogModule, RouterTestingModule,
        StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, InfiniteScrollModule, MatMenuModule],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: Router, useValue: mockRouter},
        {provide: CaseObjectListService, useClass: CaseObjectListServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: CerberusService, useClass: CerberusServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    component.mcState = {
      commonState: {
        commonSearchState: {
          globalSearchHistory: ['test', 'testing']
        }
      }
    };
    window['digitalData'] = {events: []};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showGlobalSearch to true when openGlobalSearch is triggered', () => {
    component.showGlobalSearch = false;
    component.searchPlaceholder = {
      nativeElement:  {
        focus: () => {}
      }
    };
    component.openGlobalSearch();
    expect(component.showGlobalSearch).toBe(true);
  });

  it('should set value to searchControl when showSearchResults is triggered',  () => {
    const option = 'test-option';
    component.showSearchResults(option);
    expect(component.searchControl.value).toEqual('test-option');
  });

  it('should set value to stateHistory when showSearchResults is triggered',  () => {
    const option = {ID: '12345'};
    component.showSearchResults(option);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should set updated selectedChip string when toggleSearchResults is triggered', () => {
    component.selectedChips = 'changeRequest,changeNotice,releasePackage';
    const chip = {type: 'changeRequest'};
    component.toggleSearchResults(chip);
    expect(component.selectedChips).toBe('changeNotice,releasePackage');
  });

  it('should set updated selectedChip string when toggleSearchResults is triggered and selectedChips is not matched minimum one word with chip type ', () => {
    component.selectedChips = 'changeRequest,changeNotice,releasePackage';
    const chip = {type: 'searchThis'};
    component.toggleSearchResults(chip);
    expect(component.selectedChips).toBe('changeRequest,changeNotice,releasePackage,searchThis');
  });

  it('should have call getSelectedCaseObjectList when onScroll is triggered',  () => {
    spyOn(component, 'getSelectedCaseObjectList');
    component.totalResults = {totalItems: 10};
    component.caseObjectList = ['test', 'test2', 'test3', 'test4', 'test5'];
    component.onScroll();
    expect(component.getSelectedCaseObjectList).toHaveBeenCalled();
  });

  it('should open IMS page in new tab when openImplementationStrategy is triggered',  () => {
    spyOn(window, 'open');
    const option = {ID: '12345'};
    component.openImplementationStrategy(option);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call open method on window when ecn id set and openECN is triggered', () => {
    spyOn(window, 'open');
    const option = {sourceSystemID: '123456'};
    component.deepLinkTeamcenterURL = 'www.deeplinkTestUrl.com';
    component.openECN(option);
    expect(window.open).toHaveBeenCalled();
  });

  it('should open delta url in new window when openDelta is triggered',  () => {
    spyOn(window, 'open');
    const option = {sourceSystemAliasID: '123456', ID: 'name1'};
    component.openDelta(option);
    expect(window.open).toHaveBeenCalled();
  });

  it('should set diabom when option type is either ChangeRequest on triggered getDIABOM', () => {
    /*const event = {
      type: 'click',
      stopPropagation: function() {}
    };*/
    component.getDIABOM({type: 'ChangeRequest', ID: '12345'});
    expect(component.diabom).toEqual({ ID: 'testDiaBom' });
  });

  it('should set diabom when option type is either ChangeNotice or ReleasePackage on triggered getDIABOM', () => {
    component.getDIABOM({ID: 'ChangeNotice', type: 'ChangeNotice'});
    expect(component.diabom).toEqual({ ID: 'testDIaBOM' });
    component.getDIABOM({type: 'ReleasePackage', changeNoticeID: 'ReleasePackage'});
    expect(component.diabom).toEqual({ ID: 'testDIaBOM' });
  });

  it('should open window when revision is set as working openDIABOM is triggered',  () => {
    spyOn(window, 'open');
    component.caseObjectID = '123456';
    component.deepLinkChangeRequestDIAURL = 'testUrl';
    component.caseObjectType = 'ChangeRequest';
    const dia = {revision: 'Working'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
    // Same Scenario when ChangeNotice is set for caseObjectType
    component.caseObjectType = 'ReleasePackage';
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should open window when revision is set as NotWorking openDIABOM is triggered',  () => {
    spyOn(window, 'open');
    component.caseObjectID = '123456';
    component.deepLinkChangeRequestDIAURL = 'testUrl';
    component.caseObjectType = 'ChangeNotice';
    const dia = {revision: 'NotWorking'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should route navigate when showAllfilteredObjects is triggered',  () => {
    const selectedChip = 'test';
    component.showAllfilteredObjects(selectedChip);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should call showSearchResults when filteredOptions are set on keyDownFunction triggered',  () => {
    spyOn(component, 'showSearchResults');
    component.filteredOptions = ['test1'];
    const event = new Event('click');
    component.keyDownFunction(event);
    expect(component.showSearchResults).toHaveBeenCalled();
  });

  it('should call router navigate when selectedChipsArray is set and keyDownFunction triggered',  () => {
    component.filteredOptions = ['test1', 'test2'];
    const event = new KeyboardEvent('keydown', {
      key: 'Escape'
    });
    document.dispatchEvent(event);
    component.selectedChips = 'test';
    component.keyDownFunction(event);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
@Pipe({name: 'highlightText'})
class HighlightTextPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return `<span color="red">${value}</span>`;
  }
}
@Pipe({name: 'dateFormat'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
class ServiceParametersServiceMock {
  getServiceParameter() {
    return [{ 'name': 'name1' }];
  }
}

class UserProfileServiceMock {
  getState() {
    return {
      commonState: {
        commonSearchState: {
          globalSearchHistory: ['test', 'testing']
        }
      }};
  }

  updateUserProfileStates(mcState) {
    return {};
  }
}

class CaseObjectListServiceMock {
  getSearchResults$(listStartIndex, listSize, searchString, selectedChips) {
    return of({});
  }
}

class HelpersServiceMock {
  getCaseObjectForms(type) {
    return {path: 'test1234'};
  }
}
class CerberusServiceMock {
  getChangeRequestDIABOM(id) {
    return of({ID: 'testDiaBom'});
  }
  getChangeNoticeDIABOM(changeNoticeID) {
    return of({ID: 'testDIaBOM'});
  }
}
