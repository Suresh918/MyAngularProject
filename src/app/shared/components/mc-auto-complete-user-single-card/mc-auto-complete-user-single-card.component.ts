import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {MiraiUser, UserElement} from '../../../shared/models/mc.model';
import {UserSearchService} from '../../../core/services/user-search.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-auto-complete-user-single-card',
  templateUrl: './mc-auto-complete-user-single-card.component.html',
  styleUrls: ['./mc-auto-complete-user-single-card.component.scss']
})
export class McAutoCompleteUserSingleCardComponent extends MCFieldComponent implements OnInit {
  dataSource: Observable<any>;
  @Input()
  showValueAsChip: boolean;
  @Input()
  isObjectSnakeCase: boolean;
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
      return this.userSearchService.getUsers$(search, this.groupType, this.isObjectSnakeCase);
    } else {
      return of([]);
    }
  }

  onAcceptChange($event: AcceptedChange) {
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
    if (item && item.userID) {
      item.photoURL = baseUrl.replace('{USER-ID}', item.userID);
      return item.photoURL;
    }
    return '';
  }
}
