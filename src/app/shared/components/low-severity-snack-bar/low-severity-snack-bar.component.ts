import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'mc-low-severity-snack-bar',
  templateUrl: './low-severity-snack-bar.component.html',
  styleUrls: ['./low-severity-snack-bar.component.scss']
})
export class LowSeveritySnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }
}
