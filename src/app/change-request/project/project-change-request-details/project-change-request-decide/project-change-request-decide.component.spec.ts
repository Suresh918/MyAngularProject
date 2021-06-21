import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {provideMockStore} from '@ngrx/store/testing';
import {ActivatedRoute, Params, Router, RouterModule} from '@angular/router';
import {of, Subject} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {UserAuthorizationService} from '../../../../core/services/user-authorization.service';
import {ProjectChangeRequestDecideComponent} from './project-change-request-decide.component';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {AgendaService} from '../../../../core/services/agenda.service';
import {ChangeRequestService} from '../../../change-request.service';
import {metaReducers, reducers} from '../../../../store';
import {AgendaItemDetail} from '../../../../agenda/agenda.model';

import {
  ChangeRequestFormConfiguration, FormControlConfiguration,
} from '../../../../shared/models/mc-configuration.model';

describe('ProjectChangeRequestDecideComponent', () => {
  let component: ProjectChangeRequestDecideComponent;
  let fixture: ComponentFixture<ProjectChangeRequestDecideComponent>;
  let params: Subject<Params>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of({}), close: null});
  const dialogMock = {
    open: () => {
    },
    close: () => {
    }
  };
  beforeEach(async () => {
    params = new Subject<Params>();
    params.next({id: 1});
    await TestBed.configureTestingModule({
      declarations: [ProjectChangeRequestDecideComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, RouterModule, RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 1}),
          }
        },
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: UserAuthorizationService, useClass: UserAuthorizationServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: AgendaService, useClass: AgendaServiceMock},
        {provide: Router, useValue: mockRouter},
        { provide: MatDialog, useValue: dialogMock },
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestDecideComponent);
    component = fixture.componentInstance;
    component.id = '1';
    component.addOfflineDecisionButtonStatus = 'OFFLINE-DECISION-NOT-CREATED';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAgendaItems, when trigger onChanges', () => {
    component.changeRequestConfiguration = {} as ChangeRequestFormConfiguration;
     component.changeRequestConfiguration['change_owner_type'] = {
       help: {
         help: {
           message: 'test'
         }
       }
     } as any;
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(1),
      testID: new FormControl(''),
      change_owner_type: new FormControl('CREATOR')
    });
    const simpleChange = {
      changeRequestFormGroup: new SimpleChange(null, new FormGroup({change_owner_type: new FormControl('CREATOR')}), false),
      id: new SimpleChange('1', '2', false)
    };
    component.ngOnChanges(simpleChange);
    fixture.detectChanges();
    expect(component.getAgendaItems()).toHaveBeenCalled();
  });

  it('should set tooltip when decision status is changed', () => {
    component.setAddOfflineDecisionState('OFFLINE-DECISION-STILL-POSSIBLE');
    expect(component.addOfflineDecisionTooltip).toBe('Override Last Decision');
  });

  it('should set tooltip when decision status is changed', () => {
    component.setAddOfflineDecisionState('OFFLINE-DECISION-IN-PROGRESS');
    expect(component.addOfflineDecisionTooltip).toBe('First Complete Offline Decision');
  });

  it('should set default tooltip when decision status is empty', () => {
    component.setAddOfflineDecisionState('');
    expect(component.addOfflineDecisionTooltip).toBe('Not Possible to Add Offline Decision');
  });

  it('should navigate when editCaseObject is triggered', () => {
    component.openAgenda('1');
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should open openCBMeetingDialog dialog, when CB meeting button is clicked', () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openCBMeetingDialog();
    expect(component.matDialog.open).toHaveBeenCalled();
  });


  it('should emit getAddDecisionState, when  AgendaItem is Linked', () => {
    const agendaItemDetail = {
      agendaItem: {ID: '123'}
    } as AgendaItemDetail;
    component.loadedDecisions = [agendaItemDetail];
    spyOn(component.getAddDecisionState, 'emit');
    component.onAgendaItemLinked(agendaItemDetail);
    expect(component.getAddDecisionState.emit).toHaveBeenCalled();
  });

  it('should emit getAddDecisionState, when  clicked on AddOfflineDecision', () => {
    spyOn(component.getAddDecisionState, 'emit');
    component.onAddOfflineDecision();
    expect(component.getAddDecisionState.emit).toHaveBeenCalled();
  });

  it('should emit getAddDecisionState when decision status is updated', () => {
    spyOn(component.getAddDecisionState, 'emit');
    component.onDecisionUpdated();
    expect(component.getAddDecisionState.emit).toHaveBeenCalled();
  });

  it('should emit  setPriorityStatus when title is updated', () => {
    const event = {id: 123, implementation_priority: 'test'};
    spyOn(component.setPriorityStatus, 'emit');
    component.setPriorityInTitle(event);
    expect(component.setPriorityStatus.emit).toHaveBeenCalledWith('test');
  });
});

class ChangeRequestServiceMock {
  getLinkedDecisions(id) {
    return of([
      {
        "agendaItem":{
          "ID":"13801",
          "purpose":"OFFLINE-DECISION",
          "category":"CB",
          "plannedDuration":"PT0S",
          "generalInformation":{
            "title":"New CR",
            "status":"APPROVED",
            "lastModifiedOn":"2021-05-27T14:28:17.086Z"
          },
          "minutes":null
        }
      }
    ]);
  }
}

class HelpersServiceMock {
  getPageTitleObject() {
  }
}

class AgendaServiceMock {
  getAgendaForAgendaItem(id) {
    return of('123');
  }

  createOfflineAgendaItem({}) {
    return of({ID: '123'});
  }
}

class UserAuthorizationServiceMock {
  getAuthorizedCaseActionsForId(id, CR, AI) {
    return of({
      cases: [{caseActions: 'test'}]
    });
  }
}
