import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {TargetCaseObject} from '../../shared/models/mc-presentation.model';
import {changeCaseObjectTabStatus, showLoader} from '../../store';
import {MyChangeState} from '../../shared/models/mc-store.model';
import {AnnouncementHandlerService} from './announcement-handler.service';
import {AnnouncementService} from '../../admin/announcements/announcement.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationNavigationService {

  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly announcementHandlerService: AnnouncementHandlerService,
              private readonly announcementService: AnnouncementService) {
  }

  navigate(target: TargetCaseObject) {
    this.dispatchTabStatus(target);
    switch (target.caseType.toUpperCase()) {
      case 'CHANGEREQUEST':
        // opening actions panel if caseObject is actions
        return target.location === 'MYTEAM' ? `/my-team/change-requests/${target.caseID}` : `/change-requests/${target.caseID}`;
      case 'CHANGENOTICE':
        return target.location === 'MYTEAM' ? `/my-team/change-notices/${target.caseID}` : `/change-notices/${target.caseID}`;
      case 'RELEASEPACKAGE':
        return target.location === 'MYTEAM' ? `/my-team/release-packages/${target.caseID}` : `/release-packages/${target.caseID}`;
      case 'ACTION':
        return `/actions/${target.caseID}`;
      case 'REVIEW':
        return `/reviews/${target.caseID}`;
      case 'ANNOUNCEMENT':
        this.showAnnouncementDialog(target.caseID);
        return ``;
      default:
        return '/notifications';
    }
  }

  dispatchTabStatus(target: TargetCaseObject) {
    if (target && target.caseType && target.location && target.caseType.toUpperCase() !== target.location.toUpperCase()) {
      this.appStore.dispatch(changeCaseObjectTabStatus({
        caseObject: target.caseType,
        currentTab: this.getTabIndex(target.location)
      }));
    }
  }

  getTabIndex(location: string): number {
    switch (location) {
      case 'TAB:REQUESTING':
      case 'TAB:DEFINING':
        return 0;
      case 'TAB:DEFINING-SOLUTION':
      case 'TAB:PLANNING':
        return 1;
      case 'TAB:ANALYZING-IMPACT':
      case 'TAB:RELEASING':
        return 2;
      case 'TAB:DECIDING':
      case 'TAB:IMPLEMENTING':
        return 3;
      case 'TAB:CLOSING':
        return 4;
    }
  }

  showAnnouncementDialog(id: string) {
    this.appStore.dispatch(showLoader(true));
    this.announcementService.getAnnouncement(id).subscribe(announcement => {
      this.appStore.dispatch(showLoader(false));
      if (announcement && announcement.ID) {
        this.announcementHandlerService.openAnnouncementDialog(announcement, true);
      }
    });
  }
}
