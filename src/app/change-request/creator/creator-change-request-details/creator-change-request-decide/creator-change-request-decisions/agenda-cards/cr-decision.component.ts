import {Component, Input} from '@angular/core';

import {AgendaItemDetail} from '../../../../../../agenda/agenda.model';
import {CaseObject} from '../../../../../../shared/models/mc.model';
import {PurposeHelperService} from '../../../../../../core/utilities/purpose-helper.service';

@Component({
  selector: 'mc-creator-cr-decision',
  template: ``
})
export class CreatorCrDecisionComponent {
  @Input()
  crID: string;
  @Input()
  crTitle: string;
  agendaItemDetail: AgendaItemDetail;
  isItemExpanded: boolean;
  agendaItemCaseObject: CaseObject;
  purposeIcon: string;
  purposeLabel: string;
  purposeResultDetails: string;
  purpose: string;

  constructor(public readonly purposeHelperService: PurposeHelperService) {
    this.isItemExpanded = true;
  }

  get item() {
    return this.agendaItemDetail;
  }

  @Input()
  set item(data: AgendaItemDetail) {
    this.agendaItemDetail = data;
    this.setPurposeDetails();
  }

  @Input()
  set isExpanded(expanded: boolean) {
    this.isItemExpanded = expanded;
  }

  setPurposeDetails() {
    this.purposeIcon = this.purposeHelperService.getStatusIcon(this.item);
    this.purposeLabel = this.purposeHelperService.getPurposeLabel(this.item);
    this.purposeResultDetails = this.purposeHelperService.getPurposeResultDetails(this.item);
    this.purpose = this.purposeHelperService.getPurposeResultDetails(this.item, true);
  }

  toggleAgendaItemView() {
    event.stopPropagation();
    this.isItemExpanded = !this.isItemExpanded;
  }

  navigateToAgenda(id) {
    window.open(`/agendas/${id}`, '_blank');
  }
}
