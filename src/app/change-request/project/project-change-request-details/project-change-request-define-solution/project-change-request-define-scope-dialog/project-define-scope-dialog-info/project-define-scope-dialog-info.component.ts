import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-project-define-scope-dialog-info',
  templateUrl: './project-define-scope-dialog-info.component.html',
  styleUrls: ['./project-define-scope-dialog-info.component.scss']
})
export class ProjectDefineScopeDialogInfoComponent implements OnInit {
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
