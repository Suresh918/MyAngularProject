import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'mc-menu-empty-state-card',
  templateUrl: './menu-empty-state-card.component.html',
  styleUrls: ['./menu-empty-state-card.component.scss']
})
export class MCMenuEmptyStateCardComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  subTitle: string;
  @Input()
  description: string;
  @Input()
  icon: string;
  @Input()
  imageTemplateRef: TemplateRef<any>;
  constructor() { }

  ngOnInit() {
  }

}
