import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Categories} from '../../../shared/models/mc-presentation.model';
import {DEFAULT_TASKS_POLLING_INTERVAL} from '../../../core/utilities/mc-constants';
import {forkJoin, interval, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {NotificationNavigationService} from '../../../core/services/notification-navigation.service';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {select, Store} from '@ngrx/store';
import {
  backgroundTaskDetailsUpdated,
  loadBackgroundTaskCounts,
  selectBackgroundTaskCounts,
  selectRefreshBackgroundTasks,
} from '../../../store';
import {TaskSchedulerService} from '../../../core/services/task-scheduler.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.scss']
})
export class TaskSchedulerComponent implements OnInit, OnDestroy {
  backgroundTasksList: Categories;
  backgroundTasksSubList: Categories;
  showLoader = false;
  largeAmountsLength: number;
  selectedTabIndex: number;
  numberOfTasks: number;
  backgroundTasksInProgress: boolean;
  isSpinnerLoading: boolean;
  TASKS_POLLING_INTERVAL = DEFAULT_TASKS_POLLING_INTERVAL;
  pollingSubscription$: Subscription;
  panelCloseOnItemClick: boolean;
  deepLinkURL: string;
  mdgCrUrl: string;
  @ViewChild('refreshIcon') refreshIcon: ElementRef;

  constructor(private readonly router: Router,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService,
              public readonly configurationService: ConfigurationService,
              private readonly taskSchedulerService: TaskSchedulerService,
              private readonly notificationNavigationService: NotificationNavigationService,
              private readonly appStore: Store<MyChangeState>) {
  }

  ngOnInit() {
    this.backgroundTasksInProgress = false;
    this.isSpinnerLoading = false;
    this.largeAmountsLength = 20;
    this.selectedTabIndex = 1;
    this.deepLinkURL = this.configurationService.getLinkUrl('Teamcenter');
    this.mdgCrUrl = this.configurationService.getLinkUrl('MDG-CR');
    this.getBackgroundTaskCounts();
    this.subscribeToRefreshBackgroundTasks();
  }

  subscribeToRefreshBackgroundTasks() {
    this.appStore.pipe(select(selectRefreshBackgroundTasks)).subscribe((refreshTasks) => {
      if (this.refreshIcon && this.refreshIcon['_elementRef'].nativeElement) {
        const el = this.refreshIcon['_elementRef'].nativeElement;
        el.click();
      }
      this.appStore.dispatch(loadBackgroundTaskCounts(true));
    });
  }

  // Background Task Counts
  getBackgroundTaskCounts() {
    this.appStore.dispatch(loadBackgroundTaskCounts(true));
    this.subscribeToBackgroundCounts();
  }

  // Polling to Background counts
  subscribeToBackgroundCounts() {
    this.appStore.pipe(select(selectBackgroundTaskCounts)).subscribe((backgroundTaskCount) => {
      if (backgroundTaskCount.length === 4) {
        this.numberOfTasks =
          backgroundTaskCount[0]['totalItems'] +
          backgroundTaskCount[1]['totalItems'] +
          (backgroundTaskCount[2] &&
            backgroundTaskCount[2].categories &&
            backgroundTaskCount[2].categories.filter((category) => category.name === 'Processing')[0].total_items
          ) +
          (backgroundTaskCount[3] &&
            backgroundTaskCount[3].categories &&
            backgroundTaskCount[3].categories.filter((category) => category.name === 'Processing')[0].total_items
          );
        if (this.numberOfTasks > 0) {
          this.selectedTabIndex = 1;
          this.backgroundTasksInProgress = true;
          this.TASKS_POLLING_INTERVAL = 5000;
          this.triggerSpinner();
          this.pollForBackgroundTasks();
        } else {
          this.selectedTabIndex = 2;
          this.backgroundTasksInProgress = false;
          this.TASKS_POLLING_INTERVAL = DEFAULT_TASKS_POLLING_INTERVAL;
          this.pollForBackgroundTasks();
          this.getAllBackgroundTaskDetails(true);
        }
      }
    });
  }

  // Polling for Background Tasks
  pollForBackgroundTasks(): void {
    if (this.pollingSubscription$) {
      this.pollingSubscription$.unsubscribe();
    }
    this.pollingSubscription$ = interval(this.TASKS_POLLING_INTERVAL)
      .subscribe(() => {
        this.appStore.dispatch(loadBackgroundTaskCounts(true));
      });
  }

