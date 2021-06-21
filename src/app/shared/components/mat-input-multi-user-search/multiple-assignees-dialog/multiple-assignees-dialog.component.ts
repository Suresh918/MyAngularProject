import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import {FormControlConfiguration} from "../../../models/mc-configuration.model";
import {UserGroupService} from "../../../../core/services/user-group.service";


@Component({
  selector: 'mc-multiple-assignees-dialog',
  templateUrl: './multiple-assignees-dialog.component.html',
  styleUrls: ['./multiple-assignees-dialog.component.scss']
})
export class MultipleAssigneesDialogComponent implements OnInit {
  assigneeFormControl: FormControl;
  assigneeFormConfiguration: FormControlConfiguration;
  title: string;
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  progressBar: boolean;
  selection = new SelectionModel(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly userGroupService: UserGroupService,
    public dialogRef: MatDialogRef<MultipleAssigneesDialogComponent>) {
    this.displayedColumns = ['select', 'groupMember', 'abbreviation', 'emailAddress', 'department'];
    this.progressBar = false;
  }

  ngOnInit() {
    this.title = this.data.title;
    this.assigneeFormConfiguration = {
      'placeholder': 'Group'
    } as FormControlConfiguration;
    this.assigneeFormControl = new FormControl();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onGroupSelected(group): void {
    this.selection.clear();
    if (group.value) {
      this.progressBar = true;
      this.userGroupService.getGroupUserList(group.value).subscribe({
        next: (response) => {
          const data = response;
          this.dataSource.data = data.users;
          this.progressBar = false;
          this.dataSource.data.forEach(row => this.selection.select(row));
        },
        error: err => {
          this.onError(err);
        }
      });
    } else {
      this.dataSource.data = [];
    }
  }

  onSelectUsers(): void {
    this.dialogRef.close(this.selection.selected);
  }

  onCancelPress(): void {
    this.dialogRef.close();
  }

  onError(err): void {
    this.progressBar = false;
  }

}
