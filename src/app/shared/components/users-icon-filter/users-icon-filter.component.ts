import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-users-icon-filter',
  templateUrl: './users-icon-filter.component.html',
  styleUrls: ['./users-icon-filter.component.scss']
})
export class UsersIconFilterComponent implements OnInit {
  showOverflowIcon: boolean;
  displayUserList: any[];
  hiddenUserList: any[];
  userList: any[];
  @Output()
  readonly userFilterChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  usersCountOnDisplayList: number;

  @Input()
  set reviewerSummaryList(list: any[]) {
    this.userList = list;
    this.checkListOverflow();
  }

  get reviewerSummaryList(): any[] {
    return this.userList;
  }

  @Input()
  set usersIconFilterDivWidth(width) {
    // tslint:disable-next-line:radix
    this.usersCountOnDisplayList = width !== undefined ? parseInt(String(Number(width) / 60)) : 4;
    this.checkListOverflow();
  }

  constructor() {
    this.showOverflowIcon = false;
  }

  ngOnInit(): void {
    this.checkListOverflow();
  }

  checkListOverflow() {
    this.displayUserList = [];
    this.hiddenUserList = [];
    this.showOverflowIcon = false;
    this.userList.forEach((reviewEntry, index) => {
      if (index < this.usersCountOnDisplayList) {
        this.displayUserList.push(reviewEntry);
      } else if (index >= this.usersCountOnDisplayList) {
        this.hiddenUserList.push(reviewEntry);
        this.showOverflowIcon = true;
      }
    });
  }

  userSelected(event) {
    event['is_selected'] = !event.is_selected;
    const selectedUsers = this.userList.filter(reviewEntry => reviewEntry && reviewEntry.is_selected);
    this.userFilterChanged.emit(selectedUsers);
  }

}
