import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {UserProfileService} from 'app/core/services/user-profile.service';
import {UserProfile} from 'app/shared/models/user-profile.model';
import {MenuCaseObjectLabel} from 'app/shared/models/mc-enums';
import {Favorite} from 'app/shared/models/mc-presentation.model';
import {favoritesUpdate} from '../../../store';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {FavoritesService} from './favorites.service';

export enum CaseObjectPath {
  ChangeRequest = 'change-requests',
  ChangeNotice = 'change-notices',
  ReleasePackage = 'release-packages',
  Review = 'reviews'
}

@Component({
  selector: 'mc-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isEditMode: boolean;
  userProfile: UserProfile;
  progressBar = false;
  showLoader: boolean;
  @ViewChild('favoritesMenu') favoritesMenu;
  userId: string;

  constructor(private readonly userProfileService: UserProfileService,
              public readonly favoritesService: FavoritesService,
              private readonly router: Router,
              private readonly matSnackBar: MatSnackBar,
              private readonly appStore: Store<MyChangeState>) {
    this.isEditMode = false;
  }

  ngOnInit() {
    /*this.userId = 'q04test';*/
  }

  getFavoritesList() {
    this.isEditMode = false;
    /*this.userProfile = this.userProfileService.getUserProfile();
    if (this.userProfile && this.userProfile.user && this.userProfile.user.favorites) {
      this.favorites = this.userProfile.user.favorites;
    } else {
      this.favorites = [];*/
    this.favoritesService.getFavorites().subscribe(res => {
      if (res) {
        this.userId = res['user_id'];
        this.favorites = res['cases'];
      }
    });
  }

reOrderedList(event): void {
  // this.updateUserProfile(event);
}

showCaseObject(value: string) {
  return MenuCaseObjectLabel[value.toLowerCase()];
}

deleteFavorite(event): void {
  const index = this.favorites.findIndex((item) => item.id === event.id);
  const deleteFavorite: Favorite = this.favorites[index];
  this.favorites.splice(index, 1);
  this.favoritesService.updateFavorites(this.userId, this.favorites).subscribe(res => {
    if (res) {
      this.userId = res['user_id'];
      this.favorites = res['cases'];
      this.appStore.dispatch(favoritesUpdate(true));
    }
  });
}

updateUserProfile(favorites: Favorite[], deletedFavorite?: Favorite) {
  this.userProfile = this.userProfileService.getUserProfile();
  this.userProfile['user']['favorites'] = favorites;
  this.progressBar = true;
  this.userProfileService.updateUserProfile(this.userProfile).subscribe((resp: any) => {
    this.progressBar = false;
    if (resp && resp.user) {
      this.userProfileService.setUserProfile(resp as UserProfile);
      this.appStore.dispatch(favoritesUpdate(true));
      this.favorites = resp.user.favorites || [];
    }
    if (deletedFavorite) {
      this.matSnackBar.open(`${deletedFavorite.case.ID} removed from favorite list`, '', {duration: 2000});
    } else {
      this.matSnackBar.open(`Favorites are re ordered successfully`, '', {duration: 2000});
    }
  });
}

openLinkedAction(favorite) {
  const url = `/${CaseObjectPath[favorite.type]}/${favorite.id}`;
  this.router.navigate([url]);
}
}
