import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-help',
  templateUrl: './mc-help.component.html',
  styleUrls: ['./mc-help.component.scss']
})
export class MCHelpComponent implements OnInit {
  helpMessage: string;
  @Input()
  title?: string;
  @Input()
  set message (msg: string) {
    this.helpMessage = msg;
    this.help = new Info( this.message || '', this.title || '', this.animation || '', this.thumbnail || '', this.level || '');
  }
  get message() {
    return this.helpMessage;
  }

  @Input()
  animation?: string;
  @Input()
  thumbnail?: string;
  @Input()
  level?: string;

  help: Info;

  ngOnInit() {
    this.help = new Info( this.message || '', this.title || '', this.animation || '', this.thumbnail || '', this.level || '');
  }

}
