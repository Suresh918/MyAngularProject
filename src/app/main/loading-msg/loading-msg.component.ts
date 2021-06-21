import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../../core/services/shared.service';
import {MyChangeState} from '../../shared/models/mc-store.model';
import {select, Store} from '@ngrx/store';
import {selectShowLoader} from '../../store';

@Component({
  selector: 'mc-loading-msg',
  templateUrl: './loading-msg.component.html',
  styleUrls: ['./loading-msg.component.scss']
})

export class LoadingMsgComponent implements OnInit, OnDestroy {
  showLoader: boolean;
  private readonly loaderInterval;
  private  $loaderSubcriber;
  private  lastLoaderTime: Date;

  constructor(private readonly sharedService: SharedService,
              private readonly appStore: Store<MyChangeState>) {
  }

  ngOnInit() {
    this.$loaderSubcriber = this.appStore.pipe(select(selectShowLoader)).subscribe((res: boolean) => {
      if (res && res.valueOf()) {
        this.showLoader = true;
        this.lastLoaderTime = new Date();
      } else {
        this.showLoader = false;
      }
    });
  }

  ngOnDestroy() {
    this.loaderInterval.clearInterval();
    this.$loaderSubcriber.unsubscribe();
  }
}
