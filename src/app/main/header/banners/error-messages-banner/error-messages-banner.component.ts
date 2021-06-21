import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {clearMediumSeverityStackResponse, selectMediumSeverityStackState} from '../../../../shared/store/index';
import {ErrorResponseModel, ErrorState} from '../../../../shared/models/mc-store.model';

@Component({
  selector: 'mc-error-messages-banner',
  templateUrl: './error-messages-banner.component.html',
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('0.2s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ])
    ])
  ],
  styleUrls: ['./error-messages-banner.component.scss']
})
export class ErrorMessagesBannerComponent implements OnInit, OnDestroy {
  messages: ErrorResponseModel[];
  mediumSeverityErrorSubscription: Subscription;

  constructor(private readonly errorStore: Store<ErrorState>) {
    this.messages = [];
  }

  ngOnInit() {
    this.subscribeMediumSeverityStore();
  }

  subscribeMediumSeverityStore(): void {
    this.mediumSeverityErrorSubscription = this.errorStore.pipe(select(selectMediumSeverityStackState)).subscribe((res: ErrorResponseModel[]) => {
      this.messages = res;
    });
  }

  close() {
    this.messages = [];
    this.errorStore.dispatch(clearMediumSeverityStackResponse());
  }

  ngOnDestroy() {
    if (this.mediumSeverityErrorSubscription) {
      this.mediumSeverityErrorSubscription.unsubscribe();
    }
  }

}
