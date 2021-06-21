import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-review-details-table',
  templateUrl: './review-details-table.component.html',
  styleUrls: ['./review-details-table.component.scss']
})
export class ReviewDetailsTableComponent implements OnInit {
  @Input()
  count: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
