import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-alert',
  templateUrl: './mc-alert.component.html',
  styleUrls: ['./mc-alert.component.scss']
})
export class MCAlertComponent implements OnInit {
  @Input()
  title?: string;
  @Input()
  message: string;
  @Input()
  animation?: string;
  @Input()
  thumbnail?: string;
  @Input()
  level?: string;
  fetchError: Info;

  ngOnInit() {
    this.fetchError = new Info(this.message || '', this.title || '', this.animation || '', this.thumbnail || '', this.level || '');
  }

}
