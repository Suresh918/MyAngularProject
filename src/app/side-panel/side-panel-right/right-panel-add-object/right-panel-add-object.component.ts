import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
  selector: 'mc-right-panel-add-object',
  templateUrl: './right-panel-add-object.component.html',
  styleUrls: ['./right-panel-add-object.component.scss']
})
export class RightPanelAddObjectComponent {
  @Input() tooltip: string;
  @Input() buttonCaseAction: string;
  @Input() showBulkEdit: boolean;
  @Output() readonly add: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly bulkReviewersUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }
}
