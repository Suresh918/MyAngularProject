import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CaseObjectOverview} from '../../case-object-list/case-object-list.model';
import {FormControlConfiguration} from '../../../models/mc-configuration.model';
import {ActionOverview} from '../../../../agenda/agenda.model';

@Component({
  selector: 'mc-agenda-action-panel',
  templateUrl: './agenda-action-panel.component.html',
  styleUrls: ['./agenda-action-panel.component.scss']
})
export class AgendaActionPanelComponent implements OnInit {
  @Input()
  agendaItemCategory: string;

  @Input()
  agendaItemActions: ActionOverview[];

  @Input()
  expanded: boolean;

  @Input()
  linkedCaseObjectActions: ActionOverview[];

  @Input()
  linkedCaseObject: CaseObjectOverview;

  intialAgendaItemActions = [];
  intialCaseObjectActions = [];
  totalActionsCount = 0;
  openAcceptedCount = 0;

  toggleActionViewControl: FormControl;
  toggleActionViewConfiguration: FormControlConfiguration;

  constructor() {
  }

  ngOnInit() {
    this.intialAgendaItemActions = this.agendaItemActions ? [...this.agendaItemActions] : [];
    this.intialCaseObjectActions = this.linkedCaseObjectActions ? [...this.linkedCaseObjectActions] : [];
    this.toggleActionViewControl = new FormControl('OPEN-ACCPTED');
    this.setActions();
  }

  setActions() {
    this.agendaItemActions = [...this.intialAgendaItemActions];
    this.linkedCaseObjectActions = [...this.intialCaseObjectActions];
    this.totalActionsCount = this.intialAgendaItemActions.length + this.intialCaseObjectActions.length;
    this.agendaItemActions = this.agendaItemActions.filter((action) => (action.status === 'OPEN' || action.status === 'ACCEPTED'));
    this.linkedCaseObjectActions = this.linkedCaseObjectActions.filter((action) => (action.status === 'OPEN' || action.status === 'ACCEPTED'));
    this.openAcceptedCount = this.agendaItemActions.length + this.linkedCaseObjectActions.length;
    if (this.toggleActionViewControl.value === 'ALL') {
      this.agendaItemActions = [...this.intialAgendaItemActions];
      this.linkedCaseObjectActions = [...this.intialCaseObjectActions];
    }
  }

  onListSelectionChange() {
    this.setActions();
  }


}

