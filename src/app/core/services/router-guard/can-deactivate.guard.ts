import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {SharedService} from '../shared.service';
import {ComponentCanDeactivate} from './component-can-deactivate';
import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {selectAllFieldUpdates} from '../../../store';
import {FieldUpdateStates} from '../../../shared/models/mc-enums';
import {FieldUpdateData} from '../../../shared/models/mc-field-update.model';

@Injectable({
  'providedIn': 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

  navigate: boolean;
  fieldStateSubscriber: Subscription;
  isNavigated = false;

  constructor(private readonly navDialog: MatDialog,
              private readonly sharedService: SharedService,
              private readonly appStore: Store<MyChangeState>,
              private readonly matSnackBar: MatSnackBar,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly router: Router) {
  }

  canDeactivate(component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean {
    let saveInProgressFields = [];
    let isRouteChangedByUser = true;
    if (this.fieldStateSubscriber) {
      this.fieldStateSubscriber.unsubscribe();
    }
    this.fieldStateSubscriber = this.appStore.pipe(select(selectAllFieldUpdates)).subscribe((fieldUpdateData: FieldUpdateData[]) => {
      if (fieldUpdateData && fieldUpdateData.length && isRouteChangedByUser) {
        const currentUrlTree = this.router.createUrlTree([], currentRoute);
        const currentUrl = currentUrlTree.toString();
        saveInProgressFields = fieldUpdateData.filter((field: FieldUpdateData) => field.serviceStatus === FieldUpdateStates.progress);
        if (saveInProgressFields.length) {
          this.isNavigated = false;
          // the below toast should be shown only when the navigation is changed, not for all field update changes
          this.matSnackBar.open(`Saving your changes first. You will be redirected when done.`, '', {duration: 2000});
          return false;
        } else {
          if (currentUrl !== nextState.url && !this.isNavigated) {
            this.isNavigated = true;
            this.router.navigate([nextState.url]);
          }
          isRouteChangedByUser = false;
          return true;
        }
      }
    });
    return saveInProgressFields.length === 0;
  }

}
