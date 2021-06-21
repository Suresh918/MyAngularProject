/*@file  core.module.ts
 *@description This file is used to add all shared service across the app
 * it helps in maintaining singleton behaviour of service objects
 * more testable components can be created based on this ideology
 *
 * */
/*Angular specific module import*/
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
/*import all service here*/
import { HttpClientInterceptorService } from './services/interceptors/http-client-interceptor.service';
import { environment } from '../../environments/environment';
import { AuthorizationInDevService } from './services/interceptors/authorization-in-dev.service';
import { ServiceStackRecorderService } from './services/interceptors/service-stack-recorder.service';
import { LoadingIndicatorService } from './services/interceptors/loading-indicator.service';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 300,
  hideDelay: 0,
  touchendHideDelay: 0,
};

export const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingIndicatorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ServiceStackRecorderService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpClientInterceptorService,
    multi: true
  }, ...(!environment['production'] ? [{
    'provide': HTTP_INTERCEPTORS,
    'useClass': AuthorizationInDevService,
    'multi': true
  }] : [])
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatDatepickerModule
  ],
  declarations: [],
  providers: [
    ...interceptors,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
