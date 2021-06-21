import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';

import {UpdateFieldService} from '../../../core/services/update-field.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';

@Component({
  selector: 'mc-auto-complete-impacted-item-type-single',
  templateUrl: './mc-auto-complete-impacted-item-type-single.component.html',
  styleUrls: ['./mc-auto-complete-impacted-item-type-single.component.scss']
})
export class McAutoCompleteImpactedItemTypeSingleComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;
  fetchError: Info;
  @Input()
  type: string;
  @Input()
  itemType: string;
  @Input()
  itemAction: string;
  @Input()
  bypassSearch: boolean;
  @Input()
  newItem: boolean;
  @Input()
  dataFetched: boolean;
  @Input()
  hideDataLoadingIndicator: boolean;
  @Input()
  hidePrefix: boolean;
  @Input()
  isFloatLabel: boolean;

  constructor(public readonly updateFieldService: UpdateFieldService,
              public readonly impactedItemService: ImpactedItemService,
              public readonly helpersService: HelpersService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
    this.bypassSearch = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.filterImpactedItemTypeList.bind(this);
  }

  filterImpactedItemTypeList(search: string) {
    if (search && !this.bypassSearch) {
      return this.impactedItemService.searchImpactedItemType(search.includes('-') ? search : this.getImpactedItemPrefix(this.itemType) + search, this.getImpactedItemObject(this.itemType));
    } else {
      return of([]);
    }
  }

  getImpactedItemObject(type: string) {
    switch (type) {
      case 'OPERATION': return 'operations';
      case 'PROCESS': return 'processes';
      case 'WORK_INSTRUCTION': return 'work-instructions';
    }
  }

  getImpactedItemPrefix(type: string) {
    switch (type) {
      case 'OPERATION': return 'OP-';
      case 'PROCESS': return 'PR-';
      case 'WORK_INSTRUCTION': return 'WI-';
    }
  }

}
