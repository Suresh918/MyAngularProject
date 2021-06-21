import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {AirSearchService} from '../../../core/services/air-search.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MyChangeState} from '../../models/mc-store.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseActionService} from '../../../core/services/case-action-service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-auto-complete-air-multiple',
  templateUrl: './mc-auto-complete-air-multiple.component.html',
  styleUrls: ['./mc-auto-complete-air-multiple.component.scss']
})
export class MCAutoCompleteAirMultipleComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;
  constructor(private readonly matDialogAirSearchService: AirSearchService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly helpersService: HelpersService,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.matDialogAirSearchService.findAIRByID$.bind(this.matDialogAirSearchService);
  }
}
