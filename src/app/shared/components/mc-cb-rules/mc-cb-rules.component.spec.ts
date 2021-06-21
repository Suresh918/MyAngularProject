import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {of} from 'rxjs';

import { McCbRulesComponent } from './mc-cb-rules.component';
import {CBRuleSet} from '../../models/mc-presentation.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {CbRulesDialogComponent} from './cb-rules-dialog/cb-rules-dialog.component';
import {metaReducers, reducers} from '../../../store';

describe('McCbRulesComponent', () => {
  let component: McCbRulesComponent;
  let fixture: ComponentFixture<McCbRulesComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });

  const dialogMock = {
    open: () => { },
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ McCbRulesComponent, CbRulesDialogComponent ],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: MatDialog, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
      imports: [ MatDialogModule, HttpClientModule, MatDialogModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot(reducers, {metaReducers})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [CbRulesDialogComponent]} })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McCbRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.cbRulesDataDetails = {
      rule_set_name: 'Test Rule Name',
      rules: ['Help test 1', 'Help test 2']
    } as CBRuleSet;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setHelpText when trigger ngOnChanges', () => {
    spyOn(component, 'setHelpText');
    component.ngOnChanges({control: new SimpleChange(null, {test: 'testValue'}, false)});
    expect(component.setHelpText).toHaveBeenCalled();
  });

  it('should set value to cbRulesDataDetails on trigger setHelpText',  () => {
    component.setHelpText();
    expect(component.cbRulesDataDetails['rulesHelp'][0]).toBe('test rule');
  });

  it('should open dialog when onPressCBRules is triggered ',  () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.onPressCBRules();
    expect(component.dialog.open).toHaveBeenCalled();

  });
});
class ServiceParametersServiceMock {
  getAgendaItemsRuleObj(rule) {
    return {help: 'test rule'};
  }
  getCaseObjectMetaData(service: string, category: string) {
    return of();
  }
}
