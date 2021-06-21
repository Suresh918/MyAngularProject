import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-agenda-list-loader',
  templateUrl: './agenda-list-loader.component.html',
  styleUrls: ['./agenda-list-loader.component.scss']
})
export class AgendaListLoaderComponent implements OnInit {
  @Input()
  isDashboardWidget: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
