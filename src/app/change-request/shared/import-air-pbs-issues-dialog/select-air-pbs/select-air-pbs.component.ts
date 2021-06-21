import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup} from '@angular/forms';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

import {AirSearchService} from '../../../../core/services/air-search.service';
import {PbsSearchService} from '../../../../core/services/pbs-search.service';
import {ProductBreakdownStructure} from '../../../../shared/models/product-breakdown-structure.model';
import {Problems} from '../../../../shared/models/mc-presentation.model';
import {FormControlConfiguration} from '../../../../shared/models/mc-configuration.model';

@Component({
  selector: 'mc-select-air-pbs',
  templateUrl: './select-air-pbs.component.html',
  styleUrls: ['./select-air-pbs.component.scss'],
  providers: [PbsSearchService, AirSearchService]
})
export class SelectAirPbsComponent implements OnInit {
  @Input()
  linkedAirPbsItems: any[];
  @Input()
  readonly selectedAirPbsItems: any[];
  @Input()
  linkedAirIds: string[];
  @Input()
  linkedPbsIds: string[];
  @Input()
  createFrom?: string;
  @Input()
  pbsLength?: number;
  airSearchFormGroup: FormGroup;
  pbsSearchFormGroup: FormGroup;
  airSearchControl: FormControl;
  pbsSearchControl: FormControl;
  pbsFormConfiguration: FormControlConfiguration;
  airFormConfiguration: FormControlConfiguration;
  airSearchResults: Problems[];
  pbsSearchResults: ProductBreakdownStructure[];
  airSearchSubscription$: Subscription;
  pbsSearchSubscription$: Subscription;
  airPbsSearchResults: any[];
  showAirProgressBar: boolean;
  showPbsProgressBar: boolean;
  airPbsDividerIndex: number;
  snackBarRef: any;
  @Output() readonly selectionChangeEvent: EventEmitter<void> = new EventEmitter<void>();


  constructor(private readonly _matDialogAirSearchService: AirSearchService,
              private readonly _matDialogPbsSearchService: PbsSearchService,
              private readonly matSnackBar: MatSnackBar) {
    this.airPbsSearchResults = [];
    this.airSearchResults = [];
    this.pbsSearchResults = [];
    this.showAirProgressBar = false;
    this.showPbsProgressBar = false;
    this.airPbsDividerIndex = -1;
    this.airSearchControl = new FormControl('');
    this.pbsSearchControl = new FormControl('');
    this.airFormConfiguration = {
      'ID': 'AIRSearch',
      'placeholder': 'AIR ID Starts With',
      'label': 'AIR ID Starts With',
      'hint': 'At Least 5 Characters'
    };
    this.pbsFormConfiguration = {
      'ID': 'PBSSearch',
      'label': 'PBS ID Starts With',
      'placeholder': 'PBS ID Starts With',
      'hint': 'At Least 3 Characters'
    };
  }

  ngOnInit() {
    this.subscribeToAirControlChanges();
    this.subscribeToPbsControlChanges();
    if (this.linkedPbsIds && this.linkedPbsIds.length) {
      this.createFrom = 'air';
    }
  }

  subscribeToAirControlChanges(): void {
    this.airSearchSubscription$ = this.airSearchControl.valueChanges.pipe(
      debounceTime(1000),
      switchMap(airId => {
        this.showAirProgressBar = true;
        const airID = airId.toString();
        if (airID.trim().length >= 5) {
          return this._matDialogAirSearchService.findAIRByID$(airID.trim());
        } else {
          return of([] as Problems[]);
        }
      }), catchError(() => {
        this.showAirProgressBar = false;
        return of([] as Problems[]);
      }))
      .subscribe((airProblems: Problems[]) => {
        this.showAirProgressBar = false;
        airProblems = airProblems.map((obj) => {
          obj['itemType'] = 'AIR';
          return obj;
        });
        this.airSearchResults = airProblems || [];
        this.setSelectedStatusForSearchResults('air');
        this.handlePBSItems();
      });
  }

