import {Component, Input, OnInit} from '@angular/core';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

@Component({
  selector: 'mc-expansion-panel-list-work-instruction-comments',
  templateUrl: './mc-expansion-panel-list-work-instruction-comments.component.html',
  styleUrls: ['./mc-expansion-panel-list-work-instruction-comments.component.scss']
})
export class McExpansionPanelListWorkInstructionCommentsComponent implements OnInit {
  isBusy: boolean;
  wiComments: any[];
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  hidePanel: boolean;
  @Input()
  fontsize: string;
  @Input()
  isExpanded: boolean;

  @Input()
  set itemsList(commentData: any[]) {
    this.wiComments = commentData;
    if (this.wiComments && this.wiComments.length > 0) {
      this.createItemList();
    }
  }

  get itemsList() {
    return this.wiComments;
  }

  header: string;
  imageUrl: string;
  expansionPanelItemConfigurationList: ExpansionPanelItemConfiguration[];
  emptyStatedata: EmptyStateData;

  constructor() {
  }

  ngOnInit() {
    this.header = 'Linked Work Instruction Comments';
    this.emptyStatedata = {
      title: 'No Linked Work Instruction Comments Available',
      subTitle: 'Added Linked Work Instruction Comments Will Appear Here',
      imageURL: window.location.origin + '/assets/icons/Problem_Items_WI_icon_36x36.svg'
    };
    this.itemsList = [];
  }

  createItemList() {
    this.expansionPanelItemConfigurationList = this.itemsList.map((wiComment: any) => {
      const expansionPanelItemConfiguration = new ExpansionPanelItemConfiguration();
      expansionPanelItemConfiguration.ID = wiComment.id;
      expansionPanelItemConfiguration.mainDescription = wiComment.id;
      expansionPanelItemConfiguration.line1 = wiComment.description;
      expansionPanelItemConfiguration.isClickable = false;
      expansionPanelItemConfiguration.imageURL = this.imageUrl;
      return expansionPanelItemConfiguration;
    });
  }

  onItemClick(event) {

  }
}
