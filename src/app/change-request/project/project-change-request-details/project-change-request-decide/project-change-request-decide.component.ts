import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';

import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {ChangeRequestService} from '../../../change-request.service';
import {AgendaService} from '../../../../core/services/agenda.service';
import {MCAddCbMeetingDialogComponent} from '../../../../shared/components/mc-add-cb-meeting-dialog/mc-add-cb-meeting-dialog.component';
import {AgendaItem, CaseObject} from '../../../../shared/models/mc.model';
import {AgendaItemDetail} from '../../../../agenda/agenda.model';
import {showLoader} from '../../../../store';
import {MyChangeState} from '../../../../shared/models/mc-store.model';
import {UserAuthorizationService} from '../../../../core/services/user-authorization.service';
import {CaseAction} from '../../../../shared/models/case-action.model';
import {loadCaseActions} from '../../../../store/actions/case-object.actions';
import {CaseObjectContext} from '../../../../shared/models/mc-presentation.model';
import {HelpersService} from "../../../../core/utilities/helpers.service";


@Component({
  selector: 'mc-project-change-request-decide',
  templateUrl: './project-change-request-decide.component.html',
  styleUrls: ['./project-change-request-decide.component.scss'],
  providers: [ChangeRequestService]
})

export class ProjectChangeRequestDecideComponent implements OnInit, OnChanges {
  @Input()
  id: string;
  @Input()
  fontChangeTemplate: TemplateRef<any>;
  @Input()
  currentTabIndex: number;
  @Input()
  caseObject: CaseObject;
  @Input()
  changeRequestFormGroup: FormGroup;

