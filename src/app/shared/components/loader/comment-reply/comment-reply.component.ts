import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.scss']
})
export class CommentReplyComponent implements OnInit {
  @Input()
  viewType: string;
  constructor() { }

  ngOnInit(): void {
  }

}
