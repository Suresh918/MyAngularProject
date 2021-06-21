import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-expansion-draggable-section',
  templateUrl: './mc-expansion-draggable-section.component.html',
  styleUrls: ['./mc-expansion-draggable-section.component.scss']
})
export class MCExpansionDraggableSectionComponent implements OnInit {
  @Input()
  isExpanded: boolean;
  ngOnInit() {
    this.isExpanded = this.isExpanded || true;
  }
}
