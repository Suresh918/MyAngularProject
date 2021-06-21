import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'mc-filter-panel-search',
  templateUrl: './filter-bar-search.component.html',
  styleUrls: ['./filter-bar-search.component.scss']
})
export class FilterBarSearchComponent implements OnInit {
  @Input()
  caseObject: string;
  @Output()
  readonly addKeyword: EventEmitter<string> = new EventEmitter<string>();
  searchControl: FormControl;

  constructor() {
  }

  ngOnInit() {
    this.searchControl = new FormControl();
  }

  onEnter(): void {
    if (this.searchControl.value) {
      const searchTerm = this.searchControl.value.trim();
      this.addKeyword.emit(searchTerm);
      this.clearEntry();
    }
  }

  clearEntry(): void {
    this.searchControl.setValue('');
  }

}
