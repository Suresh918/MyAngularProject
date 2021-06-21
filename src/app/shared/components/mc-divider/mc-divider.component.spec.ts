import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MemoizedSelector, StoreModule} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';

import {McDividerComponent} from './mc-divider.component';
import {metaReducers, reducers, selectCaseActionState} from '../../../store';
import {CaseObject} from '../../models/mc.model';
import { MyChangeState} from '../../models/mc-store.model';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';

describe('McDividerComponent', () => {
  let component: McDividerComponent;
  let fixture: ComponentFixture<McDividerComponent>;
  let mockStore: MockStore;
  let mockCaseObjectSelector1: MemoizedSelector<MyChangeState, {}>;
  const landingState = {
    caseObjectState: {
      selectCaseActionState: {
        id: '123456',
        revision: 'AA'
      }
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McDividerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [StoreModule.forRoot(reducers, {metaReducers})],
      providers: [provideMockStore({initialState: landingState}),
        {provide: StoreHelperService, useClass: StoreHelperServiceMock}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McDividerComponent);
    mockStore = TestBed.inject(MockStore);
    mockCaseObjectSelector1 = mockStore.overrideSelector(
      selectCaseActionState,
      {
        caseObjectId: '1234',
        ID: '123456',
      caseObjectRevision: 'AA',
      caseObjectType: 'ChangeRequest',
      action: 'add',
    isAllowed: true,
    mandatoryParameters: [],
    id: '1234567'

  }
    );
    component = fixture.componentInstance;
    component.caseObjectType = 'changeRequest';
    component.isLinkedItem = false;
    component.buttonAction$ = of(true);
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the case object data', waitForAsync(() => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    fixture.detectChanges();
    expect(component.caseObjectData).toBeTruthy();
  }));

  it('should set the case object and subscribe to specific case action', waitForAsync(() => {
    component.isLinkedItem = true;
    component.buttonAction = 'submit';
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
  }));
});
class StoreHelperServiceMock {
  getButtonSelector(caseObjectType, buttonAction, ID, revision) {
    return {caseObjectId: '123456', revision: 'AA', type: 'ChangeRequest', action: 'close'};
  }
}