  // Background Task Details
  getAllBackgroundTaskDetails(emitCompletedEvent?: boolean) {
    this.showLoader = true;
    const serviceList = [
      this.taskSchedulerService.getBackgroundMyTeamTasks(),
      this.taskSchedulerService.getBackgroundAgendaTasks(),
      this.taskSchedulerService.getBackgroundRPTasks(),
      this.taskSchedulerService.getBackgroundCRTasks()
    ];
    forkJoin(serviceList).subscribe((resList: Categories[]) => {
      this.showLoader = false;
      if (resList.length > 1) {
        this.backgroundTasksList = {};
        for (let i = 0; i < resList.length - 1; i++) {
          this.backgroundTasksList =
            (!this.backgroundTasksList || Object.keys(this.backgroundTasksList).length === 0) ?
              this.helpersService.mergeTasks(resList[i], resList[i + 1]) :
              this.helpersService.mergeTasks(this.backgroundTasksList, resList[i + 1]);
        }
        this.sortTasks(this.backgroundTasksList);
        this.setBackgroundTaskTitles();
        this.backgroundTasksSubList = this.getBackgroundTasksSubList(JSON.parse(JSON.stringify(this.backgroundTasksList)));
        if (emitCompletedEvent) {
          this.appStore.dispatch(backgroundTaskDetailsUpdated(this.backgroundTasksList));
        }
      }
    });
  }

  setBackgroundTaskTitles() {
    let statusText = '';
    this.backgroundTasksList.categories.forEach(category => {
      if (category.subCategories) {
        category.subCategories[0].items.forEach((item) => {
          if (item.job) {
            if (item.job.action.includes('ADD')) {
              statusText = (category.name === 'Processing') ? 'Adding ' : (category.name === 'Completed') ? 'Added ' : (category.name === 'Failed') ? 'Failed to add ' : '';
            } else if (item.job.action.includes('REPLACE')) {
              statusText = (category.name === 'Processing') ? 'Replacing ' : (category.name === 'Completed') ? 'Replaced ' : (category.name === 'Failed') ? 'Failed to replace ' : '';
            } else if (item.job.action.includes('REMOVE')) {
              statusText = (category.name === 'Processing') ? 'Removing ' : (category.name === 'Completed') ? 'Removed ' : (category.name === 'Failed') ? 'Failed to remove ' : '';
            }
            if (!(item.job.action.indexOf('MDG') > -1 || item.job.action.indexOf('ECN') > -1)) {
              item.job.title = item.job.title ? item.job.title.split('<STATUS>').join(statusText) : '';
            }
          }
        });
      }
    });
  }

  // Sort Background Task Details
  sortTasks(taskDetails: any) {
    taskDetails.categories.forEach(category => {
      if (category.subCategories) {
        if (category.subCategories[0].items && category.subCategories[0].items.length > 1) {
          category.subCategories[0].items.sort((a, b) =>
            (new Date(a.backgroundTaskDetails && a.backgroundTaskDetails.scheduledOn ||
                a.job && a.job.scheduled_on) <
              new Date(b.backgroundTaskDetails && b.backgroundTaskDetails.scheduledOn ||
                b.job && b.job.scheduled_on)
            ) ? 1 : -1);
        }
      }
    });
  }

  getBackgroundTasksSubList(tasksList: Categories): Categories {
    tasksList['categories'].forEach((category) => {
      if (category && category['subCategories']) {
        category['subCategories'][0]['items'] = category['subCategories'][0]['items'].slice(0, 20);
      }
    });
    return tasksList;
  }

  showAllNotifications(): void {
    const userSavedStates = this.userProfileService.getStatesData();
    userSavedStates.notificationState.commonCaseObjectState.stateConfiguration.selectedTabIndex = this.selectedTabIndex;
    this.userProfileService.updateState(userSavedStates);
    this.userProfileService.updateUserProfileStates(userSavedStates);
    this.router.navigate(['/settings/task-scheduler']);
  }

  onSelectedTabClick(data) {
    this.selectedTabIndex = data['index'];
  }

  listItemClicked(event) {
    console.log(event);
  }

  triggerSpinner() {
    const that = this;
    this.isSpinnerLoading = true;
    setTimeout(function () {
      that.isSpinnerLoading = false;
    }, 10000);
  }

  onItemClicked(item) {
    if (item.backgroundTaskDetails &&
      (item.backgroundTaskDetails.type === 'AGENDA-CB' || item.backgroundTaskDetails.type === 'AGENDA-CCB')) {
      this.router.navigate(['agendas/', item.backgroundTaskDetails.target.caseID]);
      this.panelCloseOnItemClick = true;
      // window.open(`/agendas/${item.backgroundTaskDetails.target.caseID}`, '_blank');
    } else if (item.job && item.job.type === 'RELEASEPACKAGE') {
      this.router.navigate(['release-packages/' + item.job.target.id]);
    } else {
      this.panelCloseOnItemClick = false;
    }
  }

