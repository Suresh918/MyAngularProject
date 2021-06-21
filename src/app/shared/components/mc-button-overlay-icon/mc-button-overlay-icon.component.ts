import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'mc-button-overlay-icon',
  templateUrl: './mc-button-overlay-icon.component.html',
  styleUrls: ['./mc-button-overlay-icon.component.scss']
})
export class MCButtonOverlayIconComponent implements OnInit {
  @Input()
  headerIcon: string;
  @Input()
  name: string;
  @Input()
  headerTitle: any;
  @Input()
  menuContentRef: TemplateRef<any>;
  @Input()
  tooltip: string;
  constructor() { }

  ngOnInit(): void {
  }

}
