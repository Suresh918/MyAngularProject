import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogPosition} from '@angular/material/dialog';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {selectShowFullMenu} from '../../store';
import {MyChangeState, SidePanelState} from '../../shared/models/mc-store.model';
import {AgendaService} from '../../core/services/agenda.service';
import {UrlService} from '../../core/utilities/url.service';
import {AddAgendaWizardComponent} from '../../agenda/shared/add-edit-agenda-wizard/add-agenda-wizard/add-agenda-wizard.component';
import {CaseActionElement, CaseObject} from '../../shared/models/mc.model';
import {UserAuthorizationService} from '../../core/services/user-authorization.service';
import {CaseAction} from '../../shared/models/case-action.model';
import {loadCaseActions} from '../../store/actions/case-object.actions';
import {ConfigurationService} from '../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../change-request/change-request.service';
import {McStatesModel} from '../../shared/models/mc-states-model';
import {UserProfileService} from '../../core/services/user-profile.service';

@Component({
  selector: 'mc-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ],
  providers: [ChangeRequestService]
})
export class MenuComponent implements OnInit, OnDestroy {
  showMenuSubscription$: Subscription;
  showFullMenu: boolean;
  isUserAdmin: boolean;
  isUserChangeSpecialist1: boolean;
  isUserChangeSpecialist2: boolean;
  isSettingsExpanded: boolean;
  isAdminExpanded: boolean;
  selectedPage: string;
  agendaCaseObject: CaseObject;
  changeRequestCaseObject: CaseObject;
  mcState: McStatesModel;

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly agendaService: AgendaService,
              private appStore: Store<MyChangeState>,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly configurationService: ConfigurationService,
              private readonly dialog: MatDialog,
              private readonly urlService: UrlService,
              private readonly userAuthorizationService: UserAuthorizationService,
              private readonly userProfileService: UserProfileService,
              private readonly changeRequestService: ChangeRequestService) {
  }

  ngOnInit() {
    this.selectedPage = '';
    this.showMenuSubscription$ = this.appStore.pipe(select(selectShowFullMenu)).subscribe((res: Boolean) => {
      this.showFullMenu = res && res.valueOf();
    });
    this.isUserAdmin = this.configurationService.hasUserSpecifiedRole('administrator');
    this.isUserChangeSpecialist1 = this.configurationService.hasUserSpecifiedRole('changeSpecialist1');
    this.isUserChangeSpecialist2 = this.configurationService.hasUserSpecifiedRole('changeSpecialist2');
    this.agendaCaseObject = new CaseObject('Agenda', '', 'Agenda');
    this.changeRequestCaseObject = new CaseObject('ChangeRequest', '', 'ChangeRequest');
    // When CR and agenda buttons need to be mapped to case actions, then enable the below line
    // this.fetchCaseActions();
    this.setSidePanelItemsState();
  }

  setSidePanelItemsState(): void {
    this.urlService.currentUrl$.subscribe((url: string) => {
      if (url) {
        this.selectedPage = url;
        this.isSettingsExpanded = (url.indexOf('/settings') > -1);
        this.isAdminExpanded = (url.indexOf('/admin') > -1);
      }
    });
  }

  createChangeRequest(type: string) {
    this.mcState = this.userProfileService.getStatesData();
    this.mcState.changeRequestState.airPbsDialogType = (type !== 'new') ? type : undefined;
    this.userProfileService.updateUserProfileStates(this.mcState);
    this.changeRequestService.createChangeRequest$().subscribe(res => {
      if (res && res.id) {
        window.open('/change-requests/' + res.id, '_blank');
      }
    });
  }

  addAgenda(agendaCategory: string) {
    this.agendaService.createNewAgenda$(agendaCategory).subscribe(agenda => {
      if (agenda) {
        let addAgendaDialogRef: MatDialogRef<AddAgendaWizardComponent>;
        const title = agendaCategory === 'CB' ? 'Create CB Agenda' : 'Create CCB Agenda';
        addAgendaDialogRef = this.dialog.open(AddAgendaWizardComponent, {
          width: '90rem',
          maxHeight: '80vw',
          disableClose: true,
          data: {
            'type': agendaCategory,
            'title': title,
            'agendaId': agenda.ID,
            'agendaMode': 'add'
          },
          position: {top: '3rem'} as DialogPosition
        });
        addAgendaDialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.router.navigate(['agendas/' + data.agendaId]);
          }
        });
      }
    });
  }

  fetchCaseActions() {
    this.userAuthorizationService.getCaseActions('agenda').subscribe((res) => {
      this.storeCaseActions(res['caseActions'] || [], this.agendaCaseObject);
    });
    this.userAuthorizationService.getCaseActions('changerequest').subscribe((res) => {
      this.storeCaseActions(res['caseActions'] || [], this.changeRequestCaseObject);
    });
  }

  storeCaseActions(caseActionsList: CaseActionElement[], caseObject) {
    const caseActionsAllowed = [];
    for (let count = 0; count < caseActionsList.length; count++) {
      caseActionsAllowed.push(new CaseAction(caseObject.type, '', caseObject.type,
        caseActionsList[count].isAllowed, caseActionsList[count].name, caseActionsList[count].mandatoryParameters));
    }
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  ngOnDestroy() {
    if (this.showMenuSubscription$) {
      this.showMenuSubscription$.unsubscribe();
    }
  }
}
