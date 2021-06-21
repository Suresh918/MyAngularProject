import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AgendaService} from '../../../core/services/agenda.service';
import {Categories, Category} from '../../models/mc-presentation.model';

@Component({
  selector: 'mc-agenda-list-overlay-card',
  templateUrl: './mc-agenda-list-overlay-card.component.html',
  styleUrls: ['./mc-agenda-list-overlay-card.component.scss']
})
export class MCAgendaListOverlayCardComponent implements OnInit {
  @Input()
  caseObjectID: string;
  @Input()
  category: string;
  @Input()
  headerIcon: string;
  @Input()
  headerTitle: string;
  @Input()
  buttonText: string;
  @Input()
  progressBar: boolean;
  @Input()
  overlayData: any;
  @Input()
  showSelector: boolean;
  @Input()
  badgeCount: number;
  agendaItemsOverviewData: Categories | Category;

  constructor(private readonly agendaService: AgendaService,
              private readonly router: Router) {
  }

  ngOnInit() {
  }

  agendaOverviewPanelOpened() {
    event.stopPropagation();
    this.progressBar = true;
    this.agendaService.getAgendaItemsOverviewDetails(this.caseObjectID).subscribe((agendaOverviewDetails) => {
      this.agendaItemsOverviewData = (this.category === 'CCB') ? agendaOverviewDetails as Category : agendaOverviewDetails as Categories;
      this.progressBar = false;
    });
  }

  agendaListItemClicked($event) {
    // this.agendaOverviewItemClicked.emit($event);
    this.router.navigate([]).then(() => {
      window.open('agendas/agenda-items' + '/' + $event.ID, '_blank');
    });
  }

}
