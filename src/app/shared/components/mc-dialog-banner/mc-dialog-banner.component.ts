import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'mc-dialog-banner',
  templateUrl: './mc-dialog-banner.component.html',
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.5)', opacity: 0}),  // initial
        animate('0.2s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({transform: 'scale(1)', opacity: 1}))  // final
      ])
    ])
  ],
  styleUrls: ['./mc-dialog-banner.component.scss']
})
export class MCDialogBannerComponent implements OnInit {
  @Input()
  actionButtonText: string;
  @Input()
  position: string;
  @Input()
  showBanner: boolean;
  @Input()
  hideDismiss: boolean;
  @Output()
  readonly actionButtonClicked: EventEmitter<boolean> = new EventEmitter();
  @Output()
  readonly closeBanner: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.closeBanner.emit(true);
  }

  emitAction() {
    this.actionButtonClicked.emit(true);
  }
}
