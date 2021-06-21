import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'mc-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  historyList: any[];

  constructor() {
  }

  ngOnInit() {
    this.historyList = [{
      'id': 200001,
      'content': 'history sample content'
    }, {
      'id': 200002,
      'content': 'history sample content'
    }, {
      'id': 200003,
      'content': 'history sample content'
    }, {
      'id': 200004,
      'content': 'history sample content'
    }, {
      'id': 200005,
      'content': 'history sample content'
    }
    ];
  }

  showAllHistory(event): void {
  }

  delete(): void {
  }

}
