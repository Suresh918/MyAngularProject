import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CaseObjectOverview} from '../../case-object-list.model';

@Component({
  selector: 'mc-case-object-details-card',
  templateUrl: './case-object-overview-card.component.html',
  styleUrls: ['./case-object-overview-card.component.scss']
})
export class CaseObjectOverviewCardComponent {
  @Input()
  caseObjectType: string;

  @Input()
  caseObjectLabel: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  caseObject: CaseObjectOverview;

  @Input()
  hasPagination: boolean;

  @Input()
  showItemDeleteButton: boolean;

  @Input()
  deleteButtonCaseAction: string;

  @Input()
  referenceComponent: string;

  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly selectedItem: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  onDeleteItem($event): void {
    this.deleteItem.emit($event);
  }

  onSelectedItem($event): void {
    this.selectedItem.emit($event);
  }
}
