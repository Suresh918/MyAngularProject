import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MatSort, Sort} from '@angular/material/sort';
import {Store} from '@ngrx/store';

import {UserProfileService} from '../../../core/services/user-profile.service';
import {CaseObjectState, McStatesModel} from '../../models/mc-states-model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {McFiltersModel} from '../../models/mc-filters.model';
import {
  McSortingConfiguration,
  McSortingConfigurationService
} from '../../../core/utilities/mc-sorting-configuration.service';
import {filterOptionsUpdate} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {Categories} from '../../models/mc-presentation.model';
import {CaseObjectServicePath} from '../case-object-list/case-object.enum';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ReleasePackageDetailsService} from '../../../release-package/release-package-details/release-package-details.service';

@Component({
  selector: 'mc-linked-items-panel',
  templateUrl: './mc-linked-items-panel.component.html',
  styleUrls: ['./mc-linked-items-panel.component.scss'],
  providers: [ReleasePackageDetailsService]
})
export class MCLinkedItemsPanelComponent implements OnInit {
  linkedItems: Categories;
  progressBar: boolean;
  icon: string;
  showLoader: boolean;
  selectedSortItem: Sort;
  sortList: string[];
  storedState: McStatesModel;
  selectedTabCaseObject: string;
  userProfileUpdatedState$: Subject<void> = new Subject();
  sortingConfiguration: McSortingConfiguration;
  deepLinkURL: string;
  selectedIDs = [];
  @ViewChild('linkedItemsSortMenu') sortMenu;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  caseObject: string;
  @Input()
  caseObjectId: number;
  @Input()
  allRPNeeded: boolean;
  @Input()
  selectedTabIndex: number;
  @Input()
  overlayXPosition: string;
  @Input()
  overlayYPosition: string;
  @Input()
  objectAsSnakeCase: boolean;
  @Output()
  readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  constructor(private readonly userProfileService: UserProfileService,
              private readonly caseObjectListService: CaseObjectListService,
              private readonly helpersService: HelpersService,
              private readonly mcSortingConfigurationService: McSortingConfigurationService,
              public readonly router: Router,
              public readonly configurationService: ConfigurationService,
              private readonly releasePackageService: ReleasePackageDetailsService,
              public readonly appStore: Store<MyChangeState>) {
    this.icon = 'change-request';
  }

  ngOnInit() {
    this.resetData();
    if (this.caseObject) {
      this.caseObject = this.helpersService.getCaseObjectForms(this.caseObject).caseObject;
      this.caseObject = this.caseObject.includes('2.0') ? this.caseObject.slice(0, -3) : this.caseObject;
    }
    this.storedState = this.userProfileService.getStatesData();
    this.selectedSortItem = this.storedState.linkedItemState.releasePackageSort;
    this.sortingConfiguration = this.mcSortingConfigurationService.getCaseObjectSortingConfiguration('linkedItems');
    this.deepLinkURL = this.configurationService.getLinkUrl('Teamcenter');
  }

  resetData() {
    this.linkedItems = {} as Categories;
  }

  onPanelOpened() {
    this.resetData();
    this.getList();
  }

  getList(sort?: Sort) {
    if (sort) {
      this.progressBar = true;
      this.releasePackageService.getSortedReleasePackagesForLinkedItems(JSON.stringify(this.caseObjectId), this.caseObject, sort).subscribe(response => {
        const index = this.linkedItems.categories.findIndex(category => category.name === 'RELEASEPACKAGE' || category.name === 'RP');
        this.linkedItems.categories[index].sub_categories ? this.linkedItems.categories[index].sub_categories[0].items = response
          : this.linkedItems.categories[index].subCategories[0].items = response;
        this.progressBar = false;
      });
    } else {
      this.progressBar = true;
      if ((this.caseObject.indexOf('ChangeRequest') !== -1) || (this.caseObject.indexOf('ReleasePackage') !== -1)) {
        this.caseObjectListService.getOverlayLinkedItems(this.caseObjectId, CaseObjectServicePath[this.caseObject])
          .subscribe((res) => {
            if (res) {
              this.linkedItems = res;
              this.progressBar = false;
            }
          });
      } else {
        this.caseObjectListService.getLinkedItems(this.caseObject, this.caseObjectId, this.allRPNeeded).subscribe((res) => {
          if (res) {
            this.linkedItems = res;
            this.progressBar = false;
          }
        });
      }
    }
  }

  openSelectedTab(selectedTabObject) {
    this.selectedTabCaseObject = (selectedTabObject.tab && selectedTabObject.tab.textLabel) ?
      HelpersService.getAgendaTypeFromTopic(selectedTabObject.tab.textLabel) : '';
    this.selectedTabIndex = selectedTabObject.index;
    if (this.linkedItems && this.linkedItems.categories) {
      this.linkedItems.categories.forEach((ele) => {
        if (selectedTabObject.tab && (ele.name === selectedTabObject.tab.textLabel.substr(0, 2))) {
          this.selectedIDs = [];
          if (ele.subCategories) {
            ele.subCategories.forEach(item1 => {
              item1.items.forEach(item2 => {
                this.selectedIDs.push(item2.link.ID);
              });
            });
          }
        }
      });
    }
  }

  onOverLayTabbedListItemClick($event) {
    this.selectedTabCaseObject = ($event.type || $event.link.type);
    if (this.selectedTabCaseObject === 'AIR' || this.selectedTabCaseObject === 'PBSID') {
      if (this.selectedTabCaseObject === 'PBSID') {
        this.deepLinkURL = this.configurationService.getLinkUrl('PBS');
      } else {
        this.deepLinkURL = this.configurationService.getLinkUrl('AIR');
      }
      window.open(this.deepLinkURL + ($event.id || $event.link.ID), '_blank', '', false);
    } else if (this.selectedTabCaseObject === 'ECN') {
      window.open(this.deepLinkURL + $event.link.sourceSystemID, '_blank', '', false);
    } else {
      let path = this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).path;
      if (path === 'agenda-items') {
        path = 'agendas/agenda-items';
      }
      this.router.navigate([]).then(() => {
        window.open(path + '/' + ($event.id || $event.link.ID), '_blank');
      });
    }
  }

  getCurrentFilterModel(): McFiltersModel {
    const caseObjectState = this.userProfileService.getCaseObjectState(this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).filterCaseObject) as CaseObjectState;
    return caseObjectState && caseObjectState['commonCaseObjectState'] ? new McFiltersModel(caseObjectState['commonCaseObjectState'].filters) : null;
  }

  showAll() {
    const path = this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).path;
    const currentFilterModel = this.getCurrentFilterModel();
    const filterCaseObject = this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).filterCaseObject;
    currentFilterModel.filtersModel.currentDefaultFilter.id = this.selectedIDs;

    this.userProfileService.updateCaseObjectStateWithFiltersModel(currentFilterModel, filterCaseObject, this.userProfileUpdatedState$);
    this.userProfileUpdatedState$.subscribe(() => {
      this.router.navigate([path]);
      this.appStore.dispatch(filterOptionsUpdate(true));
    });
  }

  triggerOverviewListSortChange(sort: Sort) {
    this.selectedSortItem = sort;
    this.storedState.linkedItemState.releasePackageSort = sort;
    this.userProfileService.updateUserProfileStates(this.storedState);
    this.getList(sort);
  }
}
