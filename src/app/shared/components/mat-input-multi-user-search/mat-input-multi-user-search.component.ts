import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, ValidatorFn} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {ENTER} from '@angular/cdk/keycodes';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserSearchService} from '../../../core/services/user-search.service';
import {User} from '../../models/mc.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {MultipleAssigneesDialogComponent} from './multiple-assignees-dialog/multiple-assignees-dialog.component';

const COMMA = 188;

@Component({
  selector: 'mc-mat-input-multi-user-search',
  templateUrl: './mat-input-multi-user-search.component.html',
  styleUrls: ['./mat-input-multi-user-search.component.scss']
})
export class MultiUserSearchComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  disabled: boolean;
  @Input()
  control: FormArray;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  groups: boolean;
  @Input()
  submitted: boolean;
  @ViewChild('userInput') userInput: ElementRef;
  @ViewChild('userchipList') userchipList;
  @Output()
  readonly userSelected: EventEmitter<any> = new EventEmitter<any>();

  isControlDisabledInitially: boolean;
  stateCtrl: FormControl;
  filteredUsers$: Observable<Array<User>>;
  selectedUserData: User;
  showClearIcon: boolean;
  progressBar: boolean;
  userRemovable: boolean;
  userGroups: User[];
  visible: boolean;
  separatorKeysCodes;

  constructor(private readonly userSearchService: UserSearchService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly formBuilder: FormBuilder,
              private readonly matDialog: MatDialog) {
    this.stateCtrl = new FormControl({value: '', disabled: this.showClearIcon});
    this.disabled = false;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.visible = true;
    this.showClearIcon = false;
    this.progressBar = false;
    this.userRemovable = true;
    this.userGroups = [];
  }

  onUserSelected() {
    return (userObj) => {
      const user = new User(userObj);
      this.userSelected.emit(user);
      this.selectedUserData = userObj;
      this.control.push(this.formBuilder.group(user));
      return user ? (user.fullName + (user.abbreviation ? ' - ' : '') + (user.abbreviation || '')) : user;
    };
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.controlConfiguration && this.controlConfiguration.validatorConfiguration && this.controlConfiguration.validatorConfiguration.required) {
      this.stateCtrl.setValidators([this.customRequiredValidatorForMultiUser(this.control)]);
      this.stateCtrl.updateValueAndValidity();
    }
    if (this.disabled) {
      this.stateCtrl.disable();
    }
    this.stateCtrl.setValue(this.control.value);
    this.selectedUserData = this.control.value;
    this.filteredUsers$ = this.stateCtrl.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      switchMap((user) => {
        if (user && typeof user === 'string') {
          this.progressBar = true;
          return this.userSearchService.getUsers$(user).pipe(map((userList: User[]) => {
            this.progressBar = false;
            return userList;
          }));
        } else if (user && typeof user === 'object' && user.userID) {
          return of([]);
        }
      }),
      catchError(() => {
        this.progressBar = false;
        return of([]);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.control && this.control.disabled) {
      this.isControlDisabledInitially = true;
      this.stateCtrl.disable();
    }
    if (this.userchipList) {
      this.userchipList.errorState = this.submitted && this.stateCtrl && this.stateCtrl.errors;
    }
    if (changes.control && changes.control.currentValue && changes.control.currentValue.value) {
      // this.userGroups = changes.control.currentValue.value[0].userID !== '' ? changes.control.currentValue.value : changes.control.currentValue.value.splice(0, 1);
      changes.control.currentValue.value.forEach(function (itm, index) {
        if (itm.userID === '') {
          changes.control.currentValue.value.splice(index, 1);
        }
      });
      this.userGroups = changes.control.currentValue.value;
    }
  }

  emptyStateCtrl() {
    this.stateCtrl.setValue('');
    this.showClearIcon = false;
  }

  openGroupSelect(): void {
    let multipleDialogRef: MatDialogRef<MultipleAssigneesDialogComponent>;
    multipleDialogRef = this.matDialog.open(MultipleAssigneesDialogComponent, {
      width: '50rem',
      data: {
        title: 'Select Reviewers by Group'
      }
    });
    multipleDialogRef.afterClosed().subscribe(usersList => {
      if (usersList) {
        if (usersList.length > 0) {
          usersList.forEach(user => {
            this.addUserFromGroup(user);
          });
        }
      }
    });
  }

  /** Chips */
  addChip(event, arr, input) {
    const user = new User(event.option.value);
    // check duplicate user
    const isObjectDuplicate = this.isObjectExists(user, arr);
    if (!isObjectDuplicate) {
      arr.push(user);
      // arr.forEach(function (itm, index) {
      //   return itm.userId !== '';
      // });
      this.control.push(this.formBuilder.group(user));
      this.stateCtrl.updateValueAndValidity();
      this.setValidationStatus();
      this.userSelected.emit(user);
    }
    if (input) {
      input.value = '';
    }
  }

  addUserFromGroup(user) {
    user = new User(user);
    // check duplicate user
    const isObjectDuplicate = this.isObjectExists(user, this.userGroups);
    if (!isObjectDuplicate) {
      this.userGroups.push(user);
      this.control.push(this.formBuilder.group(user));
      this.stateCtrl.updateValueAndValidity();
      this.setValidationStatus();
      this.userSelected.emit(user);
    }
  }

  removeChip(index: number, arr): void {
    if (index >= 0) {
      this.userSelected.emit(arr[index]);
      arr.splice(index, 1);
      this.control.removeAt(index);

      this.stateCtrl.updateValueAndValidity();
      this.setValidationStatus();

    }
  }

  isObjectExists(item, arr) {
    const index = arr.findIndex(itm => itm.fullName === item.fullName);
    return index > -1;
  }

  customRequiredValidatorForMultiUser(multiUserSearchControl: FormArray): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (multiUserSearchControl.value && multiUserSearchControl.value.length > 0) {
        return null;
      }
      return {'user_required': true};
    };
  }

  setValidationStatus(): void {
    if (this.userchipList && (this.stateCtrl.errors && this.stateCtrl.errors.user_required)) {
      this.userchipList.errorState = true;
    } else {
      this.userchipList.errorState = false;
    }
  }

  hasValidator(): boolean {
    if (this.stateCtrl && this.stateCtrl.validator && this.stateCtrl.validator({} as AbstractControl)) {
      return (this.stateCtrl.validator({} as AbstractControl).hasOwnProperty('user_required'));
    } else {
      return false;
    }
  }

  getPlaceHolder(): string {
    return this.hasValidator() ? this.controlConfiguration.label + ' *' : this.controlConfiguration.label;
  }


}
