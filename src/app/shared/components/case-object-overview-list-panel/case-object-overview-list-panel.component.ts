import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CaseObject} from '../../models/mc.model';

@Component({
  selector: 'mc-case-object-card-list-panel',
  templateUrl: './case-object-overview-list-panel.component.html',
  styleUrls: ['./case-object-overview-list-panel.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class CaseObjectOverviewListPanelComponent implements OnInit {
  @Input()
  caseObjectType: string;

  @Input()
  caseObjectLabel: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  filterQuery: string;

  @Input()
  isPanelExpanded = true;

  @Input()
  panelTitle: string;

  @Input()
  showAddButton: boolean;

  @Input()
  showItemDeleteButton: boolean;

  @Input()
  caseObjectListOverview: any;

  @Input()
  addButtonCaseAction: string;


  @Input()
  deleteButtonCaseAction: string;

  @Input()
  caseObject: CaseObject;

  @Input()
  isBusy?: boolean;
  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  readonly addItem: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  readonly caseObjectListIdPanel: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor() {
  }

  ngOnInit() {
  }

  onDeleteItem($event): void {
    this.deleteItem.emit($event);
  }

  onAddItem(): void {
    this.addItem.emit();
  }

  onCaseObjectListId($event) {
    this.caseObjectListIdPanel.emit($event);
  }
}
