import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';

import {AgendaSummary} from '../../models/agenda.model';
import {AgendaService} from '../../../core/services/agenda.service';
import {Categories, Category} from '../../models/mc-presentation.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-agenda-card',
  templateUrl: './agenda-overview-card.component.html',
  styleUrls: ['./agenda-overview-card.component.scss']
})
export class AgendaOverviewCardComponent implements OnInit {
  caseObjectData: AgendaSummary;
  plannedStartTime: string;
  @ViewChild('inputElement') inputElement;
  @Input()
  showSelector: boolean;
  @Input()
  isDashboardWidget: boolean;
  agendaItemsOverviewData: Categories | Category;
  progressBar: boolean;
  duration: string;
  agendaStatus: string;
  @Output()
  readonly agendaItemClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly agendaOverviewItemClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly changeRadioButtonCaseObject: EventEmitter<AgendaSummary> = new EventEmitter();
  listClicked: boolean;

  constructor(public readonly agendaService: AgendaService,
              public readonly router: Router,
              private readonly configurationService: ConfigurationService,
              public readonly serviceParametersService: ServiceParametersService) {
    this.listClicked = false;
  }

  get caseObject() {
    return this.caseObjectData;
  }

  /*  @Input()
    caseObject: AgendaSummary;*/
  @Input()
  set caseObject(caseObject: AgendaSummary) {
    this.caseObjectData = caseObject;
    if (caseObject && caseObject.startDate && caseObject.finishDate) {
      const startDate = new Date(caseObject.startDate);
      this.plannedStartTime = `${('0' + startDate.getHours()).slice(-2)}:${('0' + startDate.getMinutes()).slice(-2)}`;
      if (caseObject.finishDate && caseObject.startDate) {
        this.duration = moment.duration(moment(new Date(caseObject.finishDate)).diff(moment(new Date(caseObject.startDate)))).toISOString();
      }
    }
    this.getAgendaStatusValueByName(this.caseObject.status);
  }

  ngOnInit() {
  }

  agendaOverviewPanelOpened(event) {
    event.stopPropagation();
    this.progressBar = true;
    this.agendaService.getAgendaItemsOverviewDetails(this.caseObject.ID).subscribe(agendaOverviewDetails => {
      this.agendaItemsOverviewData = agendaOverviewDetails as Categories | Category;
      this.progressBar = false;
    });
  }

  navigateToAgenda() {
    if (!this.showSelector) {
      this.agendaItemClicked.emit(this.caseObject.ID);
    } else {
      this.inputElement.checked = true;
      this.changeRadioButtonCaseObject.emit(this.caseObject);
    }
  }

  onClickAgendaLabel() {
    this.agendaItemClicked.emit(this.caseObject.ID);
  }

  agendaListItemClicked($event) {
    this.router.navigate([]).then(() => {
      window.open('agendas/agenda-items' + '/' + $event.ID, '_blank');
    });
  }

  onSelectAgenda() {
    this.changeRadioButtonCaseObject.emit(this.caseObject);
  }

  getAgendaStatusValueByName(status: string): string {
    this.agendaStatus = '';
    if (status) {
      this.agendaStatus = this.configurationService.getFormFieldOptionDataByValue('Agenda', 'generalInformation.status', status);
    }
    return this.agendaStatus;
  }

}

