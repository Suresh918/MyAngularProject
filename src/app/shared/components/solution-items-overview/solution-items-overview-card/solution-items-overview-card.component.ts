import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {CaseObject, ImpactedItem, MiraiUser} from '../../../models/mc.model';

@Component({
  selector: 'mc-solution-items-overview-card',
  templateUrl: './solution-items-overview-card.component.html',
  styleUrls: ['./solution-items-overview-card.component.scss']
})
export class SolutionItemsOverviewCardComponent implements OnInit {
  @Input()
  solutionItem: ImpactedItem;
  @Input()
  caseObjectType: string;
  @Input()
  caseObject: CaseObject;
  @Input()
  caseAction: any;
  @Input()
  updateChangeOwnerAllowed: boolean;
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeNoticeFormGroup: FormGroup;
  @Output()
  readonly solutionItemEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly ownerChange: EventEmitter<any> = new EventEmitter<any>();
  userList: any[];
  creatorsList: any[];
  infoLevels = any;

  constructor() {
  }

  ngOnInit(): void {
    this.userList = this.solutionItem.users.map(item => {
      return { name: item.full_name + ' (' + item.abbreviation + ')', id: item.user_id};
    });
    if (!(this.solutionItem.creators instanceof MiraiUser)) {
      this.creatorsList = this.solutionItem.creators.map(item => {
        return {name: item.full_name + ' (' + item.abbreviation + ')', id: item.user_id};
      });
    } else {
      this.creatorsList = [{name: this.solutionItem.creators.full_name + ' (' + this.solutionItem.creators.abbreviation + ')', id: this.solutionItem.creators.user_id}];
    }
  }

  editSolutionItemDialog(event) {
    this.solutionItemEdit.emit(event);
  }

  onChangeOwner(item) {
    this.ownerChange.emit(item);
  }

}

