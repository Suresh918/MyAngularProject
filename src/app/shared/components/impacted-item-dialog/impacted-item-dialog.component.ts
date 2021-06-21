import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';

import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {
  FormControlConfiguration, FormControlEnumeration,
  ImpactedItemFormConfiguration,
  ReleasePackageFormConfiguration
} from '../../models/mc-configuration.model';
import {CaseObject, ImpactedItem, MiraiUser, ReleasePackage} from '../../models/mc.model';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ImpactedItemType, ReleasePackageResponse} from '../../models/mc-presentation.model';
import {selectMandatoryParameters} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {LowSeveritySnackBarComponent} from '../low-severity-snack-bar/low-severity-snack-bar.component';
import {ReleasePackageDetailsService} from '../../../release-package/release-package-details/release-package-details.service';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';

@Component({
  selector: 'mc-impacted-item-dialog',
  templateUrl: './impacted-item-dialog.component.html',
  styleUrls: ['./impacted-item-dialog.component.scss'],
  providers: [ReleasePackageDetailsService, ChangeNoticeService]
})
export class ImpactedItemDialogComponent implements OnInit {
  radioButtonControlConfiguration: FormControlConfiguration;
  impactedItemFormGroup: FormGroup;
  changeTypeNewOptions: FormControlEnumeration[];
  changeTypeExistingOptions: FormControlEnumeration[];
  impactedItemFormConfiguration: ImpactedItemFormConfiguration;
  type: string;
  releasePackageConfiguration: ReleasePackageFormConfiguration;
  releasePackageStatusList: any[];
  dataFetched: boolean;
  linkedReleasePackages: any[];
  mandatoryFields: string[];
  changeNoticeData: any;
  caseObject: CaseObject;
  secondaryFormGroup: FormGroup;
  bypassSearch: boolean;
  disableRPCreation: boolean;
  disableFieldEdit: boolean;
  previousRP: any;
  @Output()
  readonly getDialogDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly setNavigations: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly reloadReleasePackages: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private readonly matSnackBar: MatSnackBar,
              private readonly dialog: MatDialog,
              public readonly dialogRef: MatDialogRef<ImpactedItemDialogComponent>,
              public mcFormGroupService: MCFormGroupService,
              private readonly configurationService: ConfigurationService,
              private readonly helpersService: HelpersService,
              private readonly impactedItemService: ImpactedItemService,
              private readonly releasePackageService: ReleasePackageDetailsService,
              public readonly changeNoticeService: ChangeNoticeService,
              public readonly appStore: Store<MyChangeState>,
              private readonly storeHelperService: StoreHelperService) {
    this.impactedItemFormConfiguration = this.configurationService.getFormFieldParameters('ImpactedItem') as ImpactedItemFormConfiguration;
    this.releasePackageConfiguration = this.configurationService.getFormFieldParameters('ReleasePackage2.0');
    this.radioButtonControlConfiguration = {
      options: [
        {value: 'PROCESS', label: 'Process'},
        {value: 'OPERATION', label: 'Operations'},
        {value: 'WORK_INSTRUCTION', label: 'Work Instructions'}
      ]
    };
    this.changeNoticeData = JSON.parse(JSON.stringify(this.data.caseObjectData));
    this.releasePackageStatusList = this.releasePackageConfiguration.status.options || [];
    this.changeTypeNewOptions = JSON.parse(JSON.stringify(this.impactedItemFormConfiguration.change_type.options));
    this.changeTypeExistingOptions = this.impactedItemFormConfiguration.change_type.options.filter(option => option.value !== 'CREATE-NEW');
    if (this.data.mode === 'EDIT' && !(this.data.item.change_type === 'CREATE-NEW')) {
      this.impactedItemFormConfiguration.change_type.options = this.changeTypeExistingOptions;
    }
    if (this.data.mode === 'ADD') {
      this.disableFieldEdit = true;
      this.changeNoticeService.getLinkedReleasePackages(this.data.caseObjectID, '1,2,3').subscribe(res => {
        if (res) {
          this.linkedReleasePackages = res['results'];
          this.impactedItemFormConfiguration.release_package_number.options = this.linkedReleasePackages.map(obj => obj.ID ? obj.ID : obj.release_package_number);
        }
      });
    } else if (this.data.mode === 'EDIT') {
      this.changeNoticeService.getLinkedReleasePackages(this.data.caseObjectID, '1,2,3,6').subscribe(res => {
        if (res) {
          this.linkedReleasePackages = this.data.caseActions.MOVE_SCOPE_ITEM ? res['results'].filter(item => item.status !== 6) : res['results'];
          this.impactedItemFormConfiguration.release_package_number.options = this.linkedReleasePackages.map(obj => obj.ID ? obj.ID : obj.release_package_number);
        }
      });
    }
    if (this.data.caseObjectType && this.data.caseObjectData) {
      this.caseObject = new CaseObject((this.data.caseObjectData.ID || this.data.caseObjectData.id), (this.data.caseObjectData.revision || ''), this.data.caseObjectType);
    }
    // while editing the scope item
    if (this.data && this.data.item && this.data.item.id) {
      if (this.data.item.change_object_type === 'RELEASEPACKAGE' && this.data.item.change_object_number) {
        this.data.item.release_package_number = this.data.caseObjectData.ID + '-' + this.data.item.change_object_number;
        this.previousRP = this.data.item.release_package_number;
      }
      this.impactedItemFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(this.data.item);
      // secondaryFormGroup is used to compare existing item creators with data modified by the user in the UI
      this.secondaryFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(this.data.item);
    } else if (this.data && this.data.changeOwnerType === 'PROJECT') { // while adding new scope item for Project
      this.impactedItemFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(new ImpactedItem({
        type: 'WORK_INSTRUCTION',
        new_existing_toggle: 'EXISTING'
      }));
      this.secondaryFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(new ImpactedItem({
        type: 'WORK_INSTRUCTION',
        new_existing_toggle: 'EXISTING'
      }));
    } else { // while adding new scope item for CREATOR
      this.impactedItemFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(new ImpactedItem({
        type: 'PROCESS',
        new_existing_toggle: 'EXISTING'
      }));
      this.secondaryFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(new ImpactedItem({
        type: 'PROCESS',
        new_existing_toggle: 'EXISTING'
      }));
    }
    this.dataFetched = false;
    this.disableRPCreation = false;
  }

  ngOnInit(): void {
    this.setImpactedItemMandatoryFields();
    this.impactedItemFormConfiguration.name.label = this.data.categoryLabel === 'Scope' ? 'Scope Item ID' : 'Problem Item ID';
    this.getHelpTextForID();
    this.subscribeToObservables();
    this.data.impactedItemDialogUpdate.subscribe(() => {
      this.impactedItemFormGroup = this.mcFormGroupService.createImpactedItemFormGroup(this.data.item, this.mandatoryFields);
      this.subscribeToObservables();
    });
    this.bypassSearch = this.data.mode === 'EDIT' ? true : false;
  }

  setImpactedItemMandatoryFields(): void {
    this.appStore.pipe(select(selectMandatoryParameters,
      this.storeHelperService.getButtonSelector('ImpactedItem', 'UPDATE_SCOPE_ITEM', String(this.data.caseObjectID), ''))).subscribe((data) => {
      this.mandatoryFields = data;
      if (this.data.caseObjectType === 'ChangeNotice') {
        this.mandatoryFields.push('^change_type$');
      }
    });
    this.impactedItemFormGroup = this.mcFormGroupService.createImpactedItemFormGroup((this.data.item && this.data.item.id) ? this.data.item : new ImpactedItem({}),
      this.mandatoryFields);
    if (this.data.mode === 'ADD') {
      this.data.changeOwnerType === 'PROJECT' ? this.impactedItemFormGroup.get('type').setValue('WORK_INSTRUCTION') :
                                                this.impactedItemFormGroup.get('type').setValue('PROCESS');
      this.impactedItemFormGroup.get('new_existing_toggle').setValue('EXISTING');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  saveImpactedItem() {
    this.isModifiedCreatorOrUser();
    if (this.data.mode === 'ADD') {
      this.createScopeItem();
    } else if (this.data.mode === 'EDIT') {
      if (this.data.item.change_object_type === 'CHANGENOTICE' && this.impactedItemFormGroup.get('release_package_number').value) {
        this.createScopeItem();
      } else {
        this.impactedItemService.updateImpactedItem(JSON.stringify(this.impactedItemFormGroup.get('id').value), this.data.caseObjectType, this.data.category, this.getPayload()).subscribe(res => {
          if (res) {
            if (this.previousRP && this.impactedItemFormGroup.get('release_package_number').value && this.previousRP !== this.impactedItemFormGroup.get('release_package_number').value) {
              const payload = {
                'source_change_object_number': this.previousRP,
                'target_change_object_number': this.impactedItemFormGroup.get('release_package_number').value,
                'work_instruction_id': this.impactedItemFormGroup.get('name').value.includes('-') ? this.impactedItemFormGroup.get('name').value : this.getPrefix(this.impactedItemFormGroup.get('name').value.concat(this.impactedItemFormGroup.get('name').value))
              };
              this.impactedItemService.moveScopeItem(payload).subscribe(response => {
                if (response && !(typeof response === 'string') && !(response.error && response.error.Detail && response.error.Detail.Code)) {
                  this.dialogRef.close('MOVE_SCOPE_ITEM');
                } else if (response.error.Detail.Code === 'ITEM-ERR-006') {
                  this.impactedItemService.createItemContainer(this.data.caseObjectID, this.helpersService.getItemContainerPayload(this.data.caseObjectType, this.data.caseObjectData)).subscribe(itemContainerResponse => {
                    if (itemContainerResponse) {
                      this.impactedItemService.moveScopeItem(payload).subscribe(resp => {
                        this.dialogRef.close('MOVE_SCOPE_ITEM');
                      });
                    }
                  });
                }
              });
            } else {
              this.dialogRef.close(res);
            }
          }
        });
      }
    }
  }

  createScopeItem() {
    this.impactedItemService.createImpactedItem(this.data.caseObjectID, this.data.caseObjectType, this.data.category, this.data.caseObjectData, this.getPayload()).subscribe(res => {
      if (res && !(typeof res === 'string') && !(res.error && res.error.Detail && res.error.Detail.Code)) {
        this.dialogRef.close(res);
      } else if (res.error.Detail.Code === 'ITEM-ERR-006') {
        if (this.data.caseObjectType === 'ChangeNotice') {
          const cnContexts = this.data.caseObjectData.contexts;
          const linkedCRs = cnContexts.filter(item => item.type === 'CHANGEREQUEST');
          const linkedCRIds = linkedCRs.map(item => item.context_id);
          this.changeNoticeService.createChangeObjectForCN(linkedCRIds, this.data.caseObjectID, this.data.caseObjectType).subscribe(resp => {
            if (resp) {
              this.impactedItemService.createImpactedItem(this.data.caseObjectID, this.data.caseObjectType, this.data.category, this.data.caseObjectData, this.getPayload()).subscribe(response => {
                if (response && !(typeof response === 'string')) {
                  this.dialogRef.close(response);
                } else {
                  this.matSnackBar.open(`Failed to create ${this.data.categoryLabel} Item, please try again`, '', {duration: 2000});
                }
              });
            }
          });
        } else {
          this.impactedItemService.createItemContainer(this.data.caseObjectID, this.helpersService.getItemContainerPayload(this.data.caseObjectType, this.data.caseObjectData)).subscribe(itemContainerResponse => {
            if (itemContainerResponse) {
              this.impactedItemService.createImpactedItem(this.data.caseObjectID, this.data.caseObjectType, this.data.category, this.data.caseObjectData, this.getPayload()).subscribe(response => {
                if (response && !(typeof response === 'string')) {
                  this.dialogRef.close(response);
                } else {
                  this.matSnackBar.open(`Failed to create ${this.data.categoryLabel} Item, please try again`, '', {duration: 2000});
                }
              });
            } else {
              this.matSnackBar.open(`Failed to create ${this.data.categoryLabel} Item, please try again`, '', {duration: 2000});
            }
          });
        }
      } else if (res.error.Detail.Code === 'ITEM-ERR-002') {
        // this.matSnackBar.open(res.error.Detail.Message, '', {duration: 2000});
        this.matSnackBar.openFromComponent(LowSeveritySnackBarComponent, {data: res.error.Detail.Message});
      } else {
        this.matSnackBar.open(`Failed to create ${this.data.categoryLabel} Item, please try again`, '', {duration: 2000});
      }
    });
  }

  getImpactedItemDetails(type: string) {
    let name = JSON.parse(JSON.stringify(this.impactedItemFormGroup.get('name').value));
    if (this.impactedItemFormGroup.get('name').value.includes('-')) {
      this.impactedItemFormGroup.get('name').setValue(name.slice(3, name.length));
    }
    if (!name.includes('-')) {
      name = this.getPrefix(this.impactedItemFormGroup.get('type').value).concat(name);
    }
    this.impactedItemService.getImpactedItemDetails(name, this.getImpactedItemObject(type)).subscribe((res: ImpactedItemType) => {
      if (res && res.id) {
        this.dataFetched = true;
        if (res.creators && res.creators[0] && res.creators[0].user_id && res.creators[0].full_name) {
          res.creators = res.creators[0];
        } else {
          res.creators = null;
        }
        delete res.id;
        res.users = res.users ? res.users.filter(user => user !== null) : [];
        this.impactedItemFormGroup.patchValue(res);
        this.disableFieldEdit = false;
        this.secondaryFormGroup.patchValue(JSON.parse(JSON.stringify(res)));
      }
    });
  }

  getPrefix(type: string) {
    switch (type) {
      case 'OPERATION':
        return 'OP-';
      case 'PROCESS':
        return 'PR-';
      case 'WORK_INSTRUCTION':
        return 'WI-';
    }
  }

  getImpactedItemObject(type: string) {
    switch (type) {
      case 'OPERATION':
        return 'operations';
      case 'PROCESS':
        return 'processes';
      case 'WORK_INSTRUCTION':
        return 'work-instructions';
    }
  }

  getDetails(direction: string) {
    this.getDialogDetails.emit(direction);
    this.setNavigations.emit();
  }

  subscribeToObservables() {
    this.impactedItemFormGroup.get('type').valueChanges.subscribe(val => {
      if (!(this.data.mode === 'EDIT')) {
        this.resetFormGroup();
      }
      if (this.impactedItemFormGroup.get('new_existing_toggle').value === 'NEW') {
        this.getPlaceholderID();
      } else {
        this.bypassSearch = false;
      }
    });
    this.impactedItemFormGroup.get('new_existing_toggle').valueChanges.subscribe(val => {
      if (val === 'NEW') {
        this.disableFieldEdit = false;
        this.resetFormGroup();
        this.impactedItemFormConfiguration.change_type.options = this.changeTypeNewOptions;
        this.getPlaceholderID();
      } else {
        this.disableFieldEdit = true;
        this.bypassSearch = false;
        this.resetFormGroup();
        this.impactedItemFormConfiguration.change_type.options = this.changeTypeExistingOptions;
      }
      this.getHelpTextForID();
    });
  }

  resetFormGroup() {
    Object.keys(this.impactedItemFormGroup.controls).forEach(key => {
      if (key !== 'type' && key !== 'is_modified' && key !== 'is_change_owner' && key !== 'category' && key !== 'contexts' && key !== 'new_existing_toggle') {
        if (Array.isArray(this.impactedItemFormGroup.get(key).value)) {
          this.impactedItemFormGroup.get(key).setValue([]);
          this.impactedItemFormGroup.get(key).updateValueAndValidity();
        } else if (typeof this.impactedItemFormGroup.get(key).value === 'string' || typeof this.impactedItemFormGroup.get(key).value === 'object') {
          this.impactedItemFormGroup.get(key).setValue(null);
          this.impactedItemFormGroup.get(key).updateValueAndValidity();
        }
      }
    });
  }

  getPayload() {
    const item = JSON.parse(JSON.stringify(this.impactedItemFormGroup.getRawValue()));
    delete item.release_package_number;
    delete item.revision;
    this.helpersService.removeEmptyKeysFromObject(item);
    if (item.name && !item.name.includes('-')) {
      item.name = this.getPrefix(this.impactedItemFormGroup.get('type').value).concat(item.name);
    }
    delete item.new_existing_toggle;
    if (this.data.caseObjectType === 'ReleasePackage') {
      delete item.id;
      delete item.sequence;
    }
    item.users = this.processUsers(JSON.parse(JSON.stringify(this.impactedItemFormGroup.get('users').value)));
    item.creators = this.processUsers(JSON.parse(JSON.stringify([].concat(this.impactedItemFormGroup.get('creators').value))));
    item.is_place_holder = this.data.item && this.data.item.is_place_holder ? this.data.item.is_place_holder : this.impactedItemFormGroup.get('new_existing_toggle').value === 'NEW' ? true : false;
    if (this.data.caseObjectType === 'ReleasePackage' && this.changeNoticeData && this.changeNoticeData.ID) {
      item.contexts = [{
        'context_id': this.changeNoticeData.ID,
        'type': 'CHANGENOTICE',
        'status': this.changeNoticeData.generalInformation.status,
        'name': this.changeNoticeData.generalInformation.title
      }];
    }
    return item;
  }

  processUsers(users) {
    users.forEach((user, index) => {
      users[index] = new MiraiUser(user);
    });
    return users;
  }

  isModifiedCreatorOrUser() {
    if (this.dataFetched) {
      if (JSON.stringify(this.secondaryFormGroup.get('creators').value.user_id) !== JSON.stringify(this.impactedItemFormGroup.get('creators').value.user_id)) {
        this.impactedItemFormGroup.get('is_modified').setValue(true);
      } else if (JSON.stringify(this.secondaryFormGroup.get('users').value.map(user => user.user_id)) !== JSON.stringify(this.impactedItemFormGroup.get('users').value.map(user => user.user_id))) {
        this.impactedItemFormGroup.get('is_modified').setValue(true);
      }
    }
  }

  getPlaceholderID() {
    this.impactedItemService.getNewImpactedItemId(this.data.caseObjectID, this.data.caseObjectType, this.impactedItemFormGroup.get('type').value, this.data.category).subscribe(res => {
      if (res) {
        this.bypassSearch = true;
        this.impactedItemFormGroup.get('name').setValue(res);
        this.impactedItemFormGroup.get('change_type').setValue('CREATE-NEW');
      }
    });
  }

  createRP() {
    const payload = this.helpersService.getPayloadForRPCreation(this.data.CNData, this.data.CRData, this.data.myTeam);
    this.releasePackageService.createRP(payload).subscribe({
      next: (response: ReleasePackageResponse) => {
        if (response && response.release_package && response.release_package.release_package_number) {
          response.release_package.status_label = (this.releasePackageStatusList.filter((item) => item.value === JSON.stringify(response.release_package.status)))[0].label;
          this.linkedReleasePackages.push(response.release_package);
          this.impactedItemFormConfiguration.release_package_number.options = this.linkedReleasePackages.map(obj => obj.ID ? obj.ID : obj.release_package_number);
          this.impactedItemFormGroup.get('release_package_number').setValue(response.release_package.release_package_number);
          this.disableRPCreation = true;
          this.getRPDetails(response.release_package.release_package_number);
          this.reloadReleasePackages.emit();
        }
      }
    });
  }

  getRPDetails(id: string) {
    this.releasePackageService.getReleasePackageDetails(id).subscribe(res => {
      if (res && res.release_package) {
        const selectedRP = res;
        this.data.caseObjectID = selectedRP.release_package.release_package_number;
        this.data.caseObjectType = 'ReleasePackage';
        this.data.caseObjectData = selectedRP;
      }
    });
  }

  getHelpTextForID() {
    if (this.impactedItemFormGroup.get('new_existing_toggle') && this.impactedItemFormGroup.get('new_existing_toggle').value === 'NEW') {
      this.impactedItemFormConfiguration.name.help['message'] = this.data.categoryLabel === 'Scope' ? 'The Scope ID for new Scope Items are automatically added' : 'The Problem ID for new Problem Items are automatically added';
    } else {
      if (this.data && this.data.mode === 'ADD') {
        this.impactedItemFormConfiguration.name.help['message'] = this.data.categoryLabel === 'Scope' ? 'Fill in the Scope Item ID. The linked Scope ID is automatically added to the title' : 'Fill in the Problem Item ID. The linked Problem ID is automatically added to the title';
      } else {
        this.impactedItemFormConfiguration.name.help['message'] = this.data.categoryLabel === 'Scope' ? 'Current selection of the existing Scope Item ID.' : 'Fill in the Problem Item ID. The linked Problem ID is automatically added to the title';
      }
    }
  }

}
