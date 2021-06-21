import {Injectable, NgZone} from '@angular/core';
import {interval, of, Subscription} from 'rxjs';
import {concatMap, delay, flatMap, startWith} from 'rxjs/operators';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {select, Store} from '@ngrx/store';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {NotificationService} from './notification.service';
import {Announcement} from '../../shared/models/mc-presentation.model';
import {MatDialogNotificationComponent} from '../../shared/components/mat-dialog-notification/mat-dialog-notification.component';
import {StorageService} from './storage.service';
import {environment} from '../../../environments/environment';
import {MatNotificationSnackBarComponent} from '../../shared/components/mat-notification-snack-bar/mat-notification-snack-bar.component';
import {MyChangeState} from '../../shared/models/mc-store.model';
import {notificationsRefreshAction, sendMediumSeverityNotificationsAction} from '../../store/actions/notification.actions';
import {selectMediumSeverityNotificationsComplete} from '../../store';
import {UserProfile} from '../../shared/models/user-profile.model';
import {AnnouncementService} from '../../admin/announcements/announcement.service';
import {ConfigurationService} from './configurations/configuration.service';

const NOTIFICATIONS_POLL_INTERVAL = environment.notificationsPollInterval * 60 * 1000;
const CUSTOM_ALERT_INTERVAL = 6000;

@Injectable({
  providedIn: 'root'
})
export class AnnouncementHandlerService {
  highPriorityAnnouncements: Announcement[];
  mediumPriorityAnnouncements: Announcement[];
  lowPriorityAnnouncements: Announcement[];
  allAnnouncements: Announcement[];
  dialogRef: any;
  subscription: Subscription;
  userProfile: UserProfile;
  announcementIndex: number;

  constructor(private readonly notificationService: NotificationService,
              private readonly announcementService: AnnouncementService,
              private readonly announcementDialog: MatDialog,
              private readonly customAlert: MatSnackBar,
              private readonly storageService: StorageService,
              private readonly configurationService: ConfigurationService,
              private readonly appStore: Store<MyChangeState>,
              private ngZone: NgZone) {
    this.highPriorityAnnouncements = [];
    this.mediumPriorityAnnouncements = [];
    this.lowPriorityAnnouncements = [];
    this.subscribeToMediumSeverityNotificationsStatus();
  }

  pollForAnnouncements(): void {
    interval(NOTIFICATIONS_POLL_INTERVAL)
      .pipe(startWith(1),
        flatMap(() => this.notificationService.getUserNotifications$('activeDate desc', {}, false))).subscribe(resAnnouncements => {
      if (resAnnouncements && resAnnouncements.length > 0) {
        this.closeCurrentNotifications();
        this.allAnnouncements = resAnnouncements;
        this.divideAnnouncementsByPriority(resAnnouncements);
        this.announcementIndex = 0;
        this.handleHighPriorityAnnouncement();
      }
    });
  }

  divideAnnouncementsByPriority(announcements: Announcement[]): void {
    this.highPriorityAnnouncements = [];
    this.mediumPriorityAnnouncements = [];
    this.lowPriorityAnnouncements = [];
    if (announcements && announcements.length > 0) {
      announcements.forEach(announcement => {
        if (announcement.priority === 3) {
          this.highPriorityAnnouncements.push(announcement);
        } else if (announcement.priority === 2) {
          this.mediumPriorityAnnouncements.push(announcement);
        } else {
          this.lowPriorityAnnouncements.push(announcement);
        }
      });
    }
  }

  handleHighPriorityAnnouncement(): void {
    if (this.announcementIndex >= this.highPriorityAnnouncements.length) {
      this.handleMediumPriorityAnnouncements(this.mediumPriorityAnnouncements);
      return;
    }
    if (this.highPriorityAnnouncements[this.announcementIndex]) {
      this.openAnnouncementDialog(this.highPriorityAnnouncements[this.announcementIndex], false);
    }
  }

  handleMediumPriorityAnnouncements(announcements: Announcement[]): void {
    this.appStore.dispatch(sendMediumSeverityNotificationsAction(announcements, false, true));
  }

  disPatchNotificationsRefresh(): void {
    this.appStore.dispatch(notificationsRefreshAction(true));
  }

  subscribeToMediumSeverityNotificationsStatus(): void {
    this.appStore.pipe(select(selectMediumSeverityNotificationsComplete)).subscribe((res: boolean) => {
      if (res && res.valueOf()) {
        this.handleLowPriorityAnnouncements(this.lowPriorityAnnouncements);
      }
    });
  }

  handleLowPriorityAnnouncements(announcements: Announcement[]): void {
    if (announcements && announcements.length > 0) {
      fromArray(announcements).pipe(
        concatMap(announcement => of(announcement).pipe(delay(CUSTOM_ALERT_INTERVAL)))
      ).subscribe(delayedAnnouncement => {
        this.customAlert.openFromComponent(MatNotificationSnackBarComponent, {data: delayedAnnouncement});
      });
    }
  }

  openAnnouncementDialog(announcement: Announcement, isPreview: boolean, isLinkInfoPresent?: boolean): void {
    if (announcement) {
      this.dialogRef = this.announcementDialog.open(MatDialogNotificationComponent, {
        width: '30rem',
        data: {
          announcement: announcement,
          isLinkInfoPresent: isLinkInfoPresent
        }
      });
    }
    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe((announcementID: string) => {
        if (announcementID && !isPreview) {
          this.announcementIndex++;
          this.handleHighPriorityAnnouncement();
          this.updateReadAnnouncementID(announcementID);
        }
      });
    }
  }

  closeCurrentNotifications(): void {
    this.ngZone.run(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      if (this.customAlert) {
        this.customAlert.dismiss();
      }
    });
    this.disPatchNotificationsRefresh();
  }

  updateReadAnnouncementID(announcementID: string): void {
    if (announcementID) {
      const userProfile = this.configurationService.getUserProfile();
      this.announcementService.updateReadAnnouncementID(announcementID, userProfile.user_id).subscribe();
    }
  }
}
