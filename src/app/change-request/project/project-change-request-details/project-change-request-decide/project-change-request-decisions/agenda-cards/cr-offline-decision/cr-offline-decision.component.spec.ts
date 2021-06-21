import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';
import {CrOfflineDecisionComponent} from './cr-offline-decision.component';
import {ConfigurationService} from '../../../../../../../core/services/configurations/configuration.service';
import {MCFormGroupService} from '../../../../../../../core/utilities/mc-form-group.service';
import {PurposeHelperService} from '../../../../../../../core/utilities/purpose-helper.service';
import {AgendaItemDetail} from '../../../../../../../agenda/agenda.model';
import {of} from 'rxjs';


describe('CrOfflineDecisionComponent', () => {
  let component: CrOfflineDecisionComponent;
  let fixture: ComponentFixture<CrOfflineDecisionComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({agendaOverview: {Offline: {agendaItemsOverview: [{agendaItemDetails: [{agendaItem: {ID: '2'}}]}]}}},
    ), close: null
  });
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CrOfflineDecisionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: ConfigurationService, useClass: ConfigurationServiceMock},
        {provide: MCFormGroupService, useClass: MCFormGroupServiceMock},
        {provide: PurposeHelperService, useClass: PurposeHelperServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrOfflineDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ', () => {
    spyOn(component.decisionUpdated, 'emit');
    component.agendaItemFormGroup = new FormGroup({generalInformation: new FormGroup({status: new FormControl('NEW')})});
    component.onDecisionUpdated({ agendaItem:
        {
          ID: '2',
          generalInformation: {
            status: 'NEW'
          }
        }} as AgendaItemDetail);
    expect(component.decisionUpdated.emit).toHaveBeenCalled();
  });
  it('should ', () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.item = {
      agendaItem:
        {
          ID: '2',
          generalInformation: {
            status: 'NEW'
          }
        }
    } as AgendaItemDetail;
    component.onClickCommunicateDecision();
    expect(component.matDialog.open).toHaveBeenCalled();
  });
  it('should ', () => {
    component.agendaItemFormGroup = new FormGroup({generalInformation: new FormGroup({status: new FormControl('NEW')})});
    expect(component.getDecisionIcon()).toEqual('');
  });
  it('should ', () => {
    component.agendaItemDetail = {agendaItem: {generalInformation: {status: 'data'}}} as AgendaItemDetail;
    component.setStatusLabel();
    expect(component.decisionStatus).toEqual('');
  });
});

class ConfigurationServiceMock {
  getFormFieldParameters(data) {
    return {};
  }

  getFormFieldOptionDataByValue(x, y, z, a) {
    return '';
  }
}

class MCFormGroupServiceMock {
  createAgendaItemFormGroup(data) {
    return new FormGroup({generalInformation: new FormGroup({status: new FormControl('NEW')})});
  }
}

class PurposeHelperServiceMock {
  getDecisionIcon(data) {
    return '';
  }
}
