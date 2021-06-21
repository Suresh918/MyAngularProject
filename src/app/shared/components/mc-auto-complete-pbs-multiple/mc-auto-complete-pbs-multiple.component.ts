import { Component, OnInit } from '@angular/core';
import {MCFieldComponent} from "../mc-field/mc-field.component";
import {Observable} from "rxjs";
import {PbsSearchService} from "../../../core/services/pbs-search.service";
import {UpdateFieldService} from "../../../core/services/update-field.service";
import {MyChangeState} from "../../models/mc-store.model";
import {Store} from "@ngrx/store";
import {CaseActionService} from "../../../core/services/case-action-service";
import {HelpersService} from "../../../core/utilities/helpers.service";
import {StoreHelperService} from "../../../core/utilities/store-helper.service";

@Component({
  selector: 'mc-auto-complete-pbs-multiple',
  templateUrl: './mc-auto-complete-pbs-multiple.component.html',
  styleUrls: ['./mc-auto-complete-pbs-multiple.component.scss']
})
export class MCAutoCompletePbsMultipleComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;
  constructor(private readonly matDialogPbsSearchService: PbsSearchService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly helpersService: HelpersService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.matDialogPbsSearchService.findPBSByID$.bind(this.matDialogPbsSearchService);
  }
}
