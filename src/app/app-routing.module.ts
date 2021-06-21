/* *
 * @file app-routing.module.ts
 * @description app-routing module is the parent route module that will be used to add the
 * default route and routes/path available to navigate
 * */

// import angular and 3rd party modules
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {CanLoadDashboardModuleGuard} from './core/services/route-gaurds/can-load-dashboard-module-guard.service';

/* *
 * loadChildren: it will help to add module after path has matched for the first time (lazy loading)
 * Routes:
 * 1.dashboard - relativeURl/dashboard  -will load dashboard module on first visit of this path
 * 2.action - relativeUrl/action - will load actions module on first visit of this path
 * 3.change-request - relative/url - will load change-request module on first visit of this path
 * 4.change-notice - relative/url - will load change-notice module on first visit of this path
 * default and on any other it will navigate to dashboard path
 * Note: forRoot() will give the router components and provide the router services. But the next times in submodules,
 * forChild will only give the router components (and not providing again the services, which would be bad).
 * */
const defaultRoute = `/dashboard`;
const APP_ROUTES: Routes = [
  {
    path: 'dashboard',
    canActivate: [CanLoadDashboardModuleGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: {title: 'Dashboard'}
  },
  {
    path: '402',
    component: PageNotFoundComponent,
    data: {title: 'Menu'}
  },
  {path: '', redirectTo: defaultRoute, pathMatch: 'full'},
  {path: '**', redirectTo: defaultRoute}
];

@NgModule({
  imports: [
    /*
     * forRoot -the forRoot() convention represents a way to import an NgModule along with its
     * providers using the ModuleWithProviders interface.
     * */
    RouterModule.forRoot(
      APP_ROUTES,
      {
        enableTracing: false, // <-- set to 'true' for debugging purposes only
        useHash: false,
        relativeLinkResolution: 'legacy'
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

