import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HelpersService } from '../../../../../core/utilities/helpers.service';
import { FilterOptions } from '../../../../models/mc-filters.model';

@Component({
  selector: 'mc-mat-dialog-import-quick-filter',
  templateUrl: './mat-dialog-import-quick-filter.component.html',
  styleUrls: ['./mat-dialog-import-quick-filter.component.scss']
})
export class MatDialogImportQuickFilterComponent {
  caseObjectName: string;
  showFilterQueryView = true;
  duplicateFilterExist = false;
  quickFilterQuery: string = '';
  quickFilterName: string;
  importedFilterObject: { filterName: string, filterOptions: FilterOptions, caseObject: string };
  constructor(public dialogRef: MatDialogRef<MatDialogImportQuickFilterComponent>,
              public readonly helpersService: HelpersService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  close(decision: boolean) {
    this.dialogRef.close(decision);
  }

  decodeQueryString() {
    this.importedFilterObject = JSON.parse(atob(this.quickFilterQuery)) ? JSON.parse(atob(this.quickFilterQuery)) : {};
    this.caseObjectName = this.helpersService.getCaseObjectForms(this.importedFilterObject.caseObject).abbr;
    this.quickFilterName = this.importedFilterObject.filterName;
    this.showFilterQueryView = false;
  }

  importQuery(overrideFilterName: string): void {
    this.duplicateFilterExist = overrideFilterName ? !overrideFilterName : this.validateFilterName(this.quickFilterName);
    if (!this.duplicateFilterExist) {
      this.importedFilterObject.filterName = this.quickFilterName;
      this.dialogRef.close(this.importedFilterObject);
    }
  }

  validateFilterName(name: string): boolean {
    return Object.keys(this.data.body.filterStateModel || this.data.body.caseObjectFilters).indexOf(name) > -1;
  }
}
