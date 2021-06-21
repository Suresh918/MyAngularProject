import {Injectable} from '@angular/core';
import {AgendaItemDetail} from '../../agenda/agenda.model';
import {PriorityTransformPipe} from '../../shared/pipes/priority-transform.pipe';
import {ServiceParametersService} from '../services/service-parameters.service';
import {ConfigurationService} from '../services/configurations/configuration.service';

@Injectable({
  'providedIn': 'root'
})

export class PurposeHelperService {
  constructor(private readonly serviceParametersService: ServiceParametersService,
              private readonly configurationService: ConfigurationService) {
  }

  getPurposeResultSummary(agendaItemDetail: AgendaItemDetail): string {
    let result = 'Unknown';
    let priority = '', status;
    const priorityPipe = new PriorityTransformPipe(this.configurationService);
    if (agendaItemDetail.agendaItem.generalInformation && agendaItemDetail.agendaItem.generalInformation.status) {
      status = agendaItemDetail.agendaItem.generalInformation.status;
    }
    if (agendaItemDetail.linkedObjectSummary && (agendaItemDetail.linkedObjectSummary.implementationPriority || agendaItemDetail.linkedObjectSummary.implementation_priority) &&
      (agendaItemDetail.linkedObjectSummary.implementationPriority > 0 || agendaItemDetail.linkedObjectSummary.implementation_priority > 0)) {
      priority = ' (' + priorityPipe.transform((agendaItemDetail.linkedObjectSummary.implementationPriority ? agendaItemDetail.linkedObjectSummary.implementationPriority : agendaItemDetail.linkedObjectSummary.implementation_priority)) + ')';
    }
    if (agendaItemDetail && agendaItemDetail.agendaItem && agendaItemDetail.agendaItem.purpose && status) {
      if (agendaItemDetail.agendaItem.purpose.toUpperCase().indexOf('DECISION') > -1) {
        result = this.configurationService.getFormFieldOptionDataByValue('AgendaItem', 'agendaItem.onlineDecision', status, 'label');
        if (status.toUpperCase() === 'APPROVED' || status.toUpperCase() === 'REJECTED') {
          result += priority;
        }
      } else if (agendaItemDetail.agendaItem.purpose.toUpperCase() === 'DISCUSSION') {
        result = this.configurationService.getFormFieldOptionDataByValue('AgendaItem', 'agendaItem.discussion', status, 'label');
      }
    }
    return result;
  }

  getPurposeResultDetails(agendaItemDetail: AgendaItemDetail, excludeMotivation?: boolean): string {
    let result = 'Unknown';
    let conclusion = '', status;
    const agendaItemFinalStatuses = ['APPROVED', 'REJECTED', 'POSTPONED', 'DISCUSSED'];
    if (agendaItemDetail.agendaItem.generalInformation && agendaItemDetail.agendaItem.generalInformation.status &&
      agendaItemFinalStatuses.indexOf(agendaItemDetail.agendaItem.generalInformation.status) > -1) {
      status = agendaItemDetail.agendaItem.generalInformation.status;
    }
    if (agendaItemDetail && agendaItemDetail.agendaItem && agendaItemDetail.agendaItem.minutes &&
      agendaItemDetail.agendaItem.minutes.conclusion && !excludeMotivation) {
      conclusion += '. ' + agendaItemDetail.agendaItem.minutes.conclusion;
    }

    if (agendaItemDetail && agendaItemDetail.agendaItem && agendaItemDetail.agendaItem.purpose && status) {
      if (agendaItemDetail.agendaItem.purpose.toUpperCase().indexOf('DECISION') > -1) {
        result = this.configurationService.getFormFieldOptionDataByValue('AgendaItem',  'agendaItem.onlineDecision', status, 'label');
      } else if (agendaItemDetail.agendaItem.purpose.toUpperCase().indexOf('DISCUSSION') > -1) {
        result = this.configurationService.getFormFieldOptionDataByValue('AgendaItem',  'agendaItem.discussion', status, 'label');
      }
      result += conclusion;
    }
    return result;
  }

  getStatusIcon(agendaItemDetail: AgendaItemDetail): string {
    let status = '';
    if (agendaItemDetail && agendaItemDetail.agendaItem && agendaItemDetail.agendaItem.generalInformation) {
      status = agendaItemDetail.agendaItem.generalInformation.status;
    }
    switch (status && status.toLowerCase()) {
      case 'approved':
      case 'discussed':
        return 'check';
      case 'postponed':
        return 'arrow_forward';
      case 'rejected':
        return 'close';
      default:
        return 'help_outline';
    }
  }

  getDecisionIcon(decision: string) {
    switch (decision && decision.toLowerCase()) {
      case 'approved':
        return 'check';
      case 'rejected':
        return 'clear';
      default:
        return 'help_outline';
    }
  }

  getPurposeLabel(agendaItemDetail: AgendaItemDetail): string {
    // replace with lookup in service parameter
    if (agendaItemDetail && agendaItemDetail.agendaItem && agendaItemDetail.agendaItem.purpose) {
      if (agendaItemDetail.agendaItem.purpose.toUpperCase().indexOf('DECISION') > -1) {
        return 'Decision';
      } else if (agendaItemDetail.agendaItem.purpose.toUpperCase().indexOf('DISCUSSION') > -1) {
        return 'Discussion';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getEnumerationForDiscussion() {
    return [
      {
        'name': 'DISCUSS',
        'label': 'Concluded'
      },
      {
        'name': 'POSTPONE',
        'label': 'Postponed'
      }
    ];
  }
}
