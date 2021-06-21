import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  selectAllCaseActions,
  selectCaseAction,
  selectCaseActionEntities,
  selectCaseObject,
  selectCaseObjectType
} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseObject} from '../../models/mc.model';
import {MatDialogNavigationConfirmationComponent} from '../mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-button',
  template: ''
})
export class MCButtonComponent implements OnInit, OnDestroy {
  @Input()
  set text(value: string) {
    if (value) {
      this.name = value;
    }
  }

  @Input()
  tooltip: string;
  @Input()
  tooltipForDisabled: string;
  @Input()
  color: string;
  @Input()
  noCheckOnCaseAction: boolean;
  @Input()
  buttonAction: string;
  @Input()
  disabled: boolean;
  @Input()
  isLinkedItem: boolean;
  @Input()
  isGenericButton: boolean;
  @Input()
  caseObjectType: string;
  @Input()
  hasBadge: boolean;
  @Input()
  badgeData: any;
  @Input()
  badgeSize: BadgeSize;
  @Input()
  isBadgeDisabled: boolean;
  @Input()
  showDialogNotApplicable: boolean;
  @Input()
  buttonId: string;
  @Input()
  set state(value: ButtonState) {
    if (value) {
      this.currentState = value;
    }
  }

  @Input()
  set caseObject(caseObject: CaseObject) {
    this.caseObjectData = caseObject;
    if (caseObject && caseObject.ID && this.buttonAction && this.isLinkedItem) {
      this.caseObjectType = caseObject.type;
      this.subscribeToActionButton();
      this.getServiceParameters();
    }
  }

  get caseObject() {
    return this.caseObjectData;
  }

  @Output()
  readonly buttonClick: EventEmitter<any> = new EventEmitter<any>();
  caseObjectData: CaseObject;
  buttonAction$: Observable<boolean>;
  caseObjectTypeSubscription$: Subscription;
  caseObjectSubscription$: Subscription;
  caseObjectForButton;
  name: string;
  message: string;
  showDialog: boolean;
  buttonDisabled: boolean;
  currentState: string;
  defaultButtonID: string;

  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly serviceParametersService: ServiceParametersService,
              private readonly storeHelperService: StoreHelperService,
              private readonly configurationService: ConfigurationService,
              public readonly dialog: MatDialog) {
  }

  ngOnInit() {
    if (!(this.isLinkedItem || this.isGenericButton)) {
      this.subscribeToCaseObjectType();
      this.subscribeToCaseObject();
      this.getServiceParameters();
    } else if (this.buttonAction && this.isGenericButton) {
      this.getServiceParameters();
    }
  }

  subscribeToCaseObjectType(): void {
    this.caseObjectTypeSubscription$ = this.appStore.pipe(select(selectCaseObjectType)).subscribe((type: string) => {
      if (type) {
        this.caseObjectType = this.caseObjectType ? this.caseObjectType : type;
        this.getServiceParameters();
      }
    });
  }

  subscribeToCaseObject(): void {
    this.caseObjectSubscription$ = this.appStore.pipe(select(selectCaseObject)).subscribe((data) => {
      if (data && (data['ID'] || data['id'])) {
        this.caseObject = new CaseObject((data['ID'] || data['id']), data['revision'] || '', this.caseObjectType);
        this.subscribeToActionButton();
      }
    });
  }

  subscribeToActionButton(): void {
    this.buttonAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector(this.caseObjectType, this.buttonAction, this.caseObject.ID, this.caseObject.revision)
    ));
  }

  onButtonClick($event): void {
    if (this.showDialog && !this.showDialogNotApplicable) {
      let dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>;
      dialogRef = this.dialog.open(MatDialogNavigationConfirmationComponent, {
        width: '50rem',
        data: {
          isCaseObject: true,
          message: this.message
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.buttonClick.emit($event);
        }
      });
    } else {
      this.buttonClick.emit($event);
    }
  }

  getServiceParameters() {
    if (!this.caseObjectType && this.caseObject) {
      this.caseObjectType = this.caseObject.type;
    }
    // need to be removed when service parameters are renamed
    let caseObjectType = this.caseObjectType;
    switch (caseObjectType) {
      case 'ChangeRequest':
        caseObjectType = 'ChangeRequest2.0';
        break;
      case 'ReleasePackage':
        caseObjectType = 'ReleasePackage2.0';
        break;
      case 'ReviewTask':
        caseObjectType = 'Reviewer2.0';
        break;
      case 'Review':
        caseObjectType = 'Review2.0';
        break;
      case 'ReviewEntry':
        caseObjectType = 'ReviewEntry2.0';
        break;
      case 'ProblemItem':
      case 'SolutionItem':
      caseObjectType = 'ImpactedItem';
      break;
    }
    const convertedCaseObjectType = JSON.parse(JSON.stringify(this.caseObjectType || ''))
      .replace(
        /\.?([A-Z]+)/g,
        function (x, y) {
          return '_' + y.toLowerCase();
        }).replace(/^_/, '');
    this.defaultButtonID =
      `${convertedCaseObjectType}_${this.buttonAction ? this.buttonAction.toLowerCase() : ''}_${this.caseObject?.ID}`;
    this.caseObjectForButton = this.configurationService.getFormActionParameters(caseObjectType, this.buttonAction);
    Object.keys(this.caseObjectForButton).forEach((itemKey) => {
      switch (itemKey) {
        case 'label':
          this.name = this.name || this.caseObjectForButton.label;
          return;
        case 'tooltip':
          this.tooltip = this.tooltip || this.caseObjectForButton.tooltip;
          return;
        case 'tooltip_when_disabled':
          this.tooltipForDisabled = this.tooltipForDisabled || this.caseObjectForButton.tooltip_when_disabled || this.tooltip;
          return;
        case 'confirmation_message':
          if (this.caseObjectForButton.confirmation_message) {
            this.message = this.caseObjectForButton.confirmation_message;
            this.showDialog = true;
          }
          return;
        case 'not_applicable_handle':
          this.buttonDisabled = (this.caseObjectForButton.not_applicable_handle === 'DISABLE');
          return;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.caseObjectTypeSubscription$) {
      this.caseObjectTypeSubscription$.unsubscribe();
    }
    if (this.caseObjectSubscription$) {
      this.caseObjectSubscription$.unsubscribe();
    }
  }
}
