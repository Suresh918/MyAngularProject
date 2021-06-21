import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AgendaService} from '../../../core/services/agenda.service';

@Component({
  selector: 'mc-expansion-panel-list-meetings',
  templateUrl: './mc-expansion-panel-list-meetings.component.html',
  styleUrls: ['./mc-expansion-panel-list-meetings.component.scss']
})
export class MCExpansionPanelListMeetingsComponent implements OnChanges {
  @Input()
  helpText: string;
  @Input()
  header: string;
  @Input()
  meetingsList: any[];
  @Input()
  isBusy: boolean;
  expansionPanelItemConfigurationList: any[];

  constructor(public readonly agendaService: AgendaService,
              private readonly router: Router) {
  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges.meetingsList && simpleChanges.meetingsList.currentValue && simpleChanges.meetingsList.currentValue.length) {
      this.meetingsList = simpleChanges.meetingsList.currentValue;
      this.createItemsList();
    }
  }

  createItemsList() {
    this.expansionPanelItemConfigurationList = this.meetingsList.map((item: any) => {
      const expansionPanelItemConfiguration = new ExpansionPanelItemConfiguration();
      expansionPanelItemConfiguration.ID = item.agendaItem.ID;
      expansionPanelItemConfiguration.title = item.agendaItem.decision;
      expansionPanelItemConfiguration.mainDescription = item.agendaItem.generalInformation.status;
      expansionPanelItemConfiguration.line1 = item.agendaItem.subCategory;
      expansionPanelItemConfiguration.icon = 'event';
      expansionPanelItemConfiguration.isClickable = false;
      return expansionPanelItemConfiguration;
    });
    this.isBusy = false;
  }

  onItemClick(id: string): void {
    this.agendaService.getAgendaForAgendaItem(id).subscribe((agendaId: string) => {
      this.router.navigate(['agendas/', agendaId]);
    });
  }
}
