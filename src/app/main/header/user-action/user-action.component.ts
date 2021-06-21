import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {ActionListService} from '../../../core/services/action-list.service';
import {ActionSummaryList, Categories} from 'app/shared/models/mc-presentation.model';
import {UserProfileService} from 'app/core/services/user-profile.service';
import {FilterOptions, People} from 'app/shared/models/mc-filters.model';
import {MyChangeState} from 'app/shared/models/mc-store.model';
import {filterOptionsUpdate} from 'app/store';
import {User} from '../../../shared/models/mc.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {McStatesModel} from '../../../shared/models/mc-states-model';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

export enum CaseObjectPath {
  ChangeRequest = 'change-requests',
  ChangeNotice = 'change-notices',
  ReleasePackage = 'release-packages',
  Review = 'reviews'
}

@Component({
  selector: 'mc-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss'],
  providers: [ActionListService]
})
export class UserActionComponent implements OnInit {
  selectedTabIndex = 0;
  showLoader = false;
  progressBar: boolean;
  actionList: ActionSummaryList = {
    'totalItems': 0,
    'actionSummary': []
  };
  loggedInUser;
  assignedActions: ActionSummaryList;
  createdActions: ActionSummaryList;
  userActionsList: Categories;
  selectedTabCaseObject: string;
  mcState: McStatesModel;
  largeAmountsLength: number;

  constructor(private readonly actionListService: ActionListService,
              private readonly userProfile: UserProfileService,
              private readonly helpersService: HelpersService,
              private readonly router: Router,
              private readonly appStore: Store<MyChangeState>,
              private readonly configurationService: ConfigurationService,
              private readonly userProfileService: UserProfileService) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.configurationService.getUserProfile();
    this.largeAmountsLength = 24;
  }

  getUserActionList() {
    this.progressBar = true;
    this.actionListService.getUserActions().subscribe((res) => {
      if (res) {
        this.userActionsList = res;
      }
      this.progressBar = false;
    });
  }

  openActionList(index: number) {
    this.selectedTabIndex = index;
    if (index === 0) {
      this.actionList['actionSummary'] = this.assignedActions['actionSummary'] || [];
      this.actionList['totalItems'] = this.assignedActions['totalItems'] || 0;
    } else {
      this.actionList['actionSummary'] = this.createdActions['actionSummary'] || [];
      this.actionList['totalItems'] = this.createdActions['totalItems'] || 0;
    }
  }

  openLinkedAction($event) {
    this.selectedTabCaseObject = $event.LinkElement.type;
    let path = this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).path;
    if (path === 'agenda-items') {
      path = 'agendas/agenda-items';
    }
    this.router.navigate([]).then(() => {
      window.open(path + '/' + $event.LinkElement.ID, '_self');
    });

    // this.appStore.dispatch(setCaseObjectLayout({
    //   showActionsPanel: true
    // }));
    // const url = `/${CaseObjectPath[action.linkElement.type]}/${action.linkElement.ID}`;
    // this.router.navigate([url]);
  }

  showAllAction() {
    const filters = this.userProfile.getCaseObjectStateFilters('action');
    if (filters && filters['filtersModel'] && filters['filtersModel']['currentDefaultFilter']) {
      filters['filtersModel']['currentDefaultFilter'] = new FilterOptions({});
      if (this.selectedTabIndex === 1) {
        filters['filtersModel']['currentDefaultFilter'].people.push({
          user: new User(this.loggedInUser),
          role: {value: 'createdBy', label: 'Creator', sequence: '2'}
        } as People);
      } else {
        filters['filtersModel']['currentDefaultFilter'].people.push({
          user: new User(this.loggedInUser),
          role: {value: 'assignee', label: 'Assignee', sequence: '3'}
        } as People);
      }
      filters['filtersModel']['currentDefaultFilter'].status = [
        {'value': 'DRAFT', 'label': 'Draft'},
        {'value': 'OPEN', 'label': 'Open'},
        {'value': 'ACCEPTED', 'label': 'Accepted'}
      ];
      const userProfileUpdatedState$: Subject<void> = new Subject();
      this.userProfile.updateCaseObjectStateFilters('action', filters, userProfileUpdatedState$);
      userProfileUpdatedState$.subscribe(() => {
        this.appStore.dispatch(filterOptionsUpdate(true));
        this.router.navigate(['/actions']);
      });
    }
  }

  onSelectedTabClick(data) {
    this.selectedTabIndex = data['index'];
  }

  navigateToActions(ID) {
    event.stopPropagation();
    this.router.navigate([]).then(() => {
      window.open('actions/' + ID, '_blank');
    });
  }
}
