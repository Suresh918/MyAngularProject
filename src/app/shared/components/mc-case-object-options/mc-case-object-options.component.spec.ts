import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';

import {MCCaseObjectOptionsComponent} from './mc-case-object-options.component';
import {NotificationService} from '../../../core/services/notification.service';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {metaReducers, reducers} from '../../../store';
import {UserProfile} from '../../models/user-profile.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FavoritesService} from '../../../main/header/favorites/favorites.service';

describe('MCCaseObjectOptionsComponent', () => {
  let component: MCCaseObjectOptionsComponent;
  let fixture: ComponentFixture<MCCaseObjectOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCCaseObjectOptionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, MatSnackBarModule, MatMenuModule, MatTooltipModule, MatDialogModule, RouterModule, RouterTestingModule,
        BrowserAnimationsModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: NotificationService, useClass: NotificationServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: FavoritesService, useClass: FavoritesServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCCaseObjectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set subscription status on init', () => {
    component.ngOnInit();
    expect(component.isNotified).toBe(false);
  });
  it('should set favourite status on init', () => {
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.ngOnInit();
    expect(component.isFavSelected).toBe(false);
  });
  it('should set isFavSelected to true on init', () => {
    component.caseObjectID = '1234';
    component.caseObjectType = 'ChangeRequest';
    component.favoritesList = [{case: {ID: '1234', type: 'ChangeRequest'}}];
    component.ngOnInit();
    expect(component.isFavSelected).toBe(false);
  });
  it('should add caseObject to favorites', () => {
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.addToFavorites();
    expect(component.favoritesList[0].id).toBe('12345');
  });
  it('should call service on add favorite', () => {
    const saveFavoritesSpy = spyOn(component, 'saveFavorites');
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.addToFavorites();
    expect(saveFavoritesSpy).toHaveBeenCalledWith('12345 added to favorite list', 2000);
  });
  it('should call service on remove favorite', () => {
    const saveFavoritesSpy = spyOn(component, 'saveFavorites');
    component.favoritesList = [{case: {ID: '12345', type: 'ChangeRequest', revision: 'AA'}}];
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectRevision = 'AA';
    component.removeFromFavorites();
    expect(saveFavoritesSpy).toHaveBeenCalledWith('12345 removed from favorite list', 2000);
  });

  it('should set notification status', () => {
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectRevision = 'AA';
    component.notify(true);
    expect(component.isNotified).toBe(true);
  });

  it('should unsubscribe from notification status', () => {
    component.caseObjectID = '12345';
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectRevision = 'AA';
    component.notify(false);
    expect(component.isNotified).toBe(false);
  });
});

class NotificationServiceMock {
  setSubscriptionStatusOfCaseObject(action: string, id: string, type: string, revision: string) {
    if (action === 'Subscribe') {
      return of({isSubscribed: true});
    } else {
      return of({isSubscribed: false});
    }
  }

  getSubscriptionStatusOfCaseObject(id: string, type: string, revision: string) {
    return of({isSubscribed: false});
  }
}

class UserProfileServiceMock {
  getUserProfile() {
    return {
      user: {
        favorites: [{case: {ID: '1234', type: 'ChangeRequest'}}]
      }
    };
  }

  updateUserProfile() {
    return of({});
  }

  setUserProfile(userProfile: UserProfile) {

  }
}

class HelpersServiceMock {
  getCaseObjectForms(type) {
    return {filterCaseObject: {path: 'test1234'}};
  }
}

class FavoritesServiceMock {
  getFavorites() {
    return of({user_id: '123', cases: [{id: '123456'}]});
  }
  saveFavorites() {
    return of({});
  }
  updateFavorites() {
    return of({});
  }
}
