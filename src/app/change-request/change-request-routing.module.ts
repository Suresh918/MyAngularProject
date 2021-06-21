import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChangeRequestListComponent} from './change-request-list/change-request-list.component';
import {CanDeactivateGuard} from '../core/services/router-guard/can-deactivate.guard';
import {ChangeRequestDetailComponent} from './shared/change-request-detail/change-request-detail.component';
import {ChangeRequestImplementationStrategyComponent} from './shared/change-request-implementation-strategy/change-request-implementation-strategy.component';
import {ChangeRequestCIAComponent} from './shared/change-request-cia/change-request-cia.component';

const routes: Routes = [
  {path: '', component: ChangeRequestListComponent},
  {path: ':id', component: ChangeRequestDetailComponent, canDeactivate: [CanDeactivateGuard]},
  {path: ':id/:tab/:section', component: ChangeRequestDetailComponent, canDeactivate: [CanDeactivateGuard]},
  {path: 'cr-implementation-strategy/:id', component: ChangeRequestImplementationStrategyComponent},
  {path: 'cr-customer-impact-assessment/:id', component: ChangeRequestCIAComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeRequestRoutingModule {
}
