import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgendaItemDetail} from '../../../../../agenda/agenda.model';
import {HelpersService} from '../../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-creator-change-request-decisions',
  templateUrl: './creator-change-request-decisions.component.html',
  styleUrls: ['./creator-change-request-decisions.component.scss']
})
export class CreatorChangeRequestDecisionsComponent implements OnInit {
  @Input()
  decisions: AgendaItemDetail[];
  @Input()
  crID: string;
  @Input()
  crTitle: string;
  @Input()
  isExpanded: boolean;
  @Output()
  readonly agendaItemLinked: EventEmitter<AgendaItemDetail> = new EventEmitter<AgendaItemDetail>();
  @Output()
  readonly decisionUpdated: EventEmitter<void> = new EventEmitter<void>();
  HelpersService = HelpersService;

  constructor() {
  }

  ngOnInit() {
  }

  onAgendaItemLinked(agendaItemDetail: AgendaItemDetail) {
    this.agendaItemLinked.emit(agendaItemDetail);
  }

  onDecisionUpdated() {
    this.decisionUpdated.emit();
  }
}
