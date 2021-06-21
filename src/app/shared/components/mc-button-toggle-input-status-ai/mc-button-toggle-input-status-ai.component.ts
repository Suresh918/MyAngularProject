import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {AgendaService} from '../../../core/services/agenda.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {MCFieldCompositeComponent} from '../mc-field-composite/mc-field-composite.component';
import {selectCaseAction} from '../../../store';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {AgendaItem} from '../../models/mc.model';
import {AgendaItemDetail} from '../../../agenda/agenda.model';

@Component({
  selector: 'mc-button-toggle-input-status-ai',
  templateUrl: './mc-button-toggle-input-status-ai.component.html',
  styleUrls: ['./mc-button-toggle-input-status-ai.component.scss']
})
export class McButtonToggleInputStatusAiComponent extends MCFieldCompositeComponent implements OnInit, OnDestroy {
  @Input()
  isOfflineItem: boolean;
  @Input()
  decisionIcon: string;
  @Input()
  agendaItemData: AgendaItem;
  statusError: Info;
  placeholder: string;
  purpose: string;
  decisionMode: Mode;
  conclusionSaveSubscription$: Subscription;
  descriptionOnlyChangeSubscription$: Subscription;
  conclusionUpdateErrorSubscription: Subscription;
  conclusionUpdated$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  conclusionUpdateError$: BehaviorSubject<Info> = new BehaviorSubject<Info>(null);
  statusAcceptedChange: AcceptedChange;
  secondaryControlOnlyUpdated$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  statusCaseActionMapping = {'DISCUSSED': 'DISCUSS', 'POSTPONED': 'POSTPONE', 'APPROVED': 'APPROVE', 'REJECTED': 'REJECT'};

  constructor(private readonly agendaService: AgendaService,
              private readonly agendaItemService: AgendaItemService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              public appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
    this.decisionMode = Modes.PROTECTED;
    this.enumeration = [];
  }

  @Input()
  set controlConfiguration(configuration) {
    this.fieldConfiguration = configuration;
    this.enumeration = configuration.options;
    if (configuration) {
      this.help = new Info(this.fieldConfiguration.help, '', '', '', '');
    }
  }

  ngOnInit() {
    if (this.caseObject) {
      this.subscribeToSaveCaseAction();
    }
    this.subscribeToStatusUpdates();
  }

  subscribeToStatusUpdates() {
    this.conclusionSaveSubscription$ = this.conclusionUpdated$.subscribe((conclusion: string) => {
      if (conclusion || conclusion === '') {
        this.isBusy = false;
        this.changeAgendaItemStatus(this.statusAcceptedChange.value);
      }
    });
    this.conclusionUpdateErrorSubscription = this.conclusionUpdateError$.subscribe((error: Info) => {
      if (error) {
        this.isBusy = false;
        this.descriptionControl.enable();
        this.revertControlChanges();
      }
    });
    this.descriptionOnlyChangeSubscription$ = this.secondaryControlOnlyUpdated$.subscribe((value: string) => {
      if (value || value === '') {
        this.oldControlValue = value;
        if (this.agendaItemData.minutes) {
          this.agendaItemData.minutes.conclusion = value;
        } else {
          this.agendaItemData.minutes = {'conclusion': value};
        }
      }
    });
  }

  subscribeToSaveCaseAction() {
    this.fieldModeSubscription$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector(this.caseObject.type, 'SAVE', this.caseObject.ID, this.caseObject.revision || '')
    )).subscribe((isAllowed: boolean) => {
      this.decisionMode = isAllowed ? Modes.READ : Modes.PROTECTED;
    });
  }

  onAcceptStatusChanges($event: AcceptedChange) {
    this.statusAcceptedChange = $event;
    if (this.descriptionControl && ((this.agendaItemData.minutes && this.agendaItemData.minutes.conclusion &&
      this.agendaItemData.minutes.conclusion !== this.descriptionControl.value) ||
      (!(this.agendaItemData.minutes && this.agendaItemData.minutes.conclusion) && this.descriptionControl.value))) {
      const conclusionUpdateReq = this.getSecondaryControlRequest(this.agendaItemData.minutes ? this.agendaItemData.minutes.conclusion : undefined);
      this.saveFieldChanges(conclusionUpdateReq, 'minutes.conclusion', this.conclusionUpdated$, this.conclusionUpdateError$);
     // this.descriptionControl.disable();
    } else {
      this.changeAgendaItemStatus($event.value);
    }
  }

  getSecondaryControlRequest(oldValue: string) {
    const acceptEvent = new AcceptedChange(this.descriptionControlConfiguration.ID, this.descriptionControl.value, oldValue);
    return this.processRequest(acceptEvent);
  }

  changeAgendaItemStatus(state: string) {
    state = this.statusCaseActionMapping[state];
    setTimeout(() => {
      this.isBusy = true;
      if (this.descriptionControl) {
        this.descriptionControl.disable();
      }
    }, 1);
    this.agendaItemService.performActionOnAgendaItem(this.caseObject.ID, state).subscribe((res: AgendaItemDetail) => {
      this.isBusy = false;
      this.statusError = null;
      if (this.descriptionControl) {
        this.descriptionControl.enable();
      }
      if (res && res.agendaItem) {
        this.agendaItemData = res.agendaItem;
        this.bubbledAcceptChanges.emit(res);
      }
    }, (error) => {
      this.isBusy = false;
      if (this.descriptionControl) {
        this.descriptionControl.enable();
      }
      this.statusError = new Info(this.helpersService.getErrorMessage(error), null, null, null, InfoLevels.ERROR);
    });
  }

  revertControlChanges() {
    const control = this.selectControl;
    this.selectControl = new FormControl(this.agendaItemData.generalInformation.status, control.validator);
  }

  onAcceptSecondaryControlChanges($event) {
    $event.oldValue = this.oldControlValue;
    if (this.selectControl.value === this.agendaItemData.generalInformation.status) {
      this.saveFieldChanges(this.getSecondaryControlRequest($event.oldValue), $event.ID, this.secondaryControlOnlyUpdated$);
    }
  }

  ngOnDestroy() {
    if (this.conclusionSaveSubscription$) {
      this.conclusionSaveSubscription$.unsubscribe();
    }
    if (this.descriptionOnlyChangeSubscription$) {
      this.descriptionOnlyChangeSubscription$.unsubscribe();
    }
    if (this.conclusionUpdateErrorSubscription) {
      this.conclusionUpdateErrorSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
