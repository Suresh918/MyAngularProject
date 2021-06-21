import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {CreatorCrDecisionComponent} from '../cr-decision.component';
import {AgendaItemFormConfiguration} from '../../../../../../../shared/models/mc-configuration.model';
import {AgendaItemDetail, AgendaOverview} from '../../../../../../../agenda/agenda.model';
import {AgendaItem, CaseObject} from '../../../../../../../shared/models/mc.model';
import {MCAddCbMeetingDialogComponent} from '../../../../../../../shared/components/mc-add-cb-meeting-dialog/mc-add-cb-meeting-dialog.component';
import {ServiceParametersService} from '../../../../../../../core/services/service-parameters.service';
import {MCFormGroupService} from '../../../../../../../core/utilities/mc-form-group.service';
import {PurposeHelperService} from '../../../../../../../core/utilities/purpose-helper.service';
import {UserAuthorizationService} from '../../../../../../../core/services/user-authorization.service';
import {MyChangeState} from '../../../../../../../shared/models/mc-store.model';
import {ConfigurationService} from '../../../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-creator-cr-offline-decision',
  templateUrl: './cr-offline-decision.component.html',
  styleUrls: ['./cr-offline-decision.component.scss']
})
export class CreatorCrOfflineDecisionComponent extends CreatorCrDecisionComponent implements OnInit {
  agendaItemDetail: AgendaItemDetail;
  agendaItemConfiguration: AgendaItemFormConfiguration;
  agendaItemFormGroup: FormGroup;
  decisionIcon: string;
  decisionStatus: string;
  get item() {
    return this.agendaItemDetail;
  }

  @Input()
  set item(detail: AgendaItemDetail) {
    this.agendaItemDetail = detail;
    if (detail.agendaItem) {
      this.agendaItemCaseObject = new CaseObject(this.item.agendaItem.ID, '', 'AgendaItem');
      if (detail.agendaItem && detail.agendaItem.generalInformation.status === 'NEW') {
        detail.agendaItem.generalInformation.status = '';
      }
      this.agendaItemFormGroup = this.mcFormGroupService.createAgendaItemFormGroup(detail.agendaItem);
      this.setStatusLabel();
      this.decisionIcon = this.purposeHelperService.getDecisionIcon(detail.agendaItem.generalInformation.status);
    }
  }
  @Output()
  readonly agendaItemLinked: EventEmitter<AgendaItemDetail> = new EventEmitter<AgendaItemDetail>();
  @Output()
  readonly decisionUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(public readonly serviceParametersService: ServiceParametersService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly matDialog: MatDialog,
              public readonly purposeHelperService: PurposeHelperService,
              private readonly configurationService: ConfigurationService,
              public readonly userAuthorizationService: UserAuthorizationService,
              public readonly appStore: Store<MyChangeState>) {
    super(purposeHelperService);
  }

  ngOnInit() {
    this.agendaItemConfiguration = this.configurationService.getFormFieldParameters('AgendaItem') as AgendaItemFormConfiguration;
  }
  onClickCommunicateDecision() {
    let dialogRef: MatDialogRef<MCAddCbMeetingDialogComponent>;
    let agendaItemDetail: AgendaItemDetail;
    dialogRef = this.matDialog.open(MCAddCbMeetingDialogComponent, {
      width: '90rem',
      data: {
        changeRequestId: this.crID,
        changeRequestTitle: this.crTitle,
        type: 'Offline',
        agendaItemId: this.item.agendaItem.ID
      },
      panelClass: 'add-cb-meeting-dialog'
    });
    dialogRef.afterClosed().subscribe((agendaOverview: AgendaOverview) => {
      agendaItemDetail = agendaOverview.Offline.agendaItemsOverview[0].agendaItemDetails.find(offlineItem => offlineItem.agendaItem.ID === this.item.agendaItem.ID);
      this.agendaItemLinked.emit(agendaItemDetail);
    });
  }

  onDecisionUpdated(res: AgendaItemDetail) {
    if (res && res.agendaItem) {
      this.item = {
        ...this.item,
        agendaItem: res.agendaItem
      };
      this.decisionIcon = this.getDecisionIcon();
      this.decisionUpdated.emit();
    }
  }

  getDecisionIcon(): string {
    const status = this.agendaItemFormGroup.get('generalInformation.status').value;
    /*if (status && status.toUpperCase() !== 'NEW') {
      return this.purposeHelperService.getDecisionIcon(status);
    }
    return 'help_outline';*/
    return this.purposeHelperService.getDecisionIcon(status);
  }

  setStatusLabel() {
    const status = this.agendaItemDetail.agendaItem.generalInformation.status;
      this.decisionStatus = this.configurationService.getFormFieldOptionDataByValue('AgendaItem',
        'agendaItem.offlineDecision', status, 'label');
  }
}
