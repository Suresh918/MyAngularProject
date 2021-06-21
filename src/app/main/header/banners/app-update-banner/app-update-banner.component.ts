import {Component} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'mc-app-update-banner',
  templateUrl: './app-update-banner.component.html',
  styleUrls: ['./app-update-banner.component.scss']
})
export class AppUpdateBannerComponent {

  appUpdateAvailable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  appUpdateSubscription$: Subscription;
  showAppUpdateBanner: boolean;
  configurations = environment;

  constructor() {
    // this.swUpdateService.subscribeForUpdate(this.appUpdateAvailable$);
    this.subscribeToAppUpdate();
  }

  subscribeToAppUpdate() {
    this.appUpdateSubscription$ = this.appUpdateAvailable$.subscribe(updateAvailable => {
      if (updateAvailable) {
        this.showAppUpdateBanner = true;
      }
    });
  }

  update() {
   // this.swUpdateService.performUpdate();
  }

  close() {
    this.showAppUpdateBanner = false;
  }
}
