import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mc-air-pbs-import-info',
  templateUrl: './air-pbs-import-info.component.html',
  styleUrls: ['./air-pbs-import-info.component.scss']
})
export class AirPbsImportInfoComponent implements OnInit {
  @Input() formConfiguration: any;
  @Input() triggeredFrom: string;
  @Output() readonly onConfirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onCancel: EventEmitter<void> = new EventEmitter<void>();
  constructor() {
  }

  ngOnInit() {
  }

  onProceed() {
    this.onConfirm.emit();
  }

  onClose() {
    this.onCancel.emit();
  }
}
