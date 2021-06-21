import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'mc-card-summary',
  templateUrl: './mc-card-summary.component.html',
  styleUrls: ['./mc-card-summary.component.scss']
})
export class MCCardSummaryComponent {
  @Input()
  item: any;
  @Input()
  id: any;
  @Input()
  label: string;
  @Input()
  mainDescriptionLink: string;
  @Input()
  labelCaption: string;
  @Input()
  mainDescription: string;
  @Input()
  mainDescriptionCaption: string;
  @Input()
  line1: string;
  @Input()
  line1Caption: string;
  @Input()
  line2: string;
  @Input()
  line2Caption: string;
  @Input()
  line3: string;
  @Input()
  line3Caption: string;
  @Input()
  separator: string;
  @Input()
  fontsize: string;
  @Input()
  isMainDescriptionHTML: boolean;
  @Input()
  headerClickable?: boolean;
  @Input()
  headerLink?: string;
  @Input()
  mainDescriptionTemplateRef: TemplateRef<any>;
  @Input()
  wordWrapApplicable?: boolean;
  @Input()
  labelTemplateRef: TemplateRef<any>;
  @Input()
  line2TemplateRef: TemplateRef<any>;
  @Input()
  line3TemplateRef: TemplateRef<any>;
  @Input()
  showActionButtonOnFocus: boolean;
  @Output()
  readonly mainDescriptionClick: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  iconImageTemplateRef?: TemplateRef<any>;
  @Input()
  actionTemplateRef?: TemplateRef<any>;

  onLabelClick(label: string) {
    this.mainDescriptionClick.emit(label);
  }
}

