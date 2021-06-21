import {Component, OnInit} from '@angular/core';
import {PageTitleService} from '../../core/services/page-title.service';

@Component({
  selector: 'mc-change-request-list',
  templateUrl: './change-request-list.component.html',
  styleUrls: ['./change-request-list.component.scss']
})

export class ChangeRequestListComponent implements OnInit {
  columnsInTable: string[];

  constructor(private readonly pageTitleService: PageTitleService) {
  }

  ngOnInit() {

    this.columnsInTable = ['id', 'description', 'status', 'actions', 'create'];
    this.pageTitleService.getPageTitle('changeRequest');
  }
}

