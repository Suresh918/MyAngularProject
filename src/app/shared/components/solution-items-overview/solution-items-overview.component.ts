import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {moveItemInArray} from '@angular/cdk/drag-drop';

import {CaseActionDetail, CaseObject, CasePermissions, ChangeRequest, ImpactedItem} from '../../models/mc.model';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {FormGroup} from '@angular/forms';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';
import {CaseAction} from '../../models/case-action.model';
import {loadCaseActions} from '../../../store/actions/case-object.actions';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {Sort} from '@angular/material/sort';
import {
  McSortingConfiguration,
  McSortingConfigurationService
} from '../../../core/utilities/mc-sorting-configuration.service';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";
import {ImpactedItemFormConfiguration} from "../../models/mc-configuration.model";

@Component({
  selector: 'mc-solution-items-overview',
  templateUrl: './solution-items-overview.component.html',
  styleUrls: ['./solution-items-overview.component.scss']
})
export class SolutionItemsOverviewComponent implements OnInit {
  caseObjectData: CaseObject;
  changeTypeList: any[];
  dragElementIndex: number;
  updateChangeOwnerAllowed: boolean;
  @Input()
  set setCaseActions(data: ImpactedItem[]) {
    if (data) {
      this.solutionItemsList = data;
      this.solutionItemsList.forEach(si => {
        if (si.change_type) {
          si.change_type_label = this.changeTypeList.filter(item => item.value === si.change_type)[0].label;
        }
      });
      this.handleSolutionItemsCaseActions(data);
    }
  }
  @Input()
  set changeOwnerCaseActions(coCaseActions: any[]) {
    if (coCaseActions && coCaseActions.length) {
      coCaseActions.forEach(item => {
        if (item && item.case_action === 'UPDATE_CHANGE_OWNER') {
          this.updateChangeOwnerAllowed = item.is_allowed;
        }
      });
    }
  }
  @Input()
  solutionItemsList: ImpactedItem[];
  @Input()
  linkedChangeRequestList: ChangeRequest[];
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeNoticeFormGroup: FormGroup;
  @Input()
  enableAddScopeItem: boolean;
  @Input()
  isContainerCreated: boolean;
  @Input()
  isProject: boolean;
  @Input()
  isExpanded: boolean;
  @Input()
  caseObjectType: string;
  @Input()
  caseActions: any[];
  @Input()
  helpMessage: any;
  @Output()
  readonly solutionItemEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly solutionItemAdd: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly solutionItemDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly ownerChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly reImportContainer: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly updateMyTeamList: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly fetchSolutionItems: EventEmitter<any> = new EventEmitter<any>();
  sortConfiguration: McSortingConfiguration;
  scopeItemsListActiveSort: Sort;
  isAddScopeItemAllowed: boolean;

  constructor(public readonly appStore: Store<MyChangeState>,
              public readonly impactedItemService: ImpactedItemService,
              public readonly configurationService: ConfigurationService,
              public readonly mcSortingConfigurationService: McSortingConfigurationService,
              public readonly changeNoticeService: ChangeNoticeService) {
    this.updateChangeOwnerAllowed = true;
    this.isAddScopeItemAllowed = true;
  }

  get caseObject() {
    return this.caseObjectData;
  }

  @Input()
  set caseObject(data: CaseObject) {
    if (data) {
      this.caseObjectData = JSON.parse(JSON.stringify(data));
      this.caseObjectData.revision = '';
      this.caseObjectData.type = 'ImpactedItem';
    }
  }

  ngOnInit(): void {
    this.changeTypeList = (this.configurationService.getFormFieldParameters('ImpactedItem') as ImpactedItemFormConfiguration).change_type.options;
    this.sortConfiguration = this.mcSortingConfigurationService.getCaseObjectSortingConfiguration('scopeItem');
    if (this.caseObjectType === 'ChangeRequest') {
      this.sortConfiguration = {...this.sortConfiguration, sortingHeaders: this.sortConfiguration.sortingHeaders.filter(header => header.id !== 'release_package_number')};
    }
  }

  openSolutionItemsDialog() {
    this.solutionItemAdd.emit();
  }

  onEditSolutionItem(event) {
    this.solutionItemEdit.emit(event);
  }

