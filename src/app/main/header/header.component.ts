import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {SharedService} from '../../core/services/shared.service';
import {environment} from '../../../environments/environment';
import {MyChangeState, NavBarPayload, NotificationDetail, Payload, SidePanelState} from '../../shared/models/mc-store.model';
import {closeSideNavBars, selectLeftNavBarState} from '../../side-panel/store';
import {selectMediumSeverityNotifications, selectNotificationsRefreshState, selectShowFullMenu, showFullMenu} from '../../store';
import {AnnouncementHandlerService} from '../../core/services/announcement-handler.service';
import {Announcement} from '../../shared/models/mc-presentation.model';
import {mediumSeverityNotificationsCompleteAction} from '../../store/actions/notification.actions';
import {UserProfileService} from '../../core/services/user-profile.service';
import {McStatesModel} from '../../shared/models/mc-states-model';


@Component({
  selector: 'mc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  routeTitle: string;
  headerNotifications: any;
  showHeader: boolean;
  env = environment;
  filterActionSectionShow: boolean;
  isLeftPanelOpen: boolean;
  navBarSubscription$: Subscription;
  showMenuSubscription$: Subscription;
  mediumSeverityNotificationsSubscription$: Subscription;
  notificationsRefreshSubscription$: Subscription;
  isFullMenuVisible: boolean;
  currentBannerAnnouncement: Announcement;
  bannerAnnouncementIndex: number;
  mediumSeverityNotifications: Announcement[];
  isAnnouncementPreview: boolean;
  showBannerLink: boolean;
  showNotificationBanner: boolean;
  mcState: McStatesModel;
  isUserAdmin: boolean;
  isUserChangeSpecialist1: boolean;
  isUserChangeSpecialist2: boolean;

  constructor(private readonly location: Location,
              private readonly renderer: Renderer2,
              public router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly sharedService: SharedService,
              private readonly appStore: Store<MyChangeState>,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly announcementHandlerService: AnnouncementHandlerService,
              private readonly userProfileService: UserProfileService) {
    this.showHeader = true;
    this.registerRouterEvents();
    this.currentBannerAnnouncement = {};
    this.bannerAnnouncementIndex = 0;
    this.isAnnouncementPreview = false;
    this.showNotificationBanner = true;
  }

  ngOnInit() {
    this.announcementHandlerService.pollForAnnouncements();
    this.mcState = this.userProfileService.getStatesData();
    this.isUserAdmin = this.userProfileService.hasUserSpecifiedRole('administrator');
    this.isUserChangeSpecialist1 = this.userProfileService.hasUserSpecifiedRole('changeSpecialist1');
    this.isUserChangeSpecialist2 = this.userProfileService.hasUserSpecifiedRole('changeSpecialist2');
    this.appStore.dispatch(showFullMenu(this.mcState.navBarState.isLeftPanelOpen));
    this.navBarSubscription$ = this.sidePanelStore.pipe(select(selectLeftNavBarState)).subscribe((res: NavBarPayload) => {
      if (res && res.hasOwnProperty('isOpen')) {
        this.isLeftPanelOpen = res.isOpen.valueOf();
      }
    });
    this.showMenuSubscription$ = this.appStore.pipe(select(selectShowFullMenu)).subscribe((res: Boolean) => {
      this.isFullMenuVisible = res && res.valueOf();
    });
    this.subscribeToNotificationsStore();
    // this.unregisterServiceWorker();
  }

  subscribeToNotificationsStore(): void {
    this.mediumSeverityNotificationsSubscription$ = this.appStore.pipe(select(selectMediumSeverityNotifications)).subscribe((res: NotificationDetail) => {
      if (res && res.notificationList && res.notificationList.length > 0) {
        this.bannerAnnouncementIndex = 0;
        this.showNotificationBanner = true;
        this.mediumSeverityNotifications = res.notificationList;
        this.isAnnouncementPreview = res.isPreview.valueOf();
        this.showBannerLink = res.showSharePointLink.valueOf();
        this.handleMediumSeverityNotifications();
      }
    });
    this.notificationsRefreshSubscription$ = this.appStore.pipe(select(selectNotificationsRefreshState)).subscribe((res: Boolean) => {
      if (res && res.valueOf()) {
        this.showNotificationBanner = false;
      }
    });
  }

  handleMediumSeverityNotifications() {
    this.currentBannerAnnouncement = this.mediumSeverityNotifications[this.bannerAnnouncementIndex];
  }

  bannerDismissed(announcementId: string): void {
    this.bannerAnnouncementIndex++;
    if (!this.isAnnouncementPreview) {
      this.announcementHandlerService.updateReadAnnouncementID(announcementId);
      if (this.bannerAnnouncementIndex >= this.mediumSeverityNotifications.length) {
        this.showNotificationBanner = false;
        this.appStore.dispatch(mediumSeverityNotificationsCompleteAction(true));
        return;
      }
      this.currentBannerAnnouncement = {...this.mediumSeverityNotifications[this.bannerAnnouncementIndex]};
    } else {
      this.isAnnouncementPreview = false;
    }
  }

  registerRouterEvents(): void {
    const currentRoute = this.router;
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route['firstChild'];
        }
        if ((route && route['url'] && route['url']['value'] && route['url']['value'][0]) && (route['url']['value'][0].path === 'cr-implementation-strategy' ||
          route['url']['value'][0].path === 'print-ccb-agenda' ||
          route['url']['value'][0].path === 'print-cb-agenda' ||
          route['url']['value'][0].path === 'print-ccb-mom' ||
          route['url']['value'][0].path === 'print-cb-mom' ||
          route['url']['value'][0].path === '402')
        ) {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((event) => {
      this.routeTitle = event['title'];
      this.sidePanelStore.dispatch(closeSideNavBars());
    });
  }

  toggleMenu() {
    this.appStore.dispatch(showFullMenu(!this.isFullMenuVisible));
    this.mcState.navBarState.isLeftPanelOpen = this.isFullMenuVisible;
    this.userProfileService.updateUserProfileStates(this.mcState);
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
    if (this.navBarSubscription$) {
      this.navBarSubscription$.unsubscribe();
    }
    if (this.showMenuSubscription$) {
      this.showMenuSubscription$.unsubscribe();
    }
    if (this.mediumSeverityNotificationsSubscription$) {
      this.mediumSeverityNotificationsSubscription$.unsubscribe();
    }
    if (this.notificationsRefreshSubscription$) {
      this.notificationsRefreshSubscription$.unsubscribe();
    }
  }

  unregisterServiceWorker() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.unregister();
        }
      });
    }
  }
}
