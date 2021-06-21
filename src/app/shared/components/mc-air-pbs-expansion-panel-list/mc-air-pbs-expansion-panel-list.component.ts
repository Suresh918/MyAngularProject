import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {AirPbsService} from '../../../core/services/air-pbs.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {Problems} from '../../models/mc-presentation.model';
import {ProductBreakdownStructure} from '../../models/product-breakdown-structure.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {selectCaseAction} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-air-pbs-expansion-panel-list',
  template: '',
  providers: [ChangeRequestService]
})
export class MCAirPbsExpansionPanelListComponent implements OnInit {

  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  openDialog: boolean;
  @Input()
  isExpanded: boolean;
  @Input()
  changeRequestID: string;
  @Input()
  hidePanel: boolean;
  expansionPanelItemConfigurationList: ExpansionPanelItemConfiguration[];
  idList: ProductBreakdownStructure[] | Problems [];
  isBusy: boolean;
  deepLinkUrl: string;
  emptyStatedata: EmptyStateData;
  imageUrl: string;
  header: string;
  deleteButtonAction$: Observable<boolean>;
  importDataAction$: Observable<boolean>;
  saveDraftAction$: Observable<boolean>;
  panelError: Info;

  constructor(public readonly configurationService: ConfigurationService,
              public readonly agendaItemService: AgendaItemService,
              public readonly changeRequestService: AirPbsService,
              public readonly changeRequestsService: ChangeRequestService,
              public readonly storeHelperService: StoreHelperService,
              public readonly helpersService: HelpersService,
              public readonly matDialog: MatDialog,
              public readonly appStore: Store<MyChangeState>,
              public readonly fb: FormBuilder) {
    this.idList = [];
    this.expansionPanelItemConfigurationList = [];
  }

  ngOnInit(): void {
    this.isBusy = false;
    this.emptyStatedata = {
      title: 'No Linked ' + this.header,
      subTitle: 'Added ' + this.header + ' Will Appear Here',
      imageURL: this.imageUrl
    };
    this.changeRequestFormGroup.valueChanges.subscribe((changeRequest) => {
      if (changeRequest.id && changeRequest.id !== '') {
        this.addButtonActions(changeRequest.id);
      }
    });
  }

  addButtonActions(changeRequestID) {
    this.deleteButtonAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'UPDATE',
        changeRequestID, '')));
    this.importDataAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'UPDATE',
        changeRequestID, '')));
  }

  onItemClick(id: string) {
    window.open(this.deepLinkUrl + id, '_blank');
  }

  handleError(err) {
    this.panelError = new Info(this.helpersService.getErrorMessage(err), null, null, null, InfoLevels.WARN);
    this.isBusy = false;
  }

  unsubscribeDeleteActions(subscriptions) {
    if (subscriptions && subscriptions.length) {
      subscriptions.forEach(subs => subs.unsubscribe());
    }
  }
}
