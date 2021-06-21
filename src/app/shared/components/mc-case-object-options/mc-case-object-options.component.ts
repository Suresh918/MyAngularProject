import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {Favorite, SubscriptionStatus} from '../../models/mc-presentation.model';
import {MyChangeState} from '../../models/mc-store.model';
import {UserProfile} from '../../models/user-profile.model';
import {NotificationService} from '../../../core/services/notification.service';
import {selectFavoritesUpdate} from '../../../store';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FavoritesService} from '../../../main/header/favorites/favorites.service';

@Component({
  selector: 'mc-case-object-options',
  templateUrl: './mc-case-object-options.component.html',
  styleUrls: ['./mc-case-object-options.component.scss']
})
export class MCCaseObjectOptionsComponent implements OnInit, OnDestroy {
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectStatus: string;
  @Input()
  caseObjectRevision: string;
  @Input()
  releasePackageNumber: string;
  @Input()
  isMicroService: boolean;
  revision: string;
  isFavSelected: boolean;
  isNotified: boolean;
  userProfile: UserProfile;
  favoritesList: Favorite[];
  newFavorite: Favorite;
  $favoritesUpdateSubscription: Subscription;
  caseObjectLabel: string;
  userId: string;
  caseObjectId: string;

  @Input()
  set caseObjectID(id: string) {
    this.caseObjectId = id;
    this.subscribeToFavoriteState();
    this.getSubscriptionStatus();
  }

  constructor(private readonly matSnackBar: MatSnackBar,
              public readonly notificationService: NotificationService,
              private readonly helpersService: HelpersService,
              public readonly favoritesService: FavoritesService,
              private readonly appStore: Store<MyChangeState>,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.getFavorites();
    this.isNotified = false;
    this.caseObjectLabel = this.helpersService.getCaseObjectForms(this.caseObjectType).title;
    if (this.caseObjectId) {
      this.subscribeToFavoriteState();
      this.getSubscriptionStatus();
    }
  }

  subscribeToFavoriteState() {
    this.$favoritesUpdateSubscription = this.appStore.pipe(select(selectFavoritesUpdate)).subscribe((res: Boolean) => {
      if (res && res.valueOf()) {
        this.getFavorites();
      }
    });
  }

  getFavorites() {
    this.favoritesList = [];
    this.favoritesService.getFavorites().subscribe(res => {
      if (res) {
        this.userId = res['user_id'];
        this.favoritesList = res['cases'] ? res['cases'] : [];
        this.isFavSelected = this.isFavoriteActive();
      }
    });
  }

  isFavoriteActive(): boolean {
    let isSelected = false;
    if (this.favoritesList && this.favoritesList.length > 0) {
      for (const favorites of this.favoritesList) {
        if (favorites && (favorites.id === (this.caseObjectType === 'ChangeRequest' ? JSON.stringify(this.caseObjectId) : this.caseObjectId)) && (favorites.type === this.caseObjectType)) {
          isSelected = true;
          break;
        }
      }
    }
    return isSelected;
    // }
  }

  addToFavorites(): void {
    this.favoritesList = [];
    this.favoritesService.getFavorites().subscribe(res => {
      if (res) {
        this.userId = res['user_id'];
        this.favoritesList = res['cases'] ? res['cases'] : [];
        this.isFavSelected = true;
        this.newFavorite = {
          id: this.caseObjectType !== 'ReleasePackage' ? this.caseObjectType === 'ChangeRequest' ? JSON.stringify(this.caseObjectId) : this.caseObjectId : this.releasePackageNumber,
          name: '',
          type: this.caseObjectType
        };
        this.favoritesList.unshift(this.newFavorite);
        this.saveFavorites((this.caseObjectType !== 'ReleasePackage' ? this.caseObjectType === 'ChangeRequest' ? JSON.stringify(this.caseObjectId) : this.caseObjectId  : this.releasePackageNumber) + ' added to favorite list', 2000);
      }
    });
  }

  removeFromFavorites(): void {
    this.isFavSelected = false;
    this.favoritesList.forEach((item, index, object) => {
      if ((item.id === JSON.stringify(this.caseObjectType !== 'ReleasePackage' ? this.caseObjectId : this.releasePackageNumber)) &&
        (item.type === this.caseObjectType)) {
        object.splice(index, 1);
      }
    });
    this.saveFavorites((this.caseObjectType !== 'ReleasePackage' ? JSON.stringify(this.caseObjectId) : this.releasePackageNumber) + ' removed from favorite list', 2000);
  }

  saveFavorites(message: string, duration: number, action?: string): void {
    let snackBarRef;
    this.favoritesService.updateFavorites(this.userId, this.favoritesList).subscribe(result => {
      snackBarRef = this.matSnackBar.open(message, action, {duration: duration});
      // this.userProfileService.setUserProfile(result as UserProfile);
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/settings/notifications']);
      });
    });
  }

  notify(doNotify: boolean) {
    this.isNotified = doNotify;
    const action = doNotify ? 'Subscribe' : 'Unsubscribe';
    if (this.isMicroService) {
      action === 'Subscribe' ? this.notificationService.subscribeToNotification(this.caseObjectId, this.caseObjectType).subscribe(res => {
          if (res !== null) {
            this.isNotified = true;
          }
        }) :
        this.notificationService.unsubscribeToNotification(this.caseObjectId, this.caseObjectType).subscribe(res => {
          if (res !== null) {
            this.isNotified = false;
          }
        });
    } else if (!(this.isMicroService || this.isMicroService === undefined)) {
      this.notificationService.setSubscriptionStatusOfCaseObject(action, this.caseObjectId,
        this.caseObjectType).subscribe((res: SubscriptionStatus) => {
        this.isNotified = res.isSubscribed;
      });
    }
    if (doNotify) {
      this.saveFavorites('View Notification Settings to turn on which statuses you want to be notified on.', 3000, 'Notification Settings');
    } else {
      this.saveFavorites('You will not receive status updates for this ' + this.caseObjectLabel + ' anymore.', 2000);
    }
  }

  getSubscriptionStatus() {
    if (this.isMicroService && this.caseObjectId) {
      this.notificationService.getNotificationSubscriptionStatus(this.caseObjectId, this.caseObjectType).subscribe(res => {
        (res && res.length > 0) ? this.isNotified = true : this.isNotified = false;
      });
    } else if (!(this.isMicroService || this.isMicroService === undefined)) {
      this.notificationService.getSubscriptionStatusOfCaseObject(this.caseObjectId, this.caseObjectType).subscribe((res: SubscriptionStatus) => {
        this.isNotified = res.isSubscribed;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.$favoritesUpdateSubscription) {
      this.$favoritesUpdateSubscription.unsubscribe();
    }
  }
}
