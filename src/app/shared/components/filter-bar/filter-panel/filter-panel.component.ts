import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';


import {HelpersService} from '../../../../core/utilities/helpers.service';
import {FormControlConfiguration} from '../../../models/mc-configuration.model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {FilterBarService} from '../filter-bar.service';
import {HistoryModel} from '../../../models/mc-history-model';
import {HistoryService} from '../../../../core/services/history.service';
import {CaseObjectFilterConfiguration, FilterOptions} from '../../../models/mc-filters.model';

@Component({
  selector: 'mc-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {
  @Input()
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  @Input()
  caseObject: string;
  @Input()
  secondaryCaseObjectType: string;
  @Input()
  caseObjectCurrentFilterFormGroup: FormGroup;
  @Input()
  releasePackageSourceSystemID: string;
  @Input()
  caseObjectListCount: number;
  @Input()
  searchInProgress: boolean;
  @Input()
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  @Input()
  changeDetailsPanelHeader: string;
  @Input()
  filterHelp: Info;
  @Input()
  layoutType: string;
  @Output() readonly filterPanelAccepted: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @Output() readonly filterPanelOptionsRemoved: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @Output() readonly filterPanelCancelled: EventEmitter<boolean> = new EventEmitter<boolean>();

  showPanel: boolean;
  filtersHistoryFormGroup: FormGroup;
  filtersHistory: FilterOptions;

  constructor(private readonly helpersService: HelpersService,
              private readonly userProfileService: UserProfileService,
              private readonly filterBarService: FilterBarService,
              private readonly historyService: HistoryService) {
    this.showPanel = false;
  }

  ngOnInit() {
    this.loadFiltersHistory();
    this.createOverlayContainer();
  }

  createOverlayContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');
    document.body.appendChild(container);
  }

  loadFiltersHistory(): void {
    const caseObjectState = this.userProfileService.getCaseObjectState(this.caseObject);
    this.filtersHistory = caseObjectState['commonCaseObjectState']['filterHistory'];
    this.filtersHistoryFormGroup = this.historyService.createHistoryFormGroup(new HistoryModel(this.filtersHistory));
    this.filtersHistoryFormGroup.valueChanges.subscribe((filtersHistory) => {
      caseObjectState['commonCaseObjectState']['filterHistory'] = filtersHistory;
      this.userProfileService.updateCaseObjectState(caseObjectState, this.caseObject);
    });
  }

  applyFilter(): void {
    this.filterPanelAccepted.emit(this.caseObjectCurrentFilterFormGroup.getRawValue());
  }

  optionRemoved(event) {
    this.filterPanelOptionsRemoved.emit(event);
  }

  cancelFilter() {
    this.filterPanelCancelled.emit(true);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.filterPanelCancelled.emit(true);
  }
}
