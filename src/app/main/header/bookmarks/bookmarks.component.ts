import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'mc-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  bookmarks: any[];

  constructor() {
  }

  ngOnInit() {
    this.bookmarks = [{
      'id': 200001,
      'content': 'bookmarks sample content'
    }, {
      'id': 200002,
      'content': 'bookmarks sample content'
    }, {
      'id': 200003,
      'content': 'bookmarks sample content'
    }, {
      'id': 200004,
      'content': 'bookmarks sample content'
    }, {
      'id': 200005,
      'content': 'bookmarks sample content'
    }
    ];
  }

  showAllBookmarks(event): void {
  }

  delete(): void {
  }

}
