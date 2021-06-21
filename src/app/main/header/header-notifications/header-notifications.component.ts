import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {NotificationService} from '../../../core/services/notification.service';
import {Categories} from '../../../shared/models/mc-presentation.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {NotificationNavigationService} from '../../../core/services/notification-navigation.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {DEFAULT_NOTIFICATIONS_POLLING_INTERVAL} from '../../../core/utilities/mc-constants';
import {refreshNotificationsCount, selectRefreshNotificationsCount} from '../../../store';
import {MyChangeState} from '../../../shared/models/mc-store.model';

@Component({
  selector: 'mc-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: ['./header-notifications.component.scss']
})
export class HeaderNotificationsComponent implements OnInit, OnDestroy {
  notificationsList: Categories;
  showLoader = false;
  @ViewChild('notificationsMenu') notificationsMenu;

  largeAmountsLength: number;
  selectedTabIndex: number;
  numberOfNotifications: number;
  NOTIFICATION_INTERVAL = DEFAULT_NOTIFICATIONS_POLLING_INTERVAL;
  pollingSubscription$: Subscription;

  constructor(private readonly router: Router,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService,
              private readonly notificationService: NotificationService,
              private readonly notificationNavigationService: NotificationNavigationService,
              private readonly appStore: Store<MyChangeState>) {
  }

  ngOnInit() {
    this.largeAmountsLength = 24;
    this.subscribeToStore();
    this.getNotificationsCount();
    this.pollForNotifications();
  }

  getHeaderNotifications() {
    this.showLoader = true;
    this.notificationService.getHeaderNotifications('true').subscribe(res => {
      if (res) {
        this.numberOfNotifications = res['totalItems'];
        this.notificationsList = res;
      }
      this.showLoader = false;
    });
  }

  showAllNotifications(): void {
    const userSavedStates = this.userProfileService.getStatesData();
    userSavedStates.notificationState.commonCaseObjectState.stateConfiguration.selectedTabIndex = this.selectedTabIndex;
    // this.userProfileService.updateState(userSavedStates);
    this.userProfileService.updateUserProfileStates(userSavedStates);
    this.router.navigate(['/notifications']);
  }

  openLinkedNotification(item) {
    if (item.tabData.name.toUpperCase() === 'UNREAD') {
      this.notificationService.toggleSingleNotificationStatus(item.tabData.name.toUpperCase(), 'READ', item.notificationDetails.ID)
        .subscribe(() => {
          this.appStore.dispatch(refreshNotificationsCount(true));
        });
    }
    const path = this.notificationNavigationService.navigate(item.notificationDetails.target);
    if (path) {
      this.router.navigate([path]);
    }
  }

  onSelectedTabClick(data) {
    this.selectedTabIndex = data['index'];
  }

  getNotificationsCount() {
    this.notificationService.getHeaderNotifications('false').subscribe((data) => {
      if (data) {
        this.numberOfNotifications = data['totalItems'];
      }
    });
  }

  pollForNotifications(): void {
    this.pollingSubscription$ = interval(this.NOTIFICATION_INTERVAL)
      .subscribe(() => {
        this.getNotificationsCount();
      });
  }


  ngOnDestroy(): void {
    if (this.pollingSubscription$) {
      this.pollingSubscription$.unsubscribe();
    }
  }

  subscribeToStore() {
    this.appStore.pipe(select(selectRefreshNotificationsCount)).subscribe((value) => {
      if (value && value.valueOf()) {
        this.getNotificationsCount();
      }
    });
  }
}
