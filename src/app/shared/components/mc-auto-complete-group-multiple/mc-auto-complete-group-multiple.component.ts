import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {UserGroupService} from '../../../core/services/user-group.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {Permission, PermissionElement} from '../../models/mc.model';
import {MyChangeState} from '../../models/mc-store.model';
import {Group} from '../../models/user-profile.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {RequestTypes} from '../../models/mc-enums';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'mc-auto-complete-group-multiple',
  templateUrl: './mc-auto-complete-group-multiple.component.html',
  styleUrls: ['./mc-auto-complete-group-multiple.component.scss']
})
export class MCAutoCompleteGroupMultipleComponent extends MCFieldComponent implements OnInit {
  dataSource: any;
  @Input()
  groupType: 'CCB' | 'CB';

  constructor(public readonly updateFieldService: UpdateFieldService,
              private readonly userGroupService: UserGroupService,
              public readonly appStore: Store<MyChangeState>,
              public readonly helpersService: HelpersService,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    this.dataSource = this.getGroups.bind(this);
    super.ngOnInit();
  }

  getGroups(search: string): Observable<any> {
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
    if (this.requestType === RequestTypes.Instance) {
      const transformedValue = $event.value.map(val => val.group_id || val);
      const transformedOldValue = $event.oldValue.map(val =>  val.group_id || val);
      return new AcceptedChange($event.ID, transformedValue, transformedOldValue);
    } else {
      const value = ($event.value as Array<any>);
      const oldValue = ($event.oldValue as Array<any>) || [];
      const transformedValue = value.map( (val) => {
        const isGroup = (val as Group).group_id ? true : false;
        if ( isGroup) {
          return new PermissionElement(
            this.groupType === 'CCB' ?
              Permission.createChangeControlBoardPermission((val as Group).group_id) :
              Permission.createChangeBoardPermission((val as Group).group_id));
        } else {
          const tempPermission = new Permission(val);
          delete tempPermission.level;
          return new PermissionElement(tempPermission);
        }
      });
      const transformedOldValue = oldValue.map( (val) => {
        const isGroup = (val as Group).group_id ? true : false;
        if ( isGroup) {
          return new PermissionElement(
            this.groupType === 'CCB' ?
              Permission.createChangeControlBoardPermission((val as Group).group_id) :
              Permission.createChangeBoardPermission((val as Group).group_id));
        } else {
          const tempPermission = new Permission(val);
          delete tempPermission.level;
          return new PermissionElement(tempPermission);
        }
      });
      return new AcceptedChange($event.ID, transformedValue, transformedOldValue);
    }
  }
}
