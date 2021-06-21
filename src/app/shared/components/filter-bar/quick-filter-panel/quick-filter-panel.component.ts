import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {FilterOptions, People} from 'app/shared/models/mc-filters.model';
import {MatDialogFilterGroupDeleteComponent} from './mat-dialog-filter-group-delete/mat-dialog-filter-group-delete.component';
import {CaseObjectFilterLabel} from '../../case-object-list/case-object.enum';
import {HelpersService} from 'app/core/utilities/helpers.service';
import {MatDialogImportQuickFilterComponent} from './mat-dialog-import-quick-filter/mat-dialog-import-quick-filter.component';
import {Permission, User} from 'app/shared/models/mc.model';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-quick-filter-panel',
  templateUrl: './quick-filter-panel.component.html',
  styleUrls: ['./quick-filter-panel.component.scss']
})
export class QuickFilterPanelComponent implements OnInit {
  showInputFilter: boolean;
  filterName: string;
  caseObjectLabel: string;
  isDuplicateFilterName: boolean;
  @Input()
  caseObject: string;
  @Input()
  caseObjectFilters: { [key: string]: FilterOptions };
  @Output()
  readonly quickFilterAdded: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly quickFilterSelected: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @Output()
  readonly quickFilterRemoved: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly quickFilterImported: EventEmitter<{ filterName: string, filterOptions: FilterOptions,
    caseObject: string }> = new EventEmitter<{ filterName: string, filterOptions: FilterOptions, caseObject: string }>();

  @ViewChild('quickFilterMenu') quickFilterMenu;
  @ViewChild('copyFilterQuery') filterQuery: ElementRef;
  @ViewChild('name') filterNameElement: ElementRef;
  constructor(public readonly matDialog: MatDialog,
              private readonly configurationService: ConfigurationService,
              private readonly helperService: HelpersService,
              public readonly matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  setFocus() {
    setTimeout(() => {
      this.filterNameElement.nativeElement.focus();
    }, 10);
  }

  resetFilterValues() {
    this.showInputFilter = false;
    this.filterName = '';
    this.caseObjectLabel = CaseObjectFilterLabel[this.caseObject];
    this.isDuplicateFilterName = false;
  }

  addFilter(filterName: string, overrideFilterName: boolean): void {
    this.isDuplicateFilterName = overrideFilterName ? !overrideFilterName : this.validateFilterName(filterName);
    if (!this.isDuplicateFilterName) {
      this.showInputFilter = false;
      this.quickFilterAdded.emit(filterName);
      this.filterName = '';
    }
  }

  removeFilter(event: any, filterName: string): void {
    event.stopPropagation();
    let dialogRef: MatDialogRef<MatDialogFilterGroupDeleteComponent>;
    dialogRef = this.matDialog.open(MatDialogFilterGroupDeleteComponent, {
      width: '40rem',
      data: {
        title: 'Delete Filter',
        body: 'Are you sure you want to delete this Filter?',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quickFilterRemoved.emit(filterName);
        this.filterName = (this.filterName === filterName ? '' : this.filterName);
      }
    });

  }

  customOptionSelected(filterName: string) {
    this.quickFilterSelected.emit(this.caseObjectFilters[filterName]);
    this.quickFilterMenu.close.emit();
  }

  quickOptionSelected(roleName: string, roleLabel: string) {
    const user = new User(this.configurationService.getUserProfile());
    let roleObj;
    if (roleName === 'allUsers') {
      roleObj = {
        'value': roleName,
        'label': roleLabel
      };
    } else {
      roleObj = this.configurationService.getFormFilterOptionDataByValue(this.helperService.getCaseObjectForms(this.caseObject).caseObject, 'filter.role', roleName);
    }
    const currentValue = new FilterOptions({});
    if (roleName && user.userID) {
      currentValue.people = [{
        user: user,
        role: roleObj
      }];
      this.quickFilterSelected.emit(currentValue);
      this.quickFilterMenu.close.emit();
    }
  }

  secondaryFilterOption(name: string, status?: string) {
    const currentValue = new FilterOptions({});
    const todayDate = new Date();
    if (name === 'dueDate') {
      currentValue.dueDate = {
        begin: todayDate,
        end: new Date(new Date().setDate(todayDate.getDate() + 7))
      };
    }
    if (name === 'agenda') {
      currentValue.meetingDate = {
        begin: todayDate,
        end: new Date(new Date().setDate(todayDate.getDate() + 7))
      };
    }
    if (name === 'upcomingMeetingsWidget') {
      currentValue.group = this.getGroupsFromUserSettings();
    }
    if (name === 'decisionLog') {
      !status ? currentValue.meetingDate = {
          begin: new Date(new Date().setDate(todayDate.getDate() - 7)),
          end: todayDate
        } :
        currentValue.decision = ['Reject'];
    }

    if (name === 'review') {
      if (status === 'OPEN') {
        currentValue.status = [{ label: 'Open', value: '1', sequence: 1 }];
      } else if (status === 'myIncompleteReviewTask') {
        currentValue['quickFilter'] = true;
        const people = {} as People;
        people['role'] = { value: 'reviewer', label: 'Reviewer', sequence: 3};
        people['user'] = new User(this.configurationService.getUserProfile());
        currentValue.people.push(people);
        currentValue.review_tasks_status =
          [{ label: 'Open', value: '1', sequence: 1 }, { label: 'Accepted', value: '2', sequence: 2 }];
      } else {
        currentValue.dueDate = {
          begin: todayDate,
          end: new Date(new Date().setDate(todayDate.getDate() + 7))
        };
      }
    }


    this.quickFilterSelected.emit(currentValue);
    this.quickFilterMenu.close.emit();
  }

  getGroupsFromUserSettings(): Array<Permission> {
    const groups: Permission[] = [];
    const user = this.configurationService.getUserProfile();
    user['memberships'].forEach((member) => {
      if (member.includes('-ccb-') || member.includes('-cb-') ) {
        groups.push(member);
      }
    });
    return groups;
  }

  copyToClipBoard(filterName: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.helperService.generateFilterQuery(filterName, this.caseObjectFilters[filterName], this.caseObject)));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.matSnackBar.open('Filter copied to clipboard', '', { duration: 2000 });
  }

  getKeys(object: Object): string[] {
    return Object.keys(object);
  }

  openImportFilterDialog(event) {
    event.stopPropagation();
    let dialogRef: MatDialogRef<MatDialogImportQuickFilterComponent>;
    dialogRef = this.matDialog.open(MatDialogImportQuickFilterComponent, {
      width: '40rem',
      data: {
        title: 'Import quick filter',
        body: {
          caseObject: this.caseObjectLabel || '',
          caseObjectFilters: this.caseObjectFilters || []
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.filterName && result.caseObject) {
        this.quickFilterImported.emit(result);
      }
    });
  }

  validateFilterName(name: string): boolean {
    return Object.keys(this.caseObjectFilters).indexOf(name) > -1;
  }
}
