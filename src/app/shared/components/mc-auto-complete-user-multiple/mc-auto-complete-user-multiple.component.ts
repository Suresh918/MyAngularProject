import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';
import { UpdateFieldService } from '../../../core/services/update-field.service';
import { Store } from '@ngrx/store';
import { MyChangeState } from '../../models/mc-store.model';
import { CaseActionService } from '../../../core/services/case-action-service';
import { UserSearchService } from '../../../core/services/user-search.service';
import {MiraiUser, UserElement} from '../../models/mc.model';
import { HelpersService } from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {of} from 'rxjs';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-auto-complete-user-multiple',
  templateUrl: './mc-auto-complete-user-multiple.component.html',
  styleUrls: ['./mc-auto-complete-user-multiple.component.scss']
})
export class MCAutoCompleteUserMultipleComponent extends MCFieldComponent implements OnInit {
  dataSource: any;
  @Input()
  predefinedUsersList: any;
  @Input()
  isObjectSnakeCase: boolean;

  constructor(public readonly updateFieldService: UpdateFieldService,
    private readonly userSearchService: UserSearchService,
              public readonly configurationService: ConfigurationService,
    appStore: Store<MyChangeState>,
    public readonly caseActionService: CaseActionService,
    public readonly helpersService: HelpersService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.predefinedUsersList) {
      this.dataSource = this.getPredefinedUsersList.bind(this);
    } else {
      this.dataSource = this.getUsers.bind(this);
    }
  }

  getUsers(search: string) {
    if (search) {
      return this.userSearchService.getUsers$(search, this.groupType, this.isObjectSnakeCase);
    } else {
      return of([]);
    }
  }

  getPredefinedUsersList(value?) {
    if (value) {
      return of(this.predefinedUsersList.filter(item => ((item.userID).toLowerCase().includes(value.toLowerCase()) || (item.fullName).toLowerCase().includes(value.toLowerCase()) || (item.abbreviation).toLowerCase().includes(value.toLowerCase()))));
    }
    return of(this.predefinedUsersList);
  }

  onAcceptChanges($event: AcceptedChange) {
    super.onAcceptChanges(this.transformEvent($event));
  }

  transformEvent($event: AcceptedChange): AcceptedChange {
    let transformedValue = $event.value ? (this.isObjectSnakeCase ? new MiraiUser($event.value) : new UserElement($event.value)) : undefined;
    let transformedOldValue = $event.oldValue ? (this.isObjectSnakeCase ? new MiraiUser($event.oldValue) : new UserElement($event.oldValue)) : undefined;
    transformedValue = transformedValue ? this.helpersService.removeEmptyKeysFromObject(transformedValue) : transformedValue;
    transformedOldValue = transformedOldValue ? this.helpersService.removeEmptyKeysFromObject(transformedOldValue) : transformedOldValue;
    return new AcceptedChange($event.ID, transformedValue, transformedOldValue);
  }

  createImageUrl(item) {
    const baseUrl = this.configurationService.getLinkUrl('PhotoURL');
    if (item && (item.user_id || item.userID)) {
      item.photoURL = baseUrl.replace('{USER-ID}', (item.user_id || item.userID));
      return item.photoURL;
    }
    return '';
  }


}