  @Input()
  isExpanded: boolean;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  readonly decisionsScrolled: Subject<void> = new Subject<void>();
  agendaItems: AgendaItemDetail[];
  loadedDecisions: AgendaItemDetail[];
  addOfflineDecisionTooltip: string;
  priorityStatus: string;
  disableAddOfflineDecision: boolean;
  loadedDecisionsCount: number;
  loadingDecisions: boolean;
  configuration: ChangeRequestFormConfiguration;
  @Output()
  public readonly getAddDecisionState: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public readonly setPriorityStatus: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly changeRequestService: ChangeRequestService,
              private readonly userAuthorizationService: UserAuthorizationService,
              private readonly helpersService: HelpersService,
              private readonly agendaService: AgendaService,
              private readonly router: Router,
              public readonly matDialog: MatDialog,
              private readonly appStore: Store<MyChangeState>) {
    this.agendaItems = [];
    this.loadedDecisions = [];
    this.loadedDecisionsCount = 0;
    this.loadingDecisions = false;
    this.disableAddOfflineDecision = true;
  }

  @Input()
  set addOfflineDecisionButtonStatus(status: string) {
    this.setAddOfflineDecisionState(status);
  }

  ngOnInit(): void {
    if (this.id) {
      this.getAgendaItems();
      this.getCaseActions();
    }
    this.decisionsScrolled.subscribe(() => {
      this.loadDecisions();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.changeRequestFormGroup && changes.changeRequestFormGroup.currentValue && changes.changeRequestFormGroup.currentValue.get('change_owner_type') && changes.changeRequestFormGroup.currentValue.get('change_owner_type').value) {
      this.configuration = JSON.parse(JSON.stringify(this.changeRequestConfiguration));
      const placeholder = this.helpersService.convertToSentenceCase(this.changeRequestFormGroup.get('change_owner_type').value);
      this.configuration.change_owner_type.help['help'].message = this.configuration.change_owner_type.help['help'].message.split('$CHANGE-OWNER-TYPE').join(placeholder);
    }
    if (changes && changes.id && changes.id.currentValue && changes.id.currentValue !== changes.id.previousValue) {
      this.getAgendaItems();
    }
  }

  getAgendaItems() {
    this.loadingDecisions = true;
    this.changeRequestService.getLinkedDecisions(this.id).subscribe(res => {
      this.agendaItems = res;
      this.loadDecisions();
      this.loadingDecisions = false;
    });
  }

  loadDecisions() {
    if (
      this.agendaItems
      && this.agendaItems.length > 0
      && this.loadedDecisionsCount <= this.agendaItems.length) {
      const maxLimit =
        (this.loadedDecisionsCount + 8) >= this.agendaItems.length ? this.agendaItems.length : (this.loadedDecisionsCount + 8);
      for (let i = this.loadedDecisionsCount ; i < maxLimit; i++) {
        this.loadedDecisions.push(this.agendaItems[i]);
      }
      this.loadedDecisionsCount += 8;
    }
  }

  getCaseActions() {
    this.userAuthorizationService.getAuthorizedCaseActionsForId(this.id, 'CHANGEREQUEST', 'AGENDAITEM').subscribe((data) => {
      if (data && data['cases']) {
        this.storeDecisionsCaseActions(data['cases']);
      }
    });
  }

  storeDecisionsCaseActions(cases) {
    const agendaItemCaseActions = cases.map((obj) => obj.caseActions);
    const caseActions = [];
    let caseActionsPerObject;
    for (let count = 0; count < cases.length; count++) {
      caseActionsPerObject = cases[count].caseActions;
      for (let caseCount = 0; caseCount < cases[count].caseActions.length; caseCount++) {
        caseActions.push(new CaseAction(cases[count].ID, '', 'AgendaItem',
          agendaItemCaseActions[count][caseCount].isAllowed, agendaItemCaseActions[count][caseCount].name, agendaItemCaseActions[count][caseCount].mandatoryParameters));
      }
    }
    this.appStore.dispatch(loadCaseActions({caseActions: caseActions}));
  }

  openAgenda(id: string): void {
    this.agendaService.getAgendaForAgendaItem(id).subscribe((agendaId: string) => {
      this.router.navigate(['agendas/', agendaId]);
    });
  }

  openCBMeetingDialog() {
    let dialogRef: MatDialogRef<MCAddCbMeetingDialogComponent>;
    dialogRef = this.matDialog.open(MCAddCbMeetingDialogComponent, {
      width: '90rem',
      data: {
        'changeRequestId': this.changeRequestFormGroup.get('id').value,
        'changeRequestDetails': this.changeRequestFormGroup.value,
        'type': 'Online'
      },
      panelClass: 'add-cb-meeting-dialog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAgendaItems();
      this.getCaseActions();
    });
  }

  onAddOfflineDecision() {
    this.appStore.dispatch(showLoader(true));
    this.agendaService.createOfflineAgendaItem(this.getLinkedObjectData(this.changeRequestFormGroup.value)).subscribe((agendaItem: AgendaItem) => {
      if (agendaItem && agendaItem.ID) {
        this.loadedDecisionsCount = 0;
        this.loadedDecisions = [];
        this.getAgendaItems();
        this.getCaseActions();
        this.getAddDecisionState.emit();
      }
    });
  }

  getLinkedObjectData(data: any) {
    data.change_board_rule_set.name = data.change_board_rule_set.rule_set_name;
    delete data.change_board_rule_set.rule_set_name;
    return {
      ID: data.id,
      revision: 'AA',
      type: 'ChangeRequest',
      title: data.title ? data.title : '',
      status: data.status ? data.status.toString() : '',
      priority: data.analysis_priority ? Number(data.analysis_priority) : 0,
      totalOpenActions: data.open_actions ? data.open_actions : 0,
      implementationPriority: data.implementation_priority ? data.implementation_priority : 0,
      group: data.change_boards ? data.change_boards : [],
      CBRuleSet: data.change_board_rule_set ? data.change_board_rule_set : {}
    } as CaseObjectContext;
  }

  onAgendaItemLinked(agendaItemDetail: AgendaItemDetail) {
    if (agendaItemDetail) {
      const currentItemIndex = this.loadedDecisions.findIndex(item => item.agendaItem.ID === agendaItemDetail.agendaItem.ID);
      if (currentItemIndex > -1) {
        this.loadedDecisions[currentItemIndex] = agendaItemDetail;
      }
      this.getAddDecisionState.emit();
    }
  }

  setAddOfflineDecisionState(status?: string) {
    switch (status) {
      case 'OFFLINE-DECISION-NOT-CREATED':
        this.disableAddOfflineDecision = false;
        this.addOfflineDecisionTooltip = 'Add Offline Decision';
        break;
      case 'OFFLINE-DECISION-STILL-POSSIBLE':
        this.disableAddOfflineDecision = false;
        this.addOfflineDecisionTooltip = 'Override Last Decision';
        break;
      case 'OFFLINE-DECISION-IN-PROGRESS':
        this.disableAddOfflineDecision = true;
        this.addOfflineDecisionTooltip = 'First Complete Offline Decision';
        break;
      default:
        this.disableAddOfflineDecision = true;
        this.addOfflineDecisionTooltip = 'Not Possible to Add Offline Decision';
        break;
    }
  }

  onDecisionUpdated() {
    this.getCaseActions();
    this.getAddDecisionState.emit();
  }

  setPriorityInTitle(event) {
    if (event && event.id) {
      this.priorityStatus = event.implementation_priority;
      this.setPriorityStatus.emit(this.priorityStatus);
    }
  }

}