  onDropSolutionItem(event) {
    const index = this.dragElementIndex >= event.index ? event.index : event.index - 1;
    if (event.data && event.data.prerequisiterpid !== this.solutionItemsList[index].id) {
      const previousItemIndex = this.solutionItemsList.findIndex((item) => item.id === event.data.id);
      moveItemInArray(this.solutionItemsList, previousItemIndex, event.index);
      const currentItemIndex = this.solutionItemsList.findIndex((item) => item.id === event.data.id);
      const sequenceNumber = this.dragElementIndex >= event.index ? event.index + 1 : event.index;
      this.setSolutionItemSequence(this.solutionItemsList[currentItemIndex].id, sequenceNumber, 'UPDATE_SCOPE_ITEM');
    }
  }

  setSolutionItemSequence(id, sequenceNumber, caseAction) {
    this.impactedItemService.updateSolutionItemSequence(id, sequenceNumber, caseAction).subscribe(res => {
      if (res) {
        this.solutionItemsList = res.scope_items;
        this.handleSolutionItemsCaseActions(this.solutionItemsList);
      }
    });
  }

  onDeleteItem(event: ImpactedItem) {
    event.deleteInProgress = true;
    this.impactedItemService.deleteImpactedItem(event.id, 'scope-items').subscribe(res => {
      event.deleteInProgress = false;
      this.fetchSolutionItems.emit();
      this.updateMyTeamList.emit(res);
      this.handleSolutionItemsCaseActions(this.solutionItemsList);
    });
  }

  handleSolutionItemsCaseActions(solutionItemsList: ImpactedItem[]) {
    for (let count = 0; count < solutionItemsList.length; count++) {
      this.solutionItemsList[count]['caseObject'] = new CaseObject(solutionItemsList[count].id.toString(), '', 'SolutionItem');
      this.storeSolutionItemsCaseActions(solutionItemsList[count]['case_permissions'], solutionItemsList[count].id.toString());
    }
    // to set caseAction for change_Owner
    const caseAction = {};
    const tempCaseActionsList = JSON.parse(JSON.stringify(solutionItemsList));
    tempCaseActionsList.forEach(item => {
      item['case_permissions']['case_actions'].forEach((caseActionObj) => {
        caseAction[caseActionObj['case_action']] = caseActionObj['is_allowed'];
      });
      this.caseActions.push(caseAction);
    });
  }

  storeSolutionItemsCaseActions(casePermissions: CasePermissions, solutionItemId: string) {
    const caseActionsAllowed = [];
    const caseActions: CaseActionDetail[] = casePermissions.case_actions;
    caseActions.forEach(caseAction => {
      caseActionsAllowed.push(new CaseAction(solutionItemId, '',
        'SolutionItem', caseAction.is_allowed, caseAction.case_action, caseAction.mandatory_properties_regexps));
    });
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  itemDragStarted(index): void {
    this.dragElementIndex = index;
  }

  onItemDragEnd() {
  }

  onOwnerChange(item) {
    this.ownerChange.emit(item);
  }

  reImportItemsContainer() {
    this.reImportContainer.emit();
  }

  getPayloadForContainer() {
    const linkedCrsArray = [];
    this.linkedChangeRequestList.forEach(item => {
      linkedCrsArray.push({'change_object_number': item.id, 'change_object_type': 'CHANGEREQUEST'});
    });
    return linkedCrsArray;
  }

  sortSolutionItemsList(sort: Sort) {

    if (sort.direction === 'asc') {
      const sortableList = this.solutionItemsList.filter(item => item.change_object_type === 'RELEASEPACKAGE');
      this.solutionItemsList = this.solutionItemsList.sort(function(a, b) {
        if (sort.active === 'creator' ? a.creators[0].full_name < b.creators[0].full_name : a.change_object_number < b.change_object_number) { return -1; }
        if (sort.active === 'creator' ? a.creators[0].full_name > b.creators[0].full_name : a.change_object_number > b.change_object_number) { return 1; }
        return 0;
      });
    } else {
      this.solutionItemsList = this.solutionItemsList.sort(function(a, b) {
        if (sort.active === 'creator' ? a.creators[0].full_name > b.creators[0].full_name : a.change_object_number > b.change_object_number) { return -1; }
        if (sort.active === 'creator' ? a.creators[0].full_name < b.creators[0].full_name : a.change_object_number < b.change_object_number) { return 1; }
        return 0;
      });
    }
  }


}
