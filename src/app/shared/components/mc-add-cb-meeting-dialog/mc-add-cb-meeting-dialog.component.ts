import {AfterViewInit, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

import {AgendaSummary} from '../../models/agenda.model';
import {Agenda, AgendaItem} from '../../models/mc.model';
import {AgendaService} from '../../../core/services/agenda.service';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {AgendaItemDetail, AgendaOverview} from '../../../agenda/agenda.model';
import {AggregatedAgendaItem} from '../../models/mc-presentation.model';

@Component({
  selector: 'mc-add-cb-meeting-dialog',
  templateUrl: './mc-add-cb-meeting-dialog.component.html',
  styleUrls: ['./mc-add-cb-meeting-dialog.component.scss']
})
export class MCAddCbMeetingDialogComponent implements OnInit, AfterViewInit {
  defaultFilterQuery: string;
  filterQuery: string;
  orderQuery: string;
  progressBar: boolean;
  caseObjectList: AgendaSummary[];
  lastUpdatedStartindex: number;
  totalItems: number;
  listStartIndex: number;
  listSize: number;
  sectionList: any[];
  sectionProgressBar: boolean;
  @Output()
  readonly resultsLengthChange: EventEmitter<number> = new EventEmitter();
  @Output()
  readonly agendaClick: EventEmitter<AgendaItem> = new EventEmitter<AgendaItem>();
  userSearchControl: FormControl;
  userSearchControlConfiguration: FormControlConfiguration;
  private _pageScrolled: boolean;

  constructor(public readonly agendaService: AgendaService,
              public readonly agendaItemService: AgendaItemService,
              public dialogRef: MatDialogRef<MCAddCbMeetingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listStartIndex = 0;
    this.listSize = 8;
  }

  ngAfterViewInit() {
    this.defaultFilterQuery = 'generalInformation.status in ("ASSIGNED", "COMMUNICATED", "PREPARE-MINUTES") and category="CB"';
    this.orderQuery = 'startDateTime desc';
    this.filterQuery = this.defaultFilterQuery;
    this.getAgendaOverviewList();
    this.userSearchControl.valueChanges.pipe(
      debounceTime(1000))
      .subscribe(res => {
        if (res && res.length > 0) {
          let usersList = '';
          res.forEach((user, index) => {
            usersList = usersList + user.userID + ((index !== res.length - 1) ? ',' : '');
          });
          this.filterQuery = this.defaultFilterQuery + ' and ((generalInformation.createdBy.userID in ( "' + usersList + '" ))) ';
        } else {
          this.filterQuery = this.defaultFilterQuery;
        }
        this.listStartIndex = 0;
        this.getAgendaOverviewList();
      });
  }

  onCreatedFilter(event) {

  }

  ngOnInit() {
    this.progressBar = false;
    this._pageScrolled = false;
    this.caseObjectList = [];
    this.userSearchControl = new FormControl([]);
    this.userSearchControlConfiguration = {
      'ID': 'creatorSearch',
      'placeholder': 'Creator',
      'label': 'Creator',
      'help': 'Creator Search Help'
    };

  }

  getAgendaOverviewList() {
    this.progressBar = true;
    this.agendaService.getAgendasList('', '', this.listStartIndex, this.listSize, this.filterQuery, this.orderQuery).subscribe((res) => {
      this.progressBar = false;
      this.listStartIndex = this.listSize + this.listStartIndex;
      this.progressBar = false;
      this.caseObjectList = (this._pageScrolled) ? this.caseObjectList.concat(res.aggregatedAgendas as AgendaSummary[]) : res.aggregatedAgendas as AgendaSummary[];
      this._pageScrolled = false;
      this.totalItems = res.totalItems;
      this.resultsLengthChange.emit(this.totalItems);
      this.progressBar = false;
    });
  }

  getSectionDetails(agendaID: string) {
    this.sectionList = [];
    this.sectionProgressBar = true;
    this.agendaService.getSectionDetails(agendaID).subscribe((res) => {
      this.sectionProgressBar = false;
      this.sectionList = res;
    });
  }

  addToMeeting(agenda: AgendaSummary, sectionItem: any) {
    const agendaItemElement = this.getAgendaItemElement(agenda, sectionItem);
    if (this.data.agendaItemId) {
      this.agendaItemService.updateOfflineAgendaItem(
        this.getPayloadToCreateAgenda(agenda, agendaItemElement),
        agenda.ID)
        .subscribe(
          (agendaOverview: AgendaOverview) => {
             const currentAgendaItem = agendaOverview[this.data.type].agendaItemsOverview[0].agendaItemDetails.find((item) => item.agendaItem.ID === this.data.agendaItemId);
             currentAgendaItem['agenda'] = {generalInformation: {title: agenda.title}, ID: agenda.ID, plannedStartDate: agenda.startDate};
            this.dialogRef.close(agendaOverview);
          });
    } else {
      this.agendaItemService.createAgendaItem(
        this.getPayloadToCreateAgenda(agenda, agendaItemElement),
        agenda.ID)
        .subscribe(
          (agendaOverview: AgendaOverview) => {
            this.dialogRef.close(agendaOverview);
          });
    }
  }

  getAgendaItemElement(agenda: Agenda, sectionItem: any) {
    if (this.data.type === 'Offline') {
      return {
        'purpose': 'OFFLINE-DECISION',
        'section': sectionItem.name
      };
    } else if (this.data.type === 'Closed') {
      return {
        'purpose': 'CR-CLOSED-DISCUSSION'
      };
    }
    return {
      'category': agenda.category,
      'section': sectionItem.name,
      'purpose': 'ONLINE-DECISION'
    };
  }

  close() {
    this.dialogRef.close();
  }

  onScrollDown() {
    if (this.totalItems > this.caseObjectList.length && this.lastUpdatedStartindex !== this.listStartIndex) {
      this._pageScrolled = true;
      this.getAgendaOverviewList();
    }
  }

  getPayloadToCreateAgenda(agenda, agendaItemElement) {
    const aggregatedElement: AggregatedAgendaItem[] = new Array<AggregatedAgendaItem>();
    const aggregatedAgendaItem = new AggregatedAgendaItem();
      if (agenda && this.data.changeRequestId && this.data.changeRequestId) {
        // aggregatedAgendaItem.agendaItem.category = agenda.category;
        aggregatedAgendaItem.agendaItem.section = agendaItemElement.section;
        aggregatedAgendaItem.agendaItem.purpose = agendaItemElement.purpose;
        if (this.data.agendaItemId) {
          aggregatedAgendaItem.agendaItem.ID = this.data.agendaItemId;
        }
        aggregatedAgendaItem.linkedObjectSummary.ID = this.data.changeRequestId;
        aggregatedAgendaItem.linkedObjectSummary.revision = '';
        aggregatedAgendaItem.linkedObjectSummary.type = 'ChangeRequest';
        aggregatedAgendaItem.linkedObjectSummary.title = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.title ? this.data.changeRequestDetails.title : (this.data.changeRequestTitle || '');
        aggregatedAgendaItem.linkedObjectSummary.status = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.status ? this.data.changeRequestDetails.status.toString() : '';
        aggregatedAgendaItem.linkedObjectSummary.priority = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.analysis_priority ? this.data.changeRequestDetails.analysis_priority : 0;
        aggregatedAgendaItem.linkedObjectSummary.totalOpenActions = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.open_actions ? this.data.changeRequestDetails.open_actions : 0;
        aggregatedAgendaItem.linkedObjectSummary.implementationPriority = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.implementation_priority ? this.data.changeRequestDetails.implementation_priority : 0;
        aggregatedAgendaItem.linkedObjectSummary.CBGroups = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.change_boards ? this.data.changeRequestDetails.change_boards : [];
        aggregatedAgendaItem.linkedObjectSummary.CBRuleSet = this.data && this.data.changeRequestDetails && this.data.changeRequestDetails.change_board_rule_set ? this.data.changeRequestDetails.change_board_rule_set : {};
      }
    aggregatedElement.push(aggregatedAgendaItem);
      return aggregatedElement;
  }
}
