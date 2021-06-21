import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-creator-define-scope-dialog-info',
  templateUrl: './creator-define-scope-dialog-info.component.html',
  styleUrls: ['./creator-define-scope-dialog-info.component.scss']
})
export class CreatorDefineScopeDialogInfoComponent implements OnInit {
  @Input() formConfiguration: any;
  @Output() readonly onConfirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onCancel: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  onProceed() {
    this.onConfirm.emit();
  }

  onClose() {
    this.onCancel.emit();
  }

}
