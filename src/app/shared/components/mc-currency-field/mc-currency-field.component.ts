import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-currency-field',
  templateUrl: './mc-currency-field.component.html',
  styleUrls: ['./mc-currency-field.component.scss']
})
export class MCCurrencyFieldComponent implements OnInit {
  @Input()
  thousandsSeparator: string;
  @Input()
  currencyCode: string;
  @Input()
  placeholder: string;
  @Input()
  fontSize: string;
  @Input()
  value: string;
  minIntegerDigits: number;
  minFractionDigits: number;
  maxFractionDigits: number;

  constructor() {
    this.minIntegerDigits = 1;
    this.minFractionDigits = 0;
    this.maxFractionDigits = 0;
    this.thousandsSeparator = '.';
  }

  ngOnInit() {
  }

  toNumber(data: string): number {
    return +data;
  }

  getDisplayFormat(): string {
    return `${this.minIntegerDigits}.${this.minFractionDigits}-${this.maxFractionDigits}`;
  }
}
