import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectCaseAction, selectCaseObject} from "../../../store";
import {MyChangeState} from "../../models/mc-store.model";
import {StoreHelperService} from "../../../core/utilities/store-helper.service";
import {CaseObject} from '../../models/mc.model';

@Component({
  selector: 'mc-divider',
  templateUrl: './mc-divider.component.html',
  styleUrls: ['./mc-divider.component.scss']
})
export class McDividerComponent implements OnInit, OnDestroy {
  @Input()
  isVertical?: boolean;
  @Input()
  caseObjectType: string;
  @Input()
  buttonAction: string;
  @Input()
  isLinkedItem: boolean;
  @Input()
  isGenericButton: boolean;
  @Input()
  width?: string;
  @Input()
  height?: string;

  @Input()
  set caseObject(caseObject: CaseObject) {
    this.caseObjectData = caseObject;
    if (caseObject && caseObject.ID && this.buttonAction && this.isLinkedItem) {
      this.caseObjectType = caseObject.type;
      this.subscribeToActionButton();
    }
  }

  get caseObject() {
    return this.caseObjectData;
  }

  caseObjectData: CaseObject;
  buttonAction$: Observable<boolean>;
  caseObjectSubscription$: Subscription;
  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly storeHelperService: StoreHelperService) { }

  ngOnInit(): void {
    if (!(this.isLinkedItem || this.isGenericButton)) {
      this.subscribeToCaseObject();
    }
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

  ngOnDestroy(): void {
    if (this.caseObjectSubscription$) {
      this.caseObjectSubscription$.unsubscribe();
    }
  }

}
