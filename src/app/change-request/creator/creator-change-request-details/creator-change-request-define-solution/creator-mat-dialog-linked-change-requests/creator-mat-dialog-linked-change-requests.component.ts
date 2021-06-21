import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {merge, of, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';

import {CreatorLinkedChangeRequestDialogService} from './creator-mat-dialog-linked-change-requests.service';
import {AbstractChangeRequest} from '../../../../../change-notice/creator/creator-change-notice-details/creator-change-notice-define/mat-dialog-creator-linked-change-requests/mat-dialog-creator-linked-change-requests';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {HelpersService} from '../../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-creator-linked-change-request-dialog',
  templateUrl: './creator-mat-dialog-linked-change-requests.component.html',
  styleUrls: ['./creator-mat-dialog-linked-change-requests.component.scss'],
  providers: [CreatorLinkedChangeRequestDialogService]
})

export class CreatorMatDialogLinkedChangeRequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  linkedChangeRequestDataSource: MatTableDataSource<AbstractChangeRequest>;
  changeRequestSearchForm: FormGroup;
  changeRequestSearchSubscription$: Subscription;
  displayedColumns: string[];
  selectedChangeRequestItems: AbstractChangeRequest[];
  disableOthers: boolean;
  progressBar: boolean;
  excludeChangeRequestWithId: string;
  disableLink: boolean;
  caseObjectListId: string[];
  resultsLength: number;

  constructor(public dialogRef: MatDialogRef<CreatorMatDialogLinkedChangeRequestsComponent>,
              private readonly formBuilder: FormBuilder,
              public readonly helpersService: HelpersService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly linkedChangeRequestDialogService: CreatorLinkedChangeRequestDialogService) {
    this.changeRequestSearchForm = this.formBuilder.group({
      changeRequestSearchControl: ['']
    });
    this.excludeChangeRequestWithId = data.workingChangeRequestID;
    this.linkedChangeRequestDataSource = new MatTableDataSource();
    this.selectedChangeRequestItems = [];
    this.displayedColumns = ['changeRequestChecked', 'title', 'status'];
    this.progressBar = false;
    this.disableOthers = false;
    this.caseObjectListId = data.caseObjectListId;
  }

  ngOnInit() {
    this.disableLink = true;
  }

  ngAfterViewInit() {
    this.createObserverForChangeRequestSearch();
  }

  createObserverForChangeRequestSearch(): void {
    this.changeRequestSearchSubscription$ = merge(this.changeRequestSearchForm.get('changeRequestSearchControl').valueChanges, this.paginator.page).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(val => this.changeRequestSearchForm.get('changeRequestSearchControl').value.length >= 3),
      switchMap(changeRequestId => {
        this.progressBar = true;
        return this.linkedChangeRequestDialogService.linkedChangeRequests$(this.changeRequestSearchForm.get('changeRequestSearchControl').value, this.getExcludedChangeRequestId(), this.paginator.pageIndex, this.paginator.pageSize);
      }),
      catchError(() => {
        this.progressBar = false;
        return of({});
      }))
      .subscribe(res => {
        this.progressBar = false;
        if (res['results'] && (!this.selectedChangeRequestItems[0] || !this.selectedChangeRequestItems[0].selected)) {
          const crList = this.processResponse(res['results']);
          this.selectedChangeRequestItems = crList.map(obj => {
            obj['selected'] = false;
            return obj;
          }) as AbstractChangeRequest[];
          this.linkedChangeRequestDataSource.data = this.selectedChangeRequestItems;
          this.resultsLength = res['total_elements'];
        }
      });
  }

  ngOnDestroy() {
    if (this.changeRequestSearchSubscription$) {
      this.changeRequestSearchSubscription$.unsubscribe();
    }
  }

  linkProblems(): void {
    const linkedItems = this.selectedChangeRequestItems.filter(obj => obj.selected).map(obj => obj);
    this.dialogRef.close(linkedItems);
  }

  disableOtherCheckboxes(oEvent): void {
    this.disableOthers = !!oEvent.checked;
    this.disableLink = this.selectedChangeRequestItems.filter(obj => obj.selected).map(obj => obj).length === 0;
  }

  getExcludedChangeRequestId() {
    let caseObjectId = ' and change_request_number!' + this.excludeChangeRequestWithId;
    if (this.caseObjectListId) {
      this.caseObjectListId.forEach((res, index) => {
        caseObjectId += ` and change_request_number!` + res;
      });
    }
    return caseObjectId;
  }

  onClose() {
    this.dialogRef.close();
  }

  processResponse(res) {
    const CRSummaryList = [];
    if (res && res.length && res.length > 0) {
      res.forEach(item => {
        CRSummaryList.push({
          'ID': item.id,
          'title': item.title,
          'status': item.status,
          'customerImpactResult': item.customer_impact,
          'preInstallImpactResult': item.preinstall_impact,
          'implementationPriority': item.implementation_priority,
          'statusLabel': this.helpersService.getCRStatusLabelFromStatus(item.status)
        });
      });
    }
    return CRSummaryList;
  }
}