  subscribeToPbsControlChanges(): void {
    this.pbsSearchSubscription$ = this.pbsSearchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((productBreakDownStructureId) => {
        this.showPbsProgressBar = true;
        const productBreakDownStructureID = productBreakDownStructureId.toString();
        if (productBreakDownStructureID.trim().length >= 3) {
          return this._matDialogPbsSearchService.findPBSByID$(productBreakDownStructureID.trim());
        } else {
          return of([] as ProductBreakdownStructure[]);
        }
      }), catchError(err => {
        this.showPbsProgressBar = false;
        return of([] as ProductBreakdownStructure[]);
      }))
      .subscribe((pbsObjects) => {
        this.showPbsProgressBar = false;
        pbsObjects = pbsObjects.map((obj) => {
          obj['itemType'] = 'PBS';
          obj['id'] = obj['ID'];
          return obj;
        });
        this.pbsSearchResults = pbsObjects;
        this.setSelectedStatusForSearchResults('pbs');
        this.handlePBSItems();
      });
  }

  setSelectedStatusForSearchResults(type: string): void {
    if (type === 'air') {
      this.airSearchResults = this.airSearchResults.map(obj => {
        if (this.linkedAirIds && this.linkedAirIds.length > 0 && this.linkedAirIds.indexOf(obj.number) > -1) {
          obj['selected'] = true;
          obj['disableAdd'] = true;
        } else {
          obj['selected'] = this.isPresentInSelectedList(obj, 'air');
        }
        return obj;
      });
    } else {
      this.pbsSearchResults = this.pbsSearchResults.map(obj => {
        if (this.linkedPbsIds && this.linkedPbsIds.length > 0 && this.linkedPbsIds.indexOf(obj.id) > -1) {
          obj['selected'] = true;
          obj['disableAdd'] = true;
        } else {
          obj['selected'] = this.isPresentInSelectedList(obj, 'pbs');
          obj['disableAdd'] = !obj['is_linkable_to_change_request'];
        }
        return obj;
      });
    }
    this.combineAirPbsSearchResults();
  }

  isPresentInSelectedList(currentItem: Problems | ProductBreakdownStructure, type: string): boolean {
    for (const item of this.selectedAirPbsItems) {
      if (item && item.type && item.type.toLowerCase() === type) {
        if (type === 'pbs') {
          return (item.id === currentItem['id']);
        } else {
          return (item.number === currentItem['number']);
        }
      }
    }
    return false;
  }

  combineAirPbsSearchResults(): void {
    let searchResultsCount = 0;
    this.airPbsSearchResults = [];
    if (this.airSearchResults && this.airSearchResults.length > 0) {
      this.airPbsSearchResults = this.airPbsSearchResults.concat(this.airSearchResults);
      searchResultsCount++;
    }
    if (this.pbsSearchResults && this.pbsSearchResults.length > 0) {
      this.airPbsSearchResults = this.airPbsSearchResults.concat(this.pbsSearchResults);
      searchResultsCount++;
    }
    this.airPbsDividerIndex = searchResultsCount === 2 ? this.airSearchResults.length - 1 : -1;
  }

  addIssue(issueToAdd): void {
    const addedItem = this.airPbsSearchResults.find(item => item.number === issueToAdd.number);
    addedItem['selected'] = true;
    addedItem['disableAdd'] = true;
    addedItem['tooltipMessage'] = 'Already Added';
    issueToAdd['selected'] = true;
    this.selectedAirPbsItems.unshift(issueToAdd);
    this.selectionChangeEvent.emit();
    this.handlePBSItems();
  }

  handlePBSItems() {
    let pbsItemAdded = false;
    if (this.selectedAirPbsItems && this.selectedAirPbsItems.length > 0) {
      pbsItemAdded = this.selectedAirPbsItems.filter(item => item.itemType && item.itemType.toUpperCase() === 'PBS').length > 0;
    }
    this.airPbsSearchResults.forEach(item => {
      if (item.itemType && item.itemType.toUpperCase() === 'PBS') {
        item['disableAdd'] = !item.is_linkable_to_change_request || pbsItemAdded;
        item['tooltipMessage'] = this.getTooltipMessage(item, pbsItemAdded);
      } else {
        item['tooltipMessage'] = item.selected ? 'Already Added' : 'Add';
      }
    });
  }

  getTooltipMessage(item: any, pbsItemAdded: boolean): string {
    if (!item.is_linkable_to_change_request) {
      return 'You Can Not Add A PBS With This Status';
    } else if (pbsItemAdded && item.is_linkable_to_change_request && !item.selected) {
      return 'Only One PBS Can Be Added To A CR';
    } else if (item.selected) {
      return 'Already Added';
    } else {
      return 'Add';
    }
  }

  removeIssue(issueToDelete): void {
    let isUndone;
    let itemInSearchedList;
    const issueClone = issueToDelete;
    itemInSearchedList = this.airPbsSearchResults.filter(item => item.number === issueToDelete.number)[0];
    this.selectedAirPbsItems.splice(issueToDelete, 1);
    if (itemInSearchedList) {
      itemInSearchedList['selected'] = false;
      itemInSearchedList['disableAdd'] = false;
      itemInSearchedList['tooltipMessage'] = 'Add';
    }
    this.snackBarRef = this.matSnackBar.open('You have just deleted ' + issueClone.itemType + ' Issue of ID ' + (issueClone.number ? issueClone.number : issueClone.id) , 'Undo', {
      duration: 3000
    });
    this.snackBarRef.onAction().subscribe(() => {
      isUndone = true;
      this.selectedAirPbsItems.splice(issueToDelete, 0, issueClone);
    });
    this.snackBarRef.afterDismissed().subscribe(() => {
      if (isUndone) {
        return;
      }
      this.selectionChangeEvent.emit();
      this.handlePBSItems();
    });
  }

  emptyControl(type: string): void {
    if (type === 'air') {
      this.airSearchControl.setValue('');
    } else {
      this.pbsSearchControl.setValue('');
    }
  }

}
