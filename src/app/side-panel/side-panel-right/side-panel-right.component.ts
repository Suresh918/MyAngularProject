import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {AgendaState, MyChangeState} from '../../shared/models/mc-store.model';
import {selectCaseObject, selectCaseObjectType} from '../../store';
import {Agenda, AgendaItem, ChangeNotice, ChangeRequest, ReleasePackage, Review} from '../../shared/models/mc.model';
import {updateAttendees} from '../../agenda/store/actions/agenda-item-details.actions';

@Component({
  selector: 'mc-side-panel-right',
  templateUrl: './side-panel-right.component.html',
  styleUrls: ['./side-panel-right.component.scss']
})
export class SidePanelRightComponent implements OnInit, OnDestroy {
  @Input()
  isFullMenuVisible: boolean;
  @Input()
  set panelMode(mode: string) {
    this.mode = mode;
    if (mode === 'attendees') {
      // resetting this flag to avoid double calls to fetch attendees when attendees panel is opened
      this.agendaStore.dispatch(updateAttendees(''));
    }
  }
  get panelMode() {
    return this.mode;
  }
  mode: string;
  caseObject: ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem | Review;
  caseObjectType: string;
  caseObjectDetailsSubscription$: Subscription;
  caseObjectTypeSubscription$: Subscription;

  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly agendaStore: Store<AgendaState>) {
  }

  ngOnInit() {
    this.subscribeToStore();
  }

  subscribeToStore() {
    this.caseObjectTypeSubscription$ = this.appStore.pipe(select(selectCaseObjectType)).subscribe((caseObjectType) => {
      if (caseObjectType) {
        this.caseObjectType = caseObjectType;
      }
    });
    this.caseObjectDetailsSubscription$ = this.appStore.pipe(select(selectCaseObject)).subscribe((caseObject) => {
      if (caseObject) {
        this.caseObject = caseObject;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.caseObjectDetailsSubscription$) {
      this.caseObjectDetailsSubscription$.unsubscribe();
    }
    if (this.caseObjectTypeSubscription$) {
      this.caseObjectTypeSubscription$.unsubscribe();
    }
  }
}
