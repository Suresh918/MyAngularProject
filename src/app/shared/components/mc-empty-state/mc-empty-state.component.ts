import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'mc-empty-state',
  templateUrl: './mc-empty-state.component.html',
  styleUrls: ['./mc-empty-state.component.scss']
})
export class MCEmptyStateComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  subTitle: string;
  @Input()
  description: string;
  @Input()
  icon: string;
  @Input()
  imageURL: string;
  @Input()
  svgIcon: string;
  @Input()
  imageTemplateRef: TemplateRef<any>;
  @Input()
  subTitleTemplateRef: TemplateRef<any>;
  @Input()
  titleTemplateRef: TemplateRef<any>;
  @Input()
  descriptionTemplateRef: TemplateRef<any>;
  @Input()
  isPageLevel: boolean;
  @Input()
  iconSize: string;
  constructor() { }

  ngOnInit(): void {
  }

}
