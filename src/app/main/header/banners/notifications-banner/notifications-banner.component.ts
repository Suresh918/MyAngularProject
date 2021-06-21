import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Announcement} from '../../../../shared/models/mc-presentation.model';

@Component({
  selector: 'mc-notifications-banner',
  templateUrl: './notifications-banner.component.html',
  styleUrls: ['./notifications-banner.component.scss']
})
export class NotificationsBannerComponent implements OnChanges {
  @Input()
  announcement: Announcement;
  @Input()
  showBannerLink: boolean;
  @Output()
  private readonly bannerDismissed: EventEmitter<string> = new EventEmitter();
  show: boolean;

  constructor() {
  }

  dismissAnnouncement() {
    this.show = false;
    this.bannerDismissed.emit(this.announcement.ID);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.announcement && simpleChanges.announcement.currentValue && simpleChanges.announcement.currentValue.ID) {
      this.show = true;
      this.announcement = simpleChanges.announcement.currentValue;
    }
  }

  openURL(): void {
    if (this.announcement.link) {
      window.open(this.announcement.link, '_blank');
    }
  }

}
