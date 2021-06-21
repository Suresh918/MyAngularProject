import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-no-actions',
  templateUrl: './no-actions.component.html',
  styleUrls: ['./no-actions.component.scss']
})
export class NoActionsComponent implements OnInit {
  @Input()
  caseObject: string;
  @Input()
  selectedToggleOption: string;

  @Input()
  set allActionsCount(allActionsCount: number) {
    if (this.selectedToggleOption === 'OPEN') {
      this.title = (allActionsCount) ? 'No Open/Accepted Actions' : 'No Actions';
      this.message = (allActionsCount) ? `There Are ${allActionsCount} Actions With Other Statuses` : this.getMessageForCaseObject();
    } else {
      this.title = 'No Actions';
      this.message = this.getMessageForCaseObject();
    }
  }

  title: string;
  message: string;

  constructor() {
  }

  ngOnInit() {
  }

  getMessageForCaseObject(): string {
    switch (this.caseObject) {
      case 'ChangeRequest' :
        return 'All actions for this CR will appear here. This includes actions that are not assigned to you.';
      case 'ChangeNotice' :
        return 'All actions for this CN will appear here. This includes actions that are not assigned to you.';
      case 'ReleasePackage':
        return 'All actions for this RP will appear here. This includes actions that are not assigned to you.';
      default:
        return 'All actions appear here.';
    }
  }

}
