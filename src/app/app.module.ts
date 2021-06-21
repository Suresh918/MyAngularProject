import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {ServiceWorkerModule} from '@angular/service-worker';
import {StoreModule} from '@ngrx/store';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {DBModule} from '@ngrx/db';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {myChangeSchema} from './store/db';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './main/header/header.component';
import {BodyComponent} from './main/body/body.component';
import {LoadingMsgComponent} from './main/loading-msg/loading-msg.component';
import {SharedService} from './core/services/shared.service';
import {MatDialogErrorComponent} from './shared/components/mat-dialog-error/mat-dialog-error.component';
import {MatDialogChangeTitleComponent} from './shared/components/mat-dialog-change-title/mat-dialog-change-title.component';
import {SidePanelModule} from './side-panel/side-panel.module';
import {CanDeactivateGuard} from './core/services/router-guard/can-deactivate.guard';
import {UserProfileComponent} from './main/header/user-profile/user-profile.component';
import {BackgroundTasksEffect, metaReducers, reducers} from './store';
import {ErrorMessagesBannerComponent} from './main/header/banners/error-messages-banner/error-messages-banner.component';
import {FavoritesComponent} from './main/header/favorites/favorites.component';
import {MenuComponent} from './main/menu/menu.component';
import {HeaderNotificationsComponent} from './main/header/header-notifications/header-notifications.component';
import {BookmarksComponent} from './main/header/bookmarks/bookmarks.component';
import {HistoryComponent} from './main/header/history/history.component';
import {UserActionComponent} from './main/header/user-action/user-action.component';
import {MatDialogAddNotesComponent} from './shared/components/add-notes/mat-dialog-add-notes/mat-dialog-add-notes.component';
import {ExternalAppsComponent} from './main/header/external-apps/external-apps.component';
import {NotificationsBannerComponent} from './main/header/banners/notifications-banner/notifications-banner.component';
import {SearchComponent} from './main/header/search/search.component';
import {DocumentDeleteDialogComponent} from './side-panel/side-panel-right/side-panel-right-documents/document-delete-dialog/document-delete-dialog-component';
import {SpecialInviteesDialogComponent} from './shared/components/special-invitees-dialog/special-invitees-dialog.component';
import {CbRulesDialogComponent} from './shared/components/mc-cb-rules/cb-rules-dialog/cb-rules-dialog.component';
import {AppUpdateBannerComponent} from './main/header/banners/app-update-banner/app-update-banner.component';
import {environment} from '../environments/environment';
import {MultipleAssigneesDialogComponent} from './shared/components/mat-input-multi-user-search/multiple-assignees-dialog/multiple-assignees-dialog.component';
import {ConfigurationService} from './core/services/configurations/configuration.service';
import {TaskSchedulerComponent} from './main/header/task-scheduler/task-scheduler.component';
import {SharedModule} from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    LoadingMsgComponent,
    MultipleAssigneesDialogComponent,
    MatDialogAddNotesComponent,
    MatDialogErrorComponent,
    MatDialogChangeTitleComponent,
    UserProfileComponent,
    ErrorMessagesBannerComponent,
    UserProfileComponent,
    FavoritesComponent,
    MenuComponent,
    HeaderNotificationsComponent,
    BookmarksComponent,
    HistoryComponent,
    UserActionComponent,
    ExternalAppsComponent,
    NotificationsBannerComponent,
    SearchComponent,
    SpecialInviteesDialogComponent,
    CbRulesDialogComponent,
    AppUpdateBannerComponent,
    TaskSchedulerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    SidePanelModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    EffectsModule.forRoot([BackgroundTasksEffect]),
    DBModule.provideDB(myChangeSchema),
    MatStepperModule,
    InfiniteScrollModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production})
  ],
  entryComponents: [
    MultipleAssigneesDialogComponent,
    MatDialogAddNotesComponent,
    MatDialogErrorComponent,
    MatDialogChangeTitleComponent,
    DocumentDeleteDialogComponent,
    SpecialInviteesDialogComponent,
    CbRulesDialogComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigurationFactory,
      deps: [ConfigurationService],
      multi: true
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}},
    SharedService,
    CanDeactivateGuard,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function loadConfigurationFactory(configurationService: ConfigurationService): any {
  return () => configurationService.loadConfigurationServices();
}

