import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MemoizedSelector, StoreModule} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {CbRulesDialogComponent} from './cb-rules-dialog.component';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {ManageCbRulesService} from '../../../../core/services/manage-cb-rules.service';
import {UserAuthorizationService} from '../../../../core/services/user-authorization.service';
import {metaReducers, reducers, selectCaseActionState} from '../../../../store';
import {MyChangeState} from '../../../models/mc-store.model';
import {StoreHelperService} from '../../../../core/utilities/store-helper.service';
import {ChangeRequestService} from '../../../../change-request/change-request.service';
import {FormsConfigurationService} from '../../../../core/services/configurations/services/forms-configuration.service';

describe('CbRulesDialogComponent', () => {
  let component: CbRulesDialogComponent;
  let fixture: ComponentFixture<CbRulesDialogComponent>;
  let mockStore: MockStore;
  let mockCaseObjectSelector1: MemoizedSelector<MyChangeState, {}>;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CbRulesDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, FormsModule, MatDialogModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {Id: 1, type: 'test'}},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: UserAuthorizationService, useClass: UserAuthorizationServiceMock},
        {provide: ManageCbRulesService, useClass: ManageCbRulesServiceMock},
        {provide: StoreHelperService, useClass: StoreHelperServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: FormsConfigurationService, useClass: FormsConfigurationServiceMock},
        MCFormGroupService,
        provideMockStore()
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CbRulesDialogComponent);
    mockStore = TestBed.inject(MockStore);
    mockCaseObjectSelector1 = mockStore.overrideSelector(
      selectCaseActionState,
      false
    );

    component = fixture.componentInstance;
    component.cbRuleSetFormControl = new FormControl('initial');
    component.cbRuleSetControlConfiguration = {name: {}, rules: {}};
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTotalCBRulesSetData ', () => {
    const selectedRule = {label: '', ID: '', help: '', name: '', selected: false};
    const event = {checked: true};
    component.rulesForSelectedRuleSet = [{
      label: 'test',
      ID: '123',
      help: 'test',
      name: 'test',
      selected: true
    }, {
      label: 'test1',
      ID: '12213',
      help: 'test21',
      name: 'tes21t',
      selected: false
    }];
    component.onSelectRule(selectedRule, event);
    expect(component.totalCountCbRulesSelected).toBe(1);
  });

  it('should have call onSelectRule when getTotalCBRulesSetData is triggered', () => {
    spyOn(component, 'setSelectedRules');
    component.totalRuleSets = [{
        name : 'initial',
        rules: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
      rule: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }],
      help: 'rule set name'},
      {
        name : 'initial',
        rules: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        rule: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        help: 'rule set name'}];
    component.getTotalCBRulesSetData();
    expect(component.setSelectedRules).toHaveBeenCalled();
  });

  it('should call onClickSaveCBRuleSet', () => {
    spyOn(component.dialogRef, 'close');
    component.rulesForSelectedRuleSet = [{
      label: 'test',
      ID: '123',
      help: 'test',
      name: 'test',
      selected: true
    }];
    component.saveCaseAction = 'test';
    component.onClickSaveCBRuleSet();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog when cancel is triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call setRulesForSelectedRuleSet & set selected value', () => {
    component.totalRuleSets = [{
      name : 'initial',
      help: 'help string',
      rules: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }],
      rule: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }]
    },
      {
        name : 'initial',
        rules: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        rule: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        help: 'rule set name'}];
    component.rulesForSelectedRuleSet = [{
      label: 'test',
      ID: '123',
      help: 'test',
      name: 'initial',
      selected: false
    }];
    component.setRulesForSelectedRuleSet();
    expect(component.rulesForSelectedRuleSet[0].name).toBe('rule name');
  });

  it('should have set value to cbRuleSetFormControl', () => {
    component.ruleSetControlEnumeration = [
      {value: 'abc', label: 'xyz'},
      {value: 'xyz', label: 'abc'}];
    component.selectedCBRuleSet = {
      rule_set_name: 'toast',
      rules: []
    };
    component.setSelectedRuleSet();
    expect(component.cbRuleSetFormControl.value).toEqual('toast');
  });

  it('it should call setSelectedRules', () => {
    component.totalRuleSets = [{
      name : 'initial',
      help: 'rule set name',
      rules: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }],
      rule: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }]
      },
      {
        name : 'initial',
        help: 'rule set name',
        rules: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        rule: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
       }];
    component.selectedCBRuleSet = {rule_set_name: 'test 123', rules: ['test 123']};
    component.rulesForSelectedRuleSet = [{
      label: 'test 123',
      ID: '123',
      help: 'test',
      name: 'test 123'
    }];
    component.setSelectedRules();
    expect(component.selectedCBRuleSet.rule_set_name).toBe('test 123');
  });
  it('it should call setSelectedRules', () => {
    component.selectedCBRuleSet = {rule_set_name: 'test 123', rules: ['test 123', 'test 124']};
    component.rulesForSelectedRuleSet = [{
      label: 'test 123',
      ID: '123',
      help: 'test',
      name: 'test 123',
      selected: false
    }];
    component.selectRules();
    expect(component.rulesForSelectedRuleSet[0].selected).toBe(true);
  });
});

class ServiceParametersServiceMock {
  getAgendaItemsRuleset(service: string, category?: string, parameter?: string): any {
    return [{'label': 'rule set name', 'name': 'rule set name'}, {'label': 'rule set name', 'name': 'rule set name'}];
  }

  getTotalCBRulesSetData(service: string, category?: string, parameter?: string): any {
    const obj = [{'label': 'rule set name', 'name': 'rule set name'}, {
      'label': 'rule set name',
      'name': 'rule set name'
    }];
    return obj;
  }

  getAgendaItemsQuestionaire(service: string, category?: string, parameter?: string): any {
    return {
      help: 'help',
      rule: [{
        label: 'test',
        ID: '123',
        help: 'test',
        name: 'test',
        selected: false
      }, {
        label: 'tes1t',
        ID: '1231',
        help: 'tes1t',
        name: 'tes1t',
        selected: true
      }]

    };
  }

  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }
}

class UserAuthorizationServiceMock {
  getCaseActions(type) {
    return Observable.of({'caseActions': []});
  }
}

class ManageCbRulesServiceMock {
  updateCBRuleSet(ruleSetElement, agendaItemID, action: string, type: string) {
    return of({});
  }
  getCBRuleset() {
    return of([{
      name : 'initial',
      help: 'rule set name',
      rules: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }],
      rule: [{
        label: 'rule Label',
        help: 'help String',
        name: 'rule name'
      }]},
      {
        name : 'initial',
        help: 'rule set name',
        rules: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }],
        rule: [{
          label: 'rule Label',
          help: 'help String',
          name: 'rule name'
        }]
      }
        ]);
  }
}
class StoreHelperServiceMock {
  getButtonSelector() {
    return false;
  }
}
class ChangeRequestServiceMock {
  updateCBRuleSetForCr() {
    return of();
  }
}
class FormsConfigurationServiceMock {
  createChangeRequestFormGroup(changeRequestOj, emptyArray1, emptyArray2) {
    return {};
  }
  getFormParameters(caseObject) {
    return {};
  }
}
