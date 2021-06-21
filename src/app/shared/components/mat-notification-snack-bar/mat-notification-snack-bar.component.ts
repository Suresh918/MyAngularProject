import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'mc-mat-notification-snack-bar',
  templateUrl: './mat-notification-snack-bar.component.html',
  styleUrls: ['./mat-notification-snack-bar.component.scss']
})
export class MatNotificationSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private readonly router: Router) {
  }

  ngOnInit() {
  }
}