  getTitleByJobAction(tabName, item) {
    let title = '';
    if (tabName && tabName.toUpperCase() === 'COMPLETED') {
      if (item && item.job && item.job.action.indexOf('MDG') > -1 && item.job.title) {
        // title = 'MDG of RP ' + item.job.target.id + ' is ' +
        //  (item.job.action === 'CREATE-MDGCR' ? 'Created' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'Obsoleted' : 'Released') + ' in SAP');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-MDGCR' ? 'Created' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'Obsoleted' : 'Released')));
      } else if (item && item.job && item.job.action.indexOf('ECN') > -1 && item.job.title) {
        // title = 'ECN of RP ' + item.job.target.id + ' is ' +
        //  (item.job.action === 'CREATE-ECN' ? 'Created' : (item.job.action === 'OBSOLETE-ECN' ? 'Obsoleted' : 'Released') + ' in Teamcenter');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-ECN' ? 'Created' : (item.job.action === 'OBSOLETE-ECN' ? 'Obsoleted' : 'Released')));
      } else {
        title = ((item.backgroundTaskDetails && item.backgroundTaskDetails.title) || (item.job && item.job.title) || '');
      }
    } else if (tabName.toUpperCase() === 'PROCESSING') {
      if (item && item.job && item.job.action.indexOf('MDG') > -1 && item.job.title) {
        // title = 'MDG of RP ' + item.job.target.id + ' is being ' +
        //  (item.job.action === 'CREATE-MDGCR' ? 'Created' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'Obsoleted' : 'Released') + ' in SAP');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-MDGCR' ? 'being Created' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'being Obsoleted' : 'being Released')));
      } else if (item && item.job && item.job.action.indexOf('ECN') > -1 && item.job.title) {
        // title = 'ECN of RP ' + item.job.target.id + ' is being ' +
        //  (item.job.action === 'CREATE-ECN' ? 'Created' : (item.job.action === 'OBSOLETE-ECN' ? 'Obsoleted' : 'Released') + ' in Teamcenter');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-ECN' ? 'being Created' : (item.job.action === 'OBSOLETE-ECN' ? 'being Obsoleted' : 'being Released')));
      } else {
        title = ((item.backgroundTaskDetails && item.backgroundTaskDetails.title) || (item.job && item.job.title) || '');
      }
    } else if (tabName.toUpperCase() === 'FAILED') {
      if (item && item.job && item.job.action.indexOf('MDG') > -1 && item.job.title) {
        // title = 'MDG of RP ' + item.job.target.id + ' is being ' +
        //  (item.job.action === 'CREATE-MDGCR' ? 'Failed to Create' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'Failed to Obsolete' : 'Failed to Release') + ' in SAP');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-MDGCR' ? 'Failed to Create' : (item.job.action === 'OBSOLETE-MDG-CR' ? 'Failed to Obsoleted' : 'Failed to Released')));
      } else if (item && item.job && item.job.action.indexOf('ECN') > -1 && item.job.title) {
        // title = 'ECN of RP ' + item.job.target.id + ' is being ' +
        //  (item.job.action === 'CREATE-ECN' ? 'Failed to Create' : (item.job.action === 'OBSOLETE-ECN' ? 'Failed to Obsolete' : 'Failed to Release') + ' in Teamcenter');
        title = item.job.title.replace('<STATUS>', (item.job.action === 'CREATE-ECN' ? 'Failed to Create' : (item.job.action === 'OBSOLETE-ECN' ? 'Failed to Obsoleted' : 'Failed to Released')));
      } else {
        title = ((item.backgroundTaskDetails && item.backgroundTaskDetails.title) || (item.job && item.job.title) || '');
      }
    }
    return title ? title : '';
  }

  getListItemIcon(type, action?: string) {
    switch (type) {
      case 'AGENDA-CB':
        return 'cb-icon';
      case 'AGENDA-CCB':
        return 'ccb-icon';
      case 'MyTeamManagement':
      case 'MYTEAM':
        if (action === 'ADD' || (action && action.indexOf('ADD') > -1)) {
          return 'person_add';
        } else if (action === 'REMOVE' || (action && action.indexOf('REMOVE') > -1)) {
          return 'person_remove';
        } else if (action === 'UPDATE' || (action && action.indexOf('REPLACE') > -1)) {
          return 'person_replace';
        }
        return '';
      case 'RELEASEPACKAGE':
        return 'link';
      default:
        return '';
    }
  }

  navigateToRP(contextItem) {
    if (contextItem.job && (contextItem.job.action === 'CREATE-MDGCR' || contextItem.job.action === 'OBSOLETE-MDG-CR' || contextItem.job.action === 'RELEASE-MDG-CR')) {
      const mdgCr = this.mdgCrUrl.replace('$MDG-CR-ID', contextItem.job.context.id);
      window.open(mdgCr, '_blank', '', false);
    } else if (contextItem.job && (contextItem.job.action === 'CREATE-ECN' || contextItem.job.action === 'OBSOLETE-ECN' || contextItem.job.action === 'RELEASE-ECN')) {
      window.open(this.deepLinkURL + (contextItem.job.context.id), '_blank', '', false);
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription$) {
      this.pollingSubscription$.unsubscribe();
    }
  }
}


