import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Permission} from '../../../../models/mc.model';
import {FormControlConfiguration} from '../../../../models/mc-configuration.model';
import {UserGroupService} from '../../../../../core/services/user-group.service';



@Component({
  selector: 'mc-mat-multi-assignee-groups',
  templateUrl: './mat-multi-assignee-groups.component.html',
  styleUrls: ['./mat-multi-assignee-groups.component.scss']
})

export class MatMultiAssigneeGroupsComponent implements AfterViewInit {

  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @ViewChild('userInput') userInput: ElementRef;
  @Output() readonly groupSelected = new EventEmitter<string>();
  progressBar: boolean;
  showClearIcon: boolean;
  disabled: boolean;
  selectedGrpup: boolean;
  list$: Observable<Permission[]>;

  constructor(private readonly userGroupService: UserGroupService) {
    this.progressBar = false;
    this.showClearIcon = false;
    this.selectedGrpup = false;
    this.disabled = false;
  }

  ngAfterViewInit() {
    if (this.control) {
      this.list$ = this.control.valueChanges.pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap((name: string | any) => {
          if (name && name.length >= 1 && !this.selectedGrpup) {
            this.progressBar = true;
            return this.userGroupService.getGroups(name);
          } else {
            return of([]);
          }
        }), catchError(() => {
          this.progressBar = false;
          return of([]);
        }), map(res => {
          this.progressBar = false;
          return res ? res['groups'] : [];
        }));
    }
  }

  emitUsersList(event: any): void {
    this.disabled = true;
    this.showClearIcon = true;
    this.selectedGrpup = true;
    const value = event.option.value;
    this.userInput.nativeElement.value = value;
    this.groupSelected.emit(value);
  }

  emptyStateCtrl() {
    this.control.setValue('');
    this.groupSelected.emit('');
    this.showClearIcon = false;
    this.selectedGrpup = false;
    this.disabled = false;
  }
}
