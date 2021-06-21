import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {Observable, of} from 'rxjs';
import {UserSearchService} from '../../../core/services/user-search.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MiraiUser, UserElement} from '../../models/mc.model';

@Component({
  selector: 'mc-auto-complete-plmpc-single',
  templateUrl: './mc-auto-complete-plmpc-single.component.html',
  styleUrls: ['./mc-auto-complete-plmpc-single.component.scss']
})
export class MCAutoCompletePlmpcSingleComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;
  @Input()
  isObjectSnakeCase: boolean;
  hideDataLoadingIndicator: boolean;
  @Input()
  plmpcUsers: any;
  constructor(private readonly userSearchService: UserSearchService,
              public readonly configurationService: ConfigurationService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly helpersService: HelpersService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.getUsers.bind(this);
  }

  getUsers(search: string) {
    if (search) {
      this.hideDataLoadingIndicator = false;
      return this.userSearchService.getUsers$(search, this.groupType, this.isObjectSnakeCase);
    } else {
      this.hideDataLoadingIndicator = true;
      return of([]);
    }
  }

  onAcceptChange($event: AcceptedChange) {
    super.onAcceptChanges(this.transformEvent($event));
  }

  transformEvent($event: AcceptedChange): AcceptedChange {
    let transformedValue = $event.value ? (this.isObjectSnakeCase ? new MiraiUser($event.value) : new UserElement($event.value)) : null;
    let transformedOldValue = $event.oldValue ? (this.isObjectSnakeCase ? new MiraiUser($event.oldValue) : new UserElement($event.oldValue)) : null;
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
