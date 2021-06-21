/*
 * @file app-component-new.component.ts
 * @description app component is the first or root component that will be bootstrapped when the app is loaded
 * action header on top of the page will be updated in the whole app based on the nav observable which we subscribe in this component
 * */
// import angular components
import {AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {interval} from 'rxjs';
import {Subscription} from 'rxjs/Subscription';
import {Event, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
// import application levels components below
import {SharedService} from './core/services/shared.service';
import {PingService} from './core/services/ping.service';
import {SvgIconRegistry} from './shared/models/svg-icon-registry.model';
import {FileDragData, MyChangeState, NavBarState, SidePanelState} from './shared/models/mc-store.model';
import {selectNavBarState} from './side-panel/store';
import {loadInitialStateFromStore, selectAllFieldUpdates, selectFileDragState, selectShowFullMenu, showFullMenu} from './store';
import {MatDialogSetRoleComponent} from './settings/mat-dialog-set-role/mat-dialog-set-role.component';
import {UserProfile} from './shared/models/user-profile.model';
import {UserProfileService} from './core/services/user-profile.service';
import {fileUploadDragAction} from './store/actions/file-upload.actions';
import {FieldUpdateData} from './shared/models/mc-field-update.model';
import {FieldUpdateStates} from './shared/models/mc-enums';
import {ConfigurationService} from './core/services/configurations/configuration.service';

@Component({
  selector: 'mc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('navPanel') navPanel;
  @ViewChild('slidingBody') slidingBody;
  @ViewChild('menuSideNavContent') menuSideNavContent;
  @ViewChild('drawer') drawer;
  $navBarSubscriber: Subscription;
  showMenuSubscription$: Subscription;
  showRightPanel: boolean;
  showLeftPanel: boolean;
  position: string;
  agendaMode: string;
  rightPanelMode: string;
  svgIconRegistryList: SvgIconRegistry[];
  isFullMenuVisible: boolean;
  menuMode: string;
  userProfile: UserProfile;
  fileDraggedIntoApp: boolean;
  globalDraggingInProgress: boolean;
  saveInProgressFields: FieldUpdateData[];
  fieldStateSubscription$: Subscription;
  // private readonly _routerSub = Subscription.EMPTY;

  constructor(private readonly sharedService: SharedService,
              private readonly router: Router,
              private readonly pingService: PingService,
              private readonly matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer,
              private readonly appStore: Store<MyChangeState>,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly mediaObserver: MediaObserver,
              private readonly configurationService: ConfigurationService,
              private readonly userProfileService: UserProfileService,
              private readonly matDialog: MatDialog) {
    this.position = 'end';
    this.showRightPanel = false;
    this.showLeftPanel = false;
    this.menuMode = 'over';
    this.isFullMenuVisible = false;
    this.appStore.dispatch(loadInitialStateFromStore());
    this.svgIconRegistryList = [{
      'name': 'icon_filter',
      'path': '../assets/images/FilterEmpty.svg'
    },
      {
        'name': 'icon_filter_full',
        'path': '../assets/images/FilterFull.svg'
      },
      {
        'name': 'icon_side_panel_open',
        'path': '../assets/images/OpenSidepanel.svg'
      },
      {
        'name': 'icon_side_panel_close',
        'path': '../assets/images/CloseSidepanel.svg'
      },
      {
        'name': 'icon_filter_dark_blue',
        'path': '../assets/images/FilterEmptyDarkBlue.svg'
      },
      {
        'name': 'icon_filter_full_dark_blue',
        'path': '../assets/images/FilterFullDarkBlue.svg'
      },
      {
        'name': 'icon_arrow_down',
        'path': '../assets/images/arrowDown.svg'
      },
      {
        'name': 'icon_arrow_down_dark_blue',
        'path': '../assets/images/arrowDownDarkBlue.svg'
      },
      {
        'name': 'thumb_down_outline',
        'path': '../assets/images/outline-thumb_down.svg'
      },
      {
        'name': 'thumb_up_outline',
        'path': '../assets/images/outline-thumb_up.svg'
      },
      {
        'name': 'bsnl-logo',
        'path': '../assets/icons/bsnl-logo.svg'
      },
      {
        'name': 'change-request',
        'path': '../assets/icons/change-request.svg'
      },
      {
        'name': 'change-request-blue',
        'path': '../assets/icons/change-request-blue-24px.svg'
      },
      {
        'name': 'change-request-white',
        'path': '../assets/icons/change-request-white.svg'
      },
      {
        'name': 'change-notice',
        'path': '../assets/icons/change-notice.svg'
      },
      {
        'name': 'change-notice-blue',
        'path': '../assets/icons/change-notice-blue-24px.svg'
      },
      {
        'name': 'change-notice-white',
        'path': '../assets/icons/change-notice-white.svg'
      },
      {
        'name': 'release-package',
        'path': '../assets/icons/release-package.svg'
      },
      {
        'name': 'release-package-blue',
        'path': '../assets/icons/release-package-blue-24px.svg'
      },
      {
        'name': 'release-package-white',
        'path': '../assets/icons/release-package-white.svg'
      },
      {
        'name': 'air',
        'path': '../assets/icons/air.svg'
      },
      {
        'name': 'pbs',
        'path': '../assets/icons/pbs.svg'
      },
      {
        'name': 'trackerboard',
        'path': '../assets/icons/trackerboard-icon.svg'
      },
      {
        'name': 'cb-icon',
        'path': '../assets/icons/cb-icon.svg'
      },
      {
        'name': 'ccb-icon',
        'path': '../assets/icons/ccb-icon.svg'
      },
      {
        'name': 'cb-blue-icon',
        'path': '../assets/icons/cb-blue-icon.svg'
      },
      {
        'name': 'ccb-blue-icon',
        'path': '../assets/icons/ccb-blue-icon.svg'
      },
      {
        'name': 'baseline-calendar-today',
        'path': '../assets/icons/baseline-calendar_today-24px.svg'
      },
      {
        'name': 'change-request-product-affected',
        'path': '../assets/icons/change-request-prod-affected.svg'
      },
      {
        'name': 'solution-item-icon',
        'path': '../assets/icons/solution-Item-icon-36x36.svg'
      },
      {
        'name': 'person_replace',
        'path': '../assets/icons/person_replace-24px.svg'
      },
      {
        'name': 'product_attribute_description',
        'path': '../assets/icons/product-attribute-list-icon.svg'
      },
      {
        'name': 'sap-mdg',
        'path': '../assets/icons/sap-mdg-icon.svg'
      },
      {
        'name': 'problem-items-op',
        'path': '../assets/icons/Problem_Items_OP_icon_36x36.svg'
      },
      {
        'name': 'problem-items-pr',
        'path': '../assets/icons/Problem_Items_PR_icon_36x36.svg'
      },
      {
        'name': 'problem-items-wi',
        'path': '../assets/icons/Problem_Items_WI_icon_36x36.svg'
      },
      {
        'name': 'scope-items-op',
        'path': '../assets/icons/Scope_Items_OP_icon_36x36.svg'
      },
      {
        'name': 'scope-items-pr',
        'path': '../assets/icons/Scope_Items_PR_icon_36x36.svg'
      },
      {
        'name': 'scope-items-wi',
        'path': '../assets/icons/Scope_Items_WI_icon_36x36.svg'
      }
    ];
    this.globalDraggingInProgress = false;
    this.svgIconRegistryList.forEach((svgIconRegistry: SvgIconRegistry) => {
      this.matIconRegistry.addSvgIcon(
        svgIconRegistry.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(svgIconRegistry.path)
      );
    });

    /*
    * Adobe Digital Track of page
    * */
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        window['digitalData'].events.push({eventName: 'pageName',
                                            eventText: this.router.url});
        window['digitalData'].events.push({eventName: 'pageURL',
                                            eventText: location.origin + this.router.url});
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose($event) {
    return this.saveInProgressFields.length === 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.registerPingObservable();
    this.registerShowMenuSubscriber();
    this.registerNavBarObservable();
    this.registerMediaSubscriber();
    this.checkForRoles();
    this.subscribeToFileDrag();
    this.subscribeToFieldUpdateState();
    /*
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available
        .subscribe(() => {
          this.swUpdate
            .activateUpdate()
            .then(() => {
              window.location.reload();
            });
        });
    }
     */
  }

  registerNavBarObservable() {
    /* subscribe to  navBarObserver  to get updates on user actions on notes and actions in header */
    this.$navBarSubscriber = this.sidePanelStore.pipe(select(selectNavBarState)).subscribe((res: NavBarState) => {
        /* if res is
         1. COMMENTS - it means header component triggered action (user clicked on comment icon on header)
         so side should open and notes  template should be displayed based on context
         2. ACTIONS - it means header component triggered action (user clicked on action icon on header)
         so side should open and notes  template should be displayed based on context */
        if (res && ((res.rightNavBarState && res.rightNavBarState.isOpen && res.rightNavBarState.isOpen.valueOf()) ||
          (res.leftNavBarState && res.leftNavBarState.isOpen && res.leftNavBarState.isOpen.valueOf()))) {
          if (res.rightNavBarState && res.rightNavBarState.isOpen && res.rightNavBarState.isOpen.valueOf()) {
            this.position = 'end';
            this.agendaMode = '';
            this.rightPanelMode = res.rightNavBarState.panelMode || '';
            this.showLeftPanel = false;
            this.showRightPanel = true;
            this.appStore.dispatch(showFullMenu(false));
            this.drawer.open();
          }
          if (res.leftNavBarState && res.leftNavBarState.isOpen && res.leftNavBarState.isOpen.valueOf()) {
            // open side panel from left
            this.position = 'start';
            this.appStore.dispatch(showFullMenu(false));
            this.agendaMode = res.leftNavBarState.panelMode;
            this.showRightPanel = false;
            this.showLeftPanel = true;
            this.navPanel.open();
            this.drawer.close();
          }
        } else {
          this.showRightPanel = false;
          this.showLeftPanel = false;
          this.agendaMode = '';
          this.navPanel.close();
          this.drawer.close();
        }
        this.handleStyles();
      }
    );
  }

  registerPingObservable() {
    const intervalMinutes = 5;
    interval(1000 * 60 * intervalMinutes).subscribe(() => {
      this.pingService.ping().subscribe();
    });
  }

  registerShowMenuSubscriber() {
    this.showMenuSubscription$ = this.appStore.pipe(select(selectShowFullMenu)).subscribe((res: boolean) => {
      this.isFullMenuVisible = (res && res.valueOf());
      this.handleStyles();
    });
  }

  registerMediaSubscriber() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.menuMode = ((this.isFullMenuVisible && change.mqAlias === 'md' && (this.showLeftPanel || this.showRightPanel))
        || (this.isFullMenuVisible && change.mqAlias === 'sm')) ? 'over' : 'side';
    });
  }

  handleStyles() {
    const RIGHT_PANEL_OPEN = 'main-side-nav-content-on-right-panel-open';
    this.menuSideNavContent.elementRef.nativeElement.classList.remove('menu-side-nav-content-on-menu-open', 'menu-side-nav-content-on-icon-menu-open',
      'menu-side-nav-content-on-menu-and-right-panel-open', 'menu-side-nav-content-on-menu-and-left-panel-open',
      'menu-side-nav-content-on-icon-menu-and-left-panel-open', 'menu-side-nav-content-on-icon-menu-and-right-panel-open');
    this.slidingBody.elementRef.nativeElement.classList.remove('main-side-nav-content-on-menu-open', 'main-side-nav-content-on-icon-menu-open',
      'main-side-nav-content-on-left-panel-and-menu-open', 'main-side-nav-content-on-left-panel-and-icon-menu-open',
      RIGHT_PANEL_OPEN);
    this.navPanel._elementRef.nativeElement.classList.remove('main-side-nav-on-menu-open', 'main-side-nav-on-icon-menu-open');
    if (this.isFullMenuVisible) {
      if (this.showLeftPanel) {
        if (this.menuMode === 'over') {
          this.changeStylesWhenIconMenuShows();
        } else {
          this.menuSideNavContent.elementRef.nativeElement.getElementsByTagName('mat-sidenav')[0].classList.add('main-side-nav-on-menu-open');
          this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-menu-and-left-panel-open');
          this.slidingBody.elementRef.nativeElement.classList.add('main-side-nav-content-on-left-panel-and-menu-open');
        }
      } else if (this.showRightPanel) {
        if (this.menuMode === 'over') {
          this.changeStylesWhenIconMenuShows();
        } else {
          this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-menu-and-right-panel-open');
          this.slidingBody.elementRef.nativeElement.classList.add(RIGHT_PANEL_OPEN);
        }
      } else {
        this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-menu-open');
        this.slidingBody.elementRef.nativeElement.classList.add('main-side-nav-content-on-menu-open');
      }
    } else {
      this.changeStylesWhenIconMenuShows();
    }
  }

  changeStylesWhenIconMenuShows() {
    if (this.showLeftPanel) {
      this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-icon-menu-and-left-panel-open');
      this.navPanel._elementRef.nativeElement.classList.add('main-side-nav-on-icon-menu-open');
      this.slidingBody.elementRef.nativeElement.classList.add('main-side-nav-content-on-left-panel-and-icon-menu-open');
    } else if (this.showRightPanel) {
      this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-icon-menu-and-right-panel-open');
      this.slidingBody.elementRef.nativeElement.classList.add('main-side-nav-content-on-right-panel-open');
    } else {
      this.menuSideNavContent.elementRef.nativeElement.classList.add('menu-side-nav-content-on-icon-menu-open');
      this.slidingBody.elementRef.nativeElement.classList.add('main-side-nav-content-on-icon-menu-open');
    }
  }

  checkForRoles() {
    const preferredRolesData = this.configurationService.getPreferredRoles();
    const userProfile = this.configurationService.getUserProfile();
    // if the user doesn't has any of the three roles (CS1, CS2, CS3) or no preferred roles set, then set roles dialog to be shown.
    if (!(preferredRolesData.length > 0 || (userProfile && userProfile.roles && userProfile.roles.length > 0) ||
      this.configurationService.hasUserSpecifiedRole('changeSpecialist1') ||
      this.configurationService.hasUserSpecifiedRole('changeSpecialist2') ||
      this.configurationService.hasUserSpecifiedRole('changeSpecialist3'))) {
      this.showSetRolesDialog();
    }
  }

  showSetRolesDialog() {
    this.matDialog.open(MatDialogSetRoleComponent, {
      width: '40rem'
    });
  }

  subscribeToFileDrag() {
    this.appStore.pipe(select(selectFileDragState)).subscribe((res: FileDragData) => {
      if (res && res.dropAreaHighlighted && !res.dropAreaHighlighted.valueOf()) {
        this.fileDraggedIntoApp = res.action === 'enter';
      }
    });
  }

  dragDocEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.fileDraggedIntoApp) {
      this.fileDraggedIntoApp = true;
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'enter',
        'dropAreaHighlighted': false
      } as FileDragData));
    }
  }

  dragLeave(event) {
    this.stopAndPrevent(event);
    if (!event.clientX && !event.clientY) {
      this.fileDraggedIntoApp = false;
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
    }
  }

  dragover(event) {
    this.stopAndPrevent(event);
  }

  dragEnd(event) {
    this.stopAndPrevent(event);
  }

  dropFile(event) {
    this.stopAndPrevent(event);
    if (event.target.id.indexOf('mc-file-drop-container') > 0) {
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'leave',
        'dropAreaHighlighted': false
      } as FileDragData));
    } else {
      this.appStore.dispatch(fileUploadDragAction({
        'action': 'drop',
        'dropAreaHighlighted': true,
        fileData: event
      } as FileDragData));
    }
  }

  stopAndPrevent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  subscribeToFieldUpdateState() {
    this.saveInProgressFields = [];
    this.fieldStateSubscription$ = this.appStore.pipe(select(selectAllFieldUpdates)).subscribe((fieldUpdateData: FieldUpdateData[]) => {
      if (fieldUpdateData && fieldUpdateData.length) {
        this.saveInProgressFields = fieldUpdateData.filter((field: FieldUpdateData) => field.serviceStatus === FieldUpdateStates.progress);
      }
    });
  }

  ngOnDestroy() {
    // ensure to un-subscribe all subscriptions to avoid memory leaks
    if (this.$navBarSubscriber) {
      this.$navBarSubscriber.unsubscribe();
    }
    if (this.showMenuSubscription$) {
      this.showMenuSubscription$.unsubscribe();
    }
    if (this.fieldStateSubscription$) {
      this.fieldStateSubscription$.unsubscribe();
    }
    //this._routerSub.unsubscribe();
  }
}
