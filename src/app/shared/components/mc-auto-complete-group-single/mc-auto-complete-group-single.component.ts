import {Component, Input, OnInit} from '@angular/core';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {UserGroupService} from '../../../core/services/user-group.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FormControl} from '@angular/forms';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {of} from 'rxjs';

@Component({
  selector: 'mc-auto-complete-group-single',
  templateUrl: './mc-auto-complete-group-single.component.html',
  styleUrls: ['./mc-auto-complete-group-single.component.scss']
})
export class MCAutoCompleteGroupSingleComponent extends MCFieldComponent implements OnInit {
  dataSource: any;
  formControl: FormControl;
  @Input()
  groupType: string;

  @Input()
  set control(ctrl: FormControl) {
    if (typeof ctrl.value === 'string') {
      ctrl.setValue({'group_id': ctrl.value});
    }
    this.formControl = ctrl;
  }

  get control() {
    return this.formControl;
  }

  constructor(public readonly updateFieldService: UpdateFieldService,
              private readonly userGroupService: UserGroupService,
              appStore: Store<MyChangeState>,
              public readonly helpersService: HelpersService,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    this.dataSource = this.getGroups.bind(this);
    super.ngOnInit();
  }

  getGroups(search: string) {
    if (search) {
      return this.userGroupService.getGroups$(search, this.groupType);
    } else {
      return of([]);
    }
  }

  onAcceptChanges($event: AcceptedChange) {
    super.onAcceptChanges(this.transformEvent($event));
  }

  transformEvent($event: AcceptedChange): AcceptedChange {
    let value = '', oldValue = '';
    if ($event.value && $event.value.group_id) {
      value = $event.value.group_id;
    }
    if ($event.oldValue && ($event.oldValue.group_id || $event.oldValue.group_id === '')) {
      oldValue = $event.oldValue.group_id;
    }
    return new AcceptedChange($event.ID, value, oldValue);
  }
}
