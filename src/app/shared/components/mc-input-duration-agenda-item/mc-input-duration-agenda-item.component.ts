import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, Subscription} from 'rxjs';
import * as moment from 'moment';

import {MCInputDurationComponent} from '../mc-input-duration/mc-input-duration.component';
import {FieldElement, ListFieldElement, UpdateFieldRequest} from '../../models/field-element.model';
import {AgendaItemDurationChange, AgendaState, MyChangeState} from '../../models/mc-store.model';
import {agendaItemDurationChanged, selectAgendaItemDurationChange} from '../../../agenda/store/index';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {AgendaItemDetail} from '../../../agenda/agenda.model';

@Component({
  selector: 'mc-input-duration-agenda-item',
  templateUrl: './mc-input-duration-agenda-item.component.html',
  styleUrls: ['./mc-input-duration-agenda-item.component.scss']
})
export class MCInputDurationAgendaItemComponent extends MCInputDurationComponent implements OnInit, OnDestroy {
  @Input()
  agendaItemData: AgendaItemDetail;
  @Input()
  agendaSequence: number;
  startDateTime: Date;
  eventInProcess: AcceptedChange;
  changeInAgendaItemDurationSubscriptions$: Subscription;
  dataUpdated$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  dataUpdateSubscription$: Subscription;

  constructor(public readonly updateFieldService: UpdateFieldService,
              public appStore: Store<MyChangeState>,
              public agendaStore: Store<AgendaState>,
              public readonly helpersService: HelpersService,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  get agendaItemStartTime() {
    if (!this.startDateTime || !moment(this.startDateTime).isValid()) {
      return '';
    }
    return ('0' + this.startDateTime.getHours()).slice(-2) + ':' + ('0' + this.startDateTime.getMinutes()).slice(-2);
  }

  @Input()
  set agendaItemStartTime(agendaItemStartDateTime: string) {
    if (agendaItemStartDateTime && moment(agendaItemStartDateTime).isValid()) {
      this.startDateTime = new Date(agendaItemStartDateTime);
    }
  }

  ngOnInit() {
    this.subscribeToChangeInAgendaItemDuration();
    this.dataUpdateSubscription$ = this.dataUpdated$.subscribe(value => {
      if (value !== undefined) {
        this.dispatchAgendaItemDurationChangeSuccessful();
      }
    });
    super.ngOnInit();
  }

  onAcceptChange($event: AcceptedChange): void {
    this.eventInProcess = $event;
    const updateFieldRequest = this.processDurationRequest($event);
    this.saveFieldChanges(updateFieldRequest, $event.ID, this.dataUpdated$);
  }

  processDurationRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, $event.oldValue, $event.value));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

  dispatchAgendaItemDurationChangeSuccessful() {
    const changeInDuration = this.getDurationChange();
    this.appStore.dispatch(agendaItemDurationChanged(
      {
        agendaItemID: this.caseObject.ID,
        agendaSequence: this.agendaSequence,
        changeInDurationOfAgendaItem: changeInDuration
      } as AgendaItemDurationChange));
    this.eventInProcess = null;
  }

  getDurationChange() {
    const newDuration = moment.duration(this.eventInProcess.value.toString());
    const oldDuration = moment.duration(this.eventInProcess.oldValue ? this.eventInProcess.oldValue.toString() : '');
    const changeInDuration = newDuration.subtract(oldDuration);
    return changeInDuration.toString();
  }

  subscribeToChangeInAgendaItemDuration() {
    if (!this.changeInAgendaItemDurationSubscriptions$) {
      this.changeInAgendaItemDurationSubscriptions$ = this.agendaStore.pipe(select(selectAgendaItemDurationChange))
        .subscribe((agendaItemDurationChange: AgendaItemDurationChange) => {
          this.onAgendaItemDurationChange(agendaItemDurationChange);
        });
    }
  }

  onAgendaItemDurationChange(agendaItemDurationChange: AgendaItemDurationChange) {
    if (!agendaItemDurationChange) {
      return;
    }
    if (this.agendaSequence > agendaItemDurationChange.agendaSequence) {
      this.setNewTime(agendaItemDurationChange.changeInDurationOfAgendaItem);
    }
  }

  setNewTime(changeInDuration: string) {
    if (changeInDuration && this.startDateTime && moment(this.startDateTime).isValid()) {
      const date = moment(this.startDateTime);
      if (this.agendaItemData) {
        this.agendaItemData.startDateTime = date.add(moment.duration(changeInDuration).asMinutes(), 'minutes').toDate().toUTCString();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.changeInAgendaItemDurationSubscriptions$) {
      this.changeInAgendaItemDurationSubscriptions$.unsubscribe();
    }
    if (this.dataUpdateSubscription$) {
      this.dataUpdateSubscription$.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
