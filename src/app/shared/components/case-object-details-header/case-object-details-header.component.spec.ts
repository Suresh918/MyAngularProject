import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';

import { CaseObjectDetailsHeaderComponent } from './case-object-details-header.component';
import {MCCardSummaryComponent} from '../mc-card-summary/mc-card-summary.component';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {CaseObjectOverview} from '../case-object-list/case-object-list.model';
import {CerberusService} from '../../../core/services/cerberus.service';
import {CaseObject} from '../../models/mc.model';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {MemoizedSelector} from '@ngrx/store';
import {MyChangeState, NavBarPayload, NavBarState} from '../../models/mc-store.model';
import {selectShowFullMenu} from '../../../store';
import {selectNavBarState} from '../../../side-panel/store';
import {FormBuilder} from '@angular/forms';

describe('CaseObjectDetailsHeaderComponent', () => {
  let component: CaseObjectDetailsHeaderComponent;
  let fixture: ComponentFixture<CaseObjectDetailsHeaderComponent>;
  let mockStore: MockStore;
  let mockUsernameSelector: MemoizedSelector<MyChangeState, Boolean>;
  let mockNavBarSelector: MemoizedSelector<NavBarState, {}>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectDetailsHeaderComponent, MCCardSummaryComponent, DateDisplayPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatTooltipModule, RouterTestingModule, HttpClientModule, MatDialogModule, RouterTestingModule],
      providers: [
        provideMockStore(),
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        FormBuilder
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectDetailsHeaderComponent);
    mockStore = TestBed.inject(MockStore);
    mockUsernameSelector = mockStore.overrideSelector(
      selectShowFullMenu,
      true
    );
    mockNavBarSelector = mockStore.overrideSelector(
      selectNavBarState,
      {
        'leftNavBarState': {
          'isOpen': false,
          'panelMode': '',
          'isPanelFormDirty': false
        } as NavBarPayload,
        'rightNavBarState': {
          'isOpen': true,
          'panelMode': '',
          'isPanelFormDirty': false
        } as NavBarPayload,
      }
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open caseObject details in new Tab  when naviagateToDetails method is called', () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ChangeRequest';
    const caseObject = {ID: 'testID', revision: 'AA', type: 'ChangeRequest'};
    component.naviagateToDetails(caseObject);
    expect(window.open).toHaveBeenCalled();
  });

  it('should open IMS in new Tab on trigger of openImplementationStrategy method', () => {
    spyOn(window, 'open');
    component.caseObject = {ID: 'testID', title: 'testTitle'} as CaseObjectOverview;
    component.openImplementationStrategy();
    expect(window.open).toHaveBeenCalled();
  });

  it('should open ECN details in new tab when deepLinkTeamcenterURL is triggered', () => {
    spyOn(window, 'open');
    component.caseObject = {sourceSystemID: 'test sourceSystemID', ID: 'testID', title: 'test title'} as CaseObjectOverview;
    component.openECN();
    expect(window.open).toHaveBeenCalled();
  });

  it('should open Delta details in new tab when openDelta is triggered', () => {
    spyOn(window, 'open');
    component.caseObject = {sourceSystemAliasID: 'testID', ID: 'testId', title: 'test title'} as CaseObjectOverview;
    component.openDelta();
    expect(window.open).toHaveBeenCalled();
  });

  it('should set value to diabom when caseObjectType is assign ChangeRequest on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeRequestDIABOM').and.returnValue(of({ID: 'Test_data'}));
    component.caseObjectType = 'ChangeRequest';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data'});
  });

  it('should set value to diabom when caseObjectType is assign ChangeNotice on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeNoticeDIABOM').and.returnValue(of({ID: 'Test_data_ChangeNotice'}));
    component.caseObjectType = 'ChangeNotice';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data_ChangeNotice'});
  });

  it('should set value to diabom when caseObjectType is assign ReleasePackage on triggered getDIABOM', () => {
    const xService = fixture.debugElement.injector.get(CerberusService);
    spyOn(xService, 'getChangeNoticeDIABOM').and.returnValue(of({ID: 'Test_data_ReleasePackage'}));
    component.caseObjectType = 'ReleasePackage';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    component.getDIABOM();
    expect(component.diabom).toEqual({ID: 'Test_data_ReleasePackage'});
  });


  it('should call window.open when triggered openDIABOM & revision is working',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ChangeRequest';
    component.deepLinkChangeRequestDIAURL = 'changeRequestLink';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    const dia = {revision: 'Working'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call window.open when triggered openDIABOM & revision is not working',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ChangeNotice';
    component.deepLinkChangeNoticeDIAURL = 'changeNoticeLink';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    const dia = {revision: 'Completed'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should call window.open when triggered openDIABOM & revision is not working and caseObjectType is release package',  () => {
    spyOn(window, 'open');
    component.caseObjectType = 'ReleasePackage';
    component.deepLinkChangeNoticeDIAURL = 'changeNoticeLink';
    component.caseObject = {ID: 'testId', title: 'test Title'} as CaseObjectOverview;
    const dia = {revision: 'Completed'};
    component.openDIABOM(dia);
    expect(window.open).toHaveBeenCalled();
  });

  it('should emit deleteItem on trigger onDeleteItem', () => {
    spyOn(component.deleteItem, 'emit');
    component.caseObject = {ID: 'testId', title: 'testTitle'} as CaseObjectOverview;
    component.onDeleteItem();
    expect(component.deleteItem.emit).toHaveBeenCalled();
  });

  it('should return caseObject when trigger getCaseObjectData',  () => {
    component.caseObject = {ID: 'newCaseObjectID', type: 'test', title: 'test title'} as CaseObjectOverview;
    component.caseObjectType = 'newCaseObjectType';
    const returnValue = component.getCaseObjectData();
    expect(returnValue).toEqual(new CaseObject('newCaseObjectID', '', 'newCaseObjectType'));
  });
});
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
